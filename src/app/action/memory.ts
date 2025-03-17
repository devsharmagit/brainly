"use server";

import { AppError, authAsyncCatcher } from "@/lib/asyncCatcher";
import { prisma } from "@/lib/prisma";
import { Memory, Chat } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  getYoutubeDetails,
  giveLinkDetails,
  giveTweetInfo,
} from "@/lib/scrape";
import { checkLinkType, contentMaker } from "@/lib/utils";
import { genAI, generateEmbeddings } from "@/lib/embeddings";
import { addVectorData, deleteVectorData, getVectorEmbeddigsById, queryVectorDB } from "@/lib/pinecone";

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface CreateMemoryLinkInterface {
  link: string;
}

interface CreateMemoryNoteInterface {
  content: string;
}

interface GetAIChatInterface {
  prompt: string;
}

// type ResponseAIChat = Chat & {
// context : Memory[]
// }

export const getAIChat = authAsyncCatcher<GetAIChatInterface, Chat>(
  async ({ prompt, session }) => {
    // convert to embeddings
    const embedding = await generateEmbeddings(prompt);

    if (!embedding)
      throw new AppError("Something went wront generating embeddings");

    // query using embedding
    const result = await queryVectorDB(session.user.id, embedding);

    console.log(result);
    const memoriesIds = result?.matches.map(({ metadata }) => {
      if (metadata) {
        return Number(metadata.memoryId);
      }
    });

    const context = result?.matches
      .map(({ metadata }) => {
        if (!metadata) return "";
        return metadata.content;
      })
      .join(" \n ");

    console.log(context);

    const response = await model.generateContent(
      `You are a helpul AI agent that is designed to help the user. You should return the response in markdown. \n  Context:\n${context}\n \n Question: ${prompt}`
    );

    const chat = await prisma.chat.create({
      data: {
        prompt,
        response: response.response.text(),
        userId: session.user.id,
        context: {
          create: memoriesIds?.map((memoryId) => ({
            memory: {
              connect: { id: memoryId },
            },
          })),
        },
      },
      include: {
        context: {
          include: { memory: true },
        },
      },
    });

    if (!response.response.candidates)
      throw new AppError("REsponse candidate was not defined");
    console.log(response.response);
    return {
      success: true,
      data: chat,
      message: "Successfully fetched the result",
    };
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

export const createMemoryLink = authAsyncCatcher<
  CreateMemoryLinkInterface,
  Memory
>(async ({ link, session }) => {
  // TODO
  // parsing with zod
  if (!link) {
    throw new AppError("Invalid Inputs !");
  }

  const category = checkLinkType(link);
  let memory;

  const alreadyMemory = await prisma.memory.findFirst({
    where:{
      OR:[
        {
          AND: [
            {link,
              userId: session.user.id
            }
          ]
        },
        {link}
      ]
    },
    orderBy: {userId: "desc"}
  })
console.log("##############################################")
console.log(alreadyMemory)
  if(alreadyMemory && (alreadyMemory.userId === session.user.id)){
   throw new AppError("You have already saved that website.")
  }

  if(alreadyMemory){
  console.log("😍😍😍😍😍😍😍😍")
    const embeddings = await getVectorEmbeddigsById(alreadyMemory.id)
    if(embeddings){
      const newmemory = await prisma.memory.create(
        {data : {
          category: alreadyMemory.category,
          description: alreadyMemory.description,
          content: alreadyMemory.content,
          imageUrl: alreadyMemory.imageUrl,
          link: alreadyMemory.link,
          title: alreadyMemory.title,
          userId: session.user.id
        }}
      )
      if(newmemory){
        console.log("❤️❤️❤️❤️❤️❤️❤️❤️❤️")
        await addVectorData({
          id: newmemory.id,
          vector_embeddings: embeddings,
          metaData: {
            content: newmemory.content,
            userId: newmemory.userId,
            memoryId: newmemory.id,
          },
        });
      
        revalidatePath("/dashboard");
        return {
          success: true,
          data: newmemory,
          message: "Memory created suucessfully !",
        };
      }
    }
  }

  if (checkLinkType(link) === "YTLINK") {
    const scrapeDetails = await getYoutubeDetails(link);
    const content = contentMaker({
      category: "YTLINK",
      link,
      details: scrapeDetails.details,
      title: scrapeDetails.title,
      description: scrapeDetails.description,
      keywords: scrapeDetails.keywords,
    });
    memory = await prisma.memory.create({
      data: {
        link: link,
        category: category,
        userId: session.user.id,
        title: scrapeDetails.title,
        imageUrl: scrapeDetails.image,
        content,
      },
    });
  }
  if (checkLinkType(link) === "LINK") {
    const {
      title,
      description,
      image,
      content: details,
      keywords,
    } = await giveLinkDetails(link);
    const content = contentMaker({
      category: "LINK",
      link,
      title,
      description,
      details,
      keywords,
    });
    memory = await prisma.memory.create({
      data: {
        link: link,
        category: category,
        userId: session.user.id,
        title: title,
        description: description,
        imageUrl: image,
        content,
      },
    });
  }
  if (checkLinkType(link) === "TWTLINK") {
    const tweetDetails = await giveTweetInfo(link);
    const content = contentMaker({
      category: "TWTLINK",
      details: tweetDetails.description,
      createrName: tweetDetails.creatorName,
    });
    memory = await prisma.memory.create({
      data: {
        link,
        content,
        category,
        userId: session.user.id,
        description: tweetDetails.description,
      },
    });
  }

  if (!memory) throw new AppError("Something went wrong creating memory !");

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
    message: "Memory created suucessfully !",
  };
});

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
