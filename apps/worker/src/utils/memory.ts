import { Memory, prisma } from "@repo/db/client";
import { checkLinkType, contentMaker } from "./util";
import { generateEmbeddings } from "./embeddings";
import { addVectorData, getVectorEmbeddigsById } from "./pinecone";
import { getYoutubeDetails, giveLinkDetails, giveTweetInfo } from "./scrape";

interface CreateNoteMemoryInterface {
    processId : number,
    note : string,
    userId: number
}

export const createNoteMemory = async({processId, note, userId}: CreateNoteMemoryInterface)=>{
  // TODO
  // parse content with zod
  const memory = await prisma.memory.create({
    data: {
      category: "NOTE",
      content: contentMaker({ category: "NOTE", details: note }),
      userId: userId,
      description: note,
    },
  });
  const vectorEmbedding = await generateEmbeddings(memory.content);
  if (!vectorEmbedding) return
  await addVectorData({
    id: memory.id,
    vector_embeddings: vectorEmbedding,
    metaData: {
      content: memory.content,
      userId: memory.userId,
      memoryId: memory.id,
    },
  });
//   finally update the process id in the db
}

interface CreateMemoryLinkInterface {
    processId : number,
    link: string,
    userId: number
}

export const createLinkMemory = async ({processId, link, userId}: CreateMemoryLinkInterface)=>{

    // Check for existing memory
    const existingMemory = await checkExistingMemory(link, userId);
    

    // If memory exists but belongs to another user, create a copy
    if (existingMemory) {
      const newMemory = await createMemoryFromExisting(existingMemory, userId);
      if (newMemory) {
return
      }
    }

    // Create new memory based on link type
    let memory: Memory | null = null;
    const linkType = checkLinkType(link);

    switch (linkType) {
      case "YTLINK":
        memory = await createYoutubeMemory(link, userId);
        break;
      case "LINK":
        memory = await createWebLinkMemory(link, userId);
        break;
      case "TWTLINK":
        memory = await createTweetMemory(link, userId);
        break;
      default:
        throw new Error("Unsupported link type");
    }

    if (!memory) {
      throw new Error("Failed to create memory");
    }

    // Add to vector database
    await addMemoryToVectorDB(memory);

    // update process to successfull in the database
   return
  }

// #######################################################
// #######################################################
// #######################################################
// #######################################################


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
    throw new Error("Failed to generate vector embeddings");
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

