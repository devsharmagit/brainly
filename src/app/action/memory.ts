"use server";

import { AppError, authAsyncCatcher } from "@/lib/asyncCatcher";
import { prisma } from "@/lib/prisma";
import { Memory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {  getYoutubeDetails, giveLinkDetails, giveTweetInfo } from "@/lib/scrape";
import { checkLinkType, contentMaker } from "@/lib/utils";
import { genAI, generateEmbeddings } from "@/lib/embeddings";
import { addVectorData, queryVectorDB } from "@/lib/pinecone";


interface CreateMemoryLinkInterface {
  link: string;
}

interface CreateMemoryNoteInterface {
  content : string
}

interface GetAIChatInterface {
  prompt: string
}

export const getAIChat = authAsyncCatcher<GetAIChatInterface, string>(
  async ({prompt, session})=>{

    // convert to embeddings
    const embedding = await generateEmbeddings(prompt)

    if(!embedding) throw new AppError("Something went wront generating embeddings")

    // query using embedding
const result = await queryVectorDB(session.user.id, embedding)

const context = result?.matches.map(({metadata})=>{
  if(!metadata) return ""
  return metadata.content
}).join(" \n ")


    // send relavant to gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const response = await model.generateContent(`You are a helpul AI agent. \n  Context:\n${context}\n \n Question: ${prompt}`);

if(!response.response.candidates) throw new AppError("REsponse candidate was not defined")
console.log(response.response)
    return {
      success: true,
      data: response.response.text(),
      message: "Successfully fetched the result",
    }
  }
)

export const createMemoryNote = authAsyncCatcher<CreateMemoryNoteInterface, Memory>(
  async ({content, session})=>{
    // TODO
    // parse content with zod
    const memory = await prisma.memory.create({
      data:{
        category: "NOTE",
        content: contentMaker({category: "NOTE", details: content}),
        userId: session.user.id,
        description: content
      }
    })
    const vectorEmbedding = await generateEmbeddings(memory.content)
    if(!vectorEmbedding) throw new AppError("Something went wrong creating vector embeddings")
     await addVectorData({id: memory.id, vector_embeddings: vectorEmbedding, metaData: {content: memory.content, userId: memory.userId, memoryId: memory.id}})
    
    revalidatePath("/dashboard");
    return {
      success: true,
      data: memory,
      message: "Successfully create memory"
    }


  }
)

export const createMemoryLink = authAsyncCatcher<CreateMemoryLinkInterface, Memory>(
  async ({ link, session }) => {
    // TODO
    // parsing with zod
    if (!link) {
      throw new AppError("Invalid Inputs !");
    }

    const category = checkLinkType(link);
    let memory;

    if (checkLinkType(link) === "YTLINK") {
      const scrapeDetails = await getYoutubeDetails(link);
      const content = contentMaker({category: "YTLINK", link, details: scrapeDetails.details, title: scrapeDetails.title, description: scrapeDetails.description, keywords: scrapeDetails.keywords})
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
      const {title, description,image, content : details, keywords} = await giveLinkDetails(link);
      const content = contentMaker({category: "LINK",link, title, description, details, keywords})
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
      const content = contentMaker({category: "TWTLINK", details: tweetDetails.description, createrName: tweetDetails.creatorName })
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
    
    const vectorEmbedding = await generateEmbeddings(memory.content)
    if(!vectorEmbedding) throw new AppError("Something went wrong creating vector embeddings")
     await addVectorData({id: memory.id, vector_embeddings: vectorEmbedding, metaData: {content: memory.content, userId: memory.userId, memoryId: memory.id}})
    
    
    revalidatePath("/dashboard");
    return {
      success: true,
      data: memory,
      message: "Memory created suucessfully !",
    };
  }
);

export const getAllMemories = authAsyncCatcher<void, Memory[]>(
  async ({ session }) => {
    const allMemories = await prisma.memory.findMany({
      where: { userId: session.user.id },
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
      throw new AppError("You dont have permissions to perform the operation.");
    }
    await prisma.memory.delete({
      where: {
        id: id,
        userId: session.user.id,
      },
    });
    revalidatePath("/dashboard");

    return {
      data: null,
      success: true,
      message: "Successfully Deleted the Memory!",
    };
  }
);
