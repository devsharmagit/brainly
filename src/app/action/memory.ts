"use server";

import { AppError, authAsyncCatcher } from "@/lib/asyncCatcher";
import { prisma } from "@/lib/prisma";
import { CATEGORY, Memory } from "@prisma/client";


interface createMemoryInterface {
  link?: string;
  content?: string;
  category: CATEGORY;
}
interface updateMemoryInterface {
  id: number,
  content?: string,
  link?: string
}

export const createMemory = authAsyncCatcher<createMemoryInterface, Memory>(
  async({category, link, content, session})=>{
  
  if (
    category === "LINK" ||
    category === "TWTLINK" ||
    category === "YTLINK"
  ) {
    
    if (!link) {
      throw new AppError("Invalid Inputs !")
    }
    const memory = await prisma.memory.create({
      data: {
        link: link,
        category: category,
        userId: session.user.id,
      },
    });
      return {
        success: true,
        data: memory,
        message: "Memory created suucessfully !",
      };
  } else if (category === "NOTE") {
    const memory = await prisma.memory.create({
      data: {
        content,
        category: category,
        userId: session.user.id,
      },
    });
      return {
        success: true,
        data: memory,
        message: "Memory created suucessfully !",
      };
  }
  throw new AppError("Invalid category");
});



export const getAllMemories = authAsyncCatcher<void, Memory[]>(
  async({session})=>{

    const allMemories = await prisma.memory.findMany({
      where: {userId: session.user.id}
    })

    return {
      success: true,
      data: allMemories,
      message: "All Memory fetched Successfully!"
    }
  })


export const updateMemory = authAsyncCatcher<updateMemoryInterface, Memory>(
  async ({id, content, link, session})=>{
    
    const isUserMemory = await prisma.memory.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!isUserMemory) {
      throw new AppError("You dont have permissions to perform the operation.")
    }
    const newMemory = await prisma.memory.update({
      where:{
        id: id,
        userId: session.user.id,
      }, data: {
        link: link,
        content: content
      }
    })

    return {
      success : true,
      message : "Successfully Updated the Memory!",
      data: newMemory
    }


  }
)


export const deleteMemory = authAsyncCatcher<{id:number}, null>(
  async({id, session})=>{
    
    const isUserMemory = await prisma.memory.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!isUserMemory) {
      throw new AppError("You dont have permissions to perform the operation.")
    }
    await prisma.memory.delete({
    where:{
      id: id,
        userId: session.user.id,
    }
    })

    return {
      data: null,
      success: true,
      message: "Successfully Deleted the Memory!"
    }

  }
)

