"use server";

import { AppError, authAsyncCatcher } from "@/lib/asyncCatcher";
import { prisma } from "@/lib/prisma";
import { Memory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getYoutubeDetails, giveLinkDetails, giveTweetInfo } from "@/lib/scrape";
import { checkLinkType } from "@/lib/utils";

interface CreateMemoryLinkInterface {
  link: string;
}

interface CreateMemoryNoteInterface {
  content : string
}

export const createMemoryNote = authAsyncCatcher<CreateMemoryNoteInterface, Memory>(
  async ({content, session})=>{
    // TODO
    // parse content with zod
    const memory = await prisma.memory.create({
      data:{
        category: "NOTE",
        content: `category :- Note \n conten :- ${content}`,
        userId: session.user.id,
        description: content
      }
    })
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
      const content = `category :- youtube link \n keywords :- ${
        scrapeDetails.keywords || "NA"
      } \n link :- ${link || "NA"} \n title :- ${scrapeDetails.title} `;
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
      const scrapeDetails = await giveLinkDetails(link);
      const content = `category :- link \n keywords :- ${
        scrapeDetails.keywords || "NA"
      } \n link :- ${link || "NA"} \n content :- ${
        scrapeDetails.content || "NA"
      }`;
      memory = await prisma.memory.create({
        data: {
          link: link,
          category: category,
          userId: session.user.id,
          title: scrapeDetails.title,
          description: scrapeDetails.description,
          imageUrl: scrapeDetails.image,
          content,
        },
      });
    }
    if (checkLinkType(link) === "TWTLINK") {
      const tweetDetails = await giveTweetInfo(link);
      const content = `category :- tweeter link \n  link :- ${
        link || "NA"
      } \n content :- ${tweetDetails.description || "NA"} \n creater :- ${
        tweetDetails.creatorName || "NA"
      }`;

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
