"use server";

import { AppError, authAsyncCatcher } from "@/lib/asyncCatcher";
import { prisma } from "@/lib/prisma";
import { Memory, Chat } from "@repo/db/client";
import { revalidatePath } from "next/cache";
import { generateEmbeddings, model } from "@/lib/embeddings";
import { deleteVectorData, queryVectorDB } from "@/lib/pinecone";
import { linkSchema } from "@/lib/formSchema";
import { client } from "@/lib/redis";

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
        throw new AppError(
          "No relevant memories found to answer your question"
        );
      }

      // Filter memories by relevance score (only keep highly relevant ones)
      const RELEVANCE_THRESHOLD = 0.5;
      const relevantMatches = result.matches.filter(
        (match) => (match.score ?? 0) >= RELEVANCE_THRESHOLD
      );

      const memoryData = relevantMatches
        .map(({ metadata, score }) => {
          if (!metadata?.memoryId) return null;
          return {
            memoryId: Number(metadata.memoryId),
            score: score ?? 0,
          };
        })
        .filter(
          (data): data is { memoryId: number; score: number } => data !== null
        );

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
              score: data.score,
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
      console.log(error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to process your question. Please try again.");
    }
  }
);

enum DATA_TYPE {
  LINK,
  NOTE,
}

export const createMemoryNote = authAsyncCatcher<
  CreateMemoryNoteInterface,
  number
>(async ({ content, session }) => {
  const process = await prisma.process.create({
    data: {
      data: content,
      userId: session.user.id,
    },
  });

  if (!process)
    throw new AppError("Something went wrong while creating process.");
  await client.lPush(
    "task-queue",
    JSON.stringify({
      processId: process.id,
      data: process.data,
      userId: process.userId,
      type: DATA_TYPE.NOTE,
    })
  );

  return {
    success: true,
    data: process.id,
    message: "Successfully create memory",
  };
});

export const createMemoryLink = authAsyncCatcher<
  CreateMemoryLinkInterface,
  number
>(async ({ link, session }) => {
  const result = linkSchema.safeParse({ link });
  if (!link || !result.success) {
    throw new AppError("Invalid link input");
  }

  const process = await prisma.process.create({
    data: {
      data: link,
      userId: session.user.id,
    },
  });

  if (!process) throw new AppError("Something went wrong while creating process.");

  await client.lPush(
    "task-queue",
    JSON.stringify({
      processId: process.id,
      data: process.data,
      userId: process.userId,
      type: DATA_TYPE.LINK,
    })
  );

  return {
    success: true,
    data: process.id,
    message: "Successfully create memory",
  };
});

export const getAllMemories = authAsyncCatcher<void, Memory[]>(
  async ({ session }) => {
    const allMemories = await prisma.memory.findMany({
      where: { userId: session.user.id },
      orderBy: {
        createdAt: "desc",
      },
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
