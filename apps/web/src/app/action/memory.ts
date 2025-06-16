"use server";

import { AppError, authAsyncCatcher } from "@/lib/asyncCatcher";
import { prisma } from "@/lib/prisma";
import { Memory, Chat } from "@repo/db/client";
import { revalidatePath } from "next/cache";
import {
  getYoutubeDetails,
  giveLinkDetails,
  giveTweetInfo,
} from "@/lib/scrape";
import { checkLinkType, contentMaker } from "@/lib/utils";
import { generateEmbeddings, model } from "@/lib/embeddings";
import { addVectorData, deleteVectorData, getVectorEmbeddigsById, queryVectorDB } from "@/lib/pinecone";
import { linkSchema } from "@/lib/formSchema";



interface CreateMemoryLinkInterface {
  link: string;
}

interface CreateMemoryNoteInterface {
  content: string;
}

interface GetAIChatInterface {
  prompt: string;
}


export const getAIChat = authAsyncCatcher<GetAIChatInterface, Chat>(
  async ({ prompt, session }) => {
    try {
      // convert to embeddings
      const embedding = await generateEmbeddings(prompt);
      if (!embedding) {
        throw new AppError("Failed to generate embeddings for the prompt");
      }

      // query using embedding
      const result = await queryVectorDB(session.user.id, embedding);
      if (!result?.matches?.length) {
        throw new AppError("No relevant memories found to answer your question");
      }

      // Filter memories by relevance score (only keep highly relevant ones)
      const RELEVANCE_THRESHOLD = 0.5;
      const relevantMatches = result.matches.filter(match => (match.score ?? 0) >= RELEVANCE_THRESHOLD);

      const memoryData = relevantMatches.map(({ metadata, score }) => {
        if (!metadata?.memoryId) return null;
        return {
          memoryId: Number(metadata.memoryId),
          score: score ?? 0
        };
      }).filter((data): data is { memoryId: number; score: number } => data !== null);

      // Format context in a more structured way
      const context = relevantMatches
        .map(({ metadata, score }) => {
          if (!metadata?.content) return "";
          return `[Relevance: ${((score ?? 0) * 100).toFixed(1)}%]\n${metadata.content}`;
        })
        .filter(Boolean)
        .join("\n\n---\n\n");

      const systemPrompt = `You are a helpful AI assistant that uses the user's personal memories to provide relevant and accurate answers. 
Your responses should be:
1. Based primarily on the provided context
2. Clear and concise
3. Formatted in markdown
4. Honest about what you know and don't know
5. Include relevant details from the context when appropriate

If the context doesn't contain enough information to answer the question, say so clearly.`;

      const response = await model.generateContent(
        `${systemPrompt}\n\nContext:\n${context}\n\nQuestion: ${prompt}`
      );

      if (!response.response.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new AppError("Failed to generate a valid response");
      }

      const chat = await prisma.chat.create({
        data: {
          prompt,
          response: response.response.candidates[0].content.parts[0].text,
          contextString: context,
          userId: session.user.id,
          context: {
            create: memoryData.map((data) => ({
              memory: {
                connect: { id: data.memoryId },
              },
              score: data.score
            })),
          },
        },
        include: {
          context: {
            include: { memory: true },
          },
        },
      });

      return {
        success: true,
        data: chat,
        message: "Successfully generated response based on your memories",
      };
    } catch (error) {
      console.log(error)
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to process your question. Please try again.");
    }
  }
);

export const createMemoryNote = authAsyncCatcher<
  CreateMemoryNoteInterface,
  Memory
>(async ({ content, session }) => {
  // TODO
  // parse content with zod
  const memory = await prisma.memory.create({
    data: {
      category: "NOTE",
      content: contentMaker({ category: "NOTE", details: content }),
      userId: session.user.id,
      description: content,
    },
  });
  const vectorEmbedding = await generateEmbeddings(memory.content);
  if (!vectorEmbedding)
    throw new AppError("Something went wrong creating vector embeddings");
  await addVectorData({
    id: memory.id,
    vector_embeddings: vectorEmbedding,
    metaData: {
      content: memory.content,
      userId: memory.userId,
      memoryId: memory.id,
    },
  });

  revalidatePath("/dashboard");
  return {
    success: true,
    data: memory,
    message: "Successfully create memory",
  };
});

// Helper functions for createMemoryLink
async function checkExistingMemory(link: string, userId: number) {
  return await prisma.memory.findFirst({
    where: {
      OR: [
        {
          AND: [
            { link, userId }
          ]
        },
        { link }
      ]
    },
    orderBy: { userId: "desc" }
  });
}

async function createMemoryFromExisting(existingMemory: Memory, userId: number) {
  const embeddings = await getVectorEmbeddigsById(existingMemory.id);
  if (!embeddings) return null;

  const newMemory = await prisma.memory.create({
    data: {
      category: existingMemory.category,
      description: existingMemory.description,
      content: existingMemory.content,
      imageUrl: existingMemory.imageUrl,
      link: existingMemory.link,
      title: existingMemory.title,
      userId
    }
  });

  await addVectorData({
    id: newMemory.id,
    vector_embeddings: embeddings,
    metaData: {
      content: newMemory.content,
      userId: newMemory.userId,
      memoryId: newMemory.id,
    },
  });

  return newMemory;
}

async function createYoutubeMemory(link: string, userId: number) {
  const scrapeDetails = await getYoutubeDetails(link);
  const content = contentMaker({
    category: "YTLINK",
    link,
    details: scrapeDetails.details,
    title: scrapeDetails.title,
    description: scrapeDetails.description,
    keywords: scrapeDetails.keywords,
  });

  return await prisma.memory.create({
    data: {
      link,
      category: "YTLINK",
      userId,
      title: scrapeDetails.title,
      imageUrl: scrapeDetails.image,
      content,
    },
  });
}

async function createWebLinkMemory(link: string, userId: number) {
  const { title, description, image, content: details, keywords } = await giveLinkDetails(link);
  const content = contentMaker({
    category: "LINK",
    link,
    title,
    description,
    details,
    keywords,
  });

  return await prisma.memory.create({
    data: {
      link,
      category: "LINK",
      userId,
      title,
      description,
      imageUrl: image,
      content,
    },
  });
}

async function createTweetMemory(link: string, userId: number) {
  const tweetDetails = await giveTweetInfo(link);
  const content = contentMaker({
    category: "TWTLINK",
    details: tweetDetails.description,
    createrName: tweetDetails.creatorName,
  });

  return await prisma.memory.create({
    data: {
      link,
      content,
      category: "TWTLINK",
      userId,
      description: tweetDetails.description,
    },
  });
}

async function addMemoryToVectorDB(memory: Memory) {
  const vectorEmbedding = await generateEmbeddings(memory.content);
  if (!vectorEmbedding) {
    throw new AppError("Failed to generate vector embeddings");
  }

  await addVectorData({
    id: memory.id,
    vector_embeddings: vectorEmbedding,
    metaData: {
      content: memory.content,
      userId: memory.userId,
      memoryId: memory.id,
    },
  });
}

export const createMemoryLink = authAsyncCatcher<CreateMemoryLinkInterface, Memory>(
  async ({ link, session }) => {
    const result = linkSchema.safeParse({ link });
    if (!link || !result.success) {
      throw new AppError("Invalid link input");
    }

    // Check for existing memory
    const existingMemory = await checkExistingMemory(link, session.user.id);
    if (existingMemory?.userId === session.user.id) {
      throw new AppError("You have already saved this website");
    }

    // If memory exists but belongs to another user, create a copy
    if (existingMemory) {
      const newMemory = await createMemoryFromExisting(existingMemory, session.user.id);
      if (newMemory) {
        revalidatePath("/dashboard");
        return {
          success: true,
          data: newMemory,
          message: "Memory created successfully!",
        };
      }
    }

    // Create new memory based on link type
    let memory: Memory | null = null;
    const linkType = checkLinkType(link);

    switch (linkType) {
      case "YTLINK":
        memory = await createYoutubeMemory(link, session.user.id);
        break;
      case "LINK":
        memory = await createWebLinkMemory(link, session.user.id);
        break;
      case "TWTLINK":
        memory = await createTweetMemory(link, session.user.id);
        break;
      default:
        throw new AppError("Unsupported link type");
    }

    if (!memory) {
      throw new AppError("Failed to create memory");
    }

    // Add to vector database
    await addMemoryToVectorDB(memory);

    revalidatePath("/dashboard");
    return {
      success: true,
      data: memory,
      message: "Memory created successfully!",
    };
  }
);

export const getAllMemories = authAsyncCatcher<void, Memory[]>(
  async ({ session }) => {
    const allMemories = await prisma.memory.findMany({
      where: { userId: session.user.id },
      orderBy: {
        createdAt: "desc"
      }
    });

    return {
      success: true,
      data: allMemories,
      message: "All Memory fetched Successfully!",
    };
  }
);

export const deleteMemory = authAsyncCatcher<{ id: number }, null>(
  async ({ id, session }) => {
    const isUserMemory = await prisma.memory.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!isUserMemory) {
      throw new AppError("You dont have permissions to perform the action.");
    }
    await prisma.memory.delete({
      where: {
        id: id,
        userId: session.user.id,
      },
    });
    
    await deleteVectorData(String(id));

    revalidatePath("/dashboard");

    return {
      data: null,
      success: true,
      message: "Successfully Deleted the Memory!",
    };
  }
);
