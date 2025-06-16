"use server";

import { AppError, authAsyncCatcher } from "@/lib/asyncCatcher";
import { model } from "@/lib/embeddings";
import { prisma } from "@/lib/prisma";
import { Chat, Memory, Message } from "@repo/db/client";

type ChatWithContext = Chat & {
  context : {
    chatId: number,
    memoryId: number,
    memory: Memory
  }[]
}

interface ChatResposneInterface {
    chat: ChatWithContext,
    messages: Message[]
}

export const getChatById = authAsyncCatcher<{ chatId: number }, ChatResposneInterface>(
  async ({ chatId, session }) => {
    // TODO validate chatId with zod
    const chat = await prisma.chat.findFirst({
      where: {
        userId: session.user.id,
        id: chatId,
      },
      include: {
        context: {
          include: {
            memory: true,
          },
          orderBy: {
            score: "desc"
          }
        },
      },
    });
    if (!chat) {
      throw new AppError("Chat doesn't exist.");
    }

    const messages = await prisma.message.findMany({
        where: {
            chatId: chatId
        },
        orderBy:{
            createAt: "desc"
        }
    })

    return {
      success: true,
      data: {chat, messages},
      message: "Successfully fetched the result",
    };
  }
);

interface MessageSentProps {
  chatId: number;
  message: string;
}

// user ask futhur question from AI
export const messageSent = authAsyncCatcher<MessageSentProps, Message>(
  async ({ chatId, message, session }) => {
    // TODO validate message with zod

    // check if chatid exists or not
    const chat = await prisma.chat.findFirst({
      where: {
        userId: session.user.id,
        id: chatId,
      },
    });
    if (!chat) {
      throw new AppError("Chat doesn't exist.");
    }

    // register user asked message in the db
    const userMessage = await prisma.message.create({
      data: {
        isSentbyAI: false,
        message,
        chatId,
      },
    });

    if (!userMessage) {
      throw new AppError("Something went wrong while entering the message.");
    }

    const response = await model.generateContent(
      `You are a helpul AI agent that is designed to help the user. You should return the response in markdown. \n  Context:\n${chat.contextString}\n \n Question: ${message}`
    );

    if (!response.response.text()) {
      throw new AppError(
        "Something went wrong while generating gemini response"
      );
    }

    // store the response in the db

    const aiMessage = await prisma.message.create({
      data: {
        isSentbyAI: true,
        chatId,
        message: response.response.text(),
      },
    });

    return {
      data: aiMessage,
      success: true,
      message: "Successfully get the AI response",
    };
  }
);

interface GetAllChatResponse {
  id: number;
  prompt: string;
  createAt: Date;
  _count: {
      user: number;
      context: number;
      messages: number;
  };
}

export const getAllChat = authAsyncCatcher<void, GetAllChatResponse[]>(
  async ({ session }) => {
    const chats = await prisma.chat.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        prompt: true,
        createAt: true,
        _count: true,
      },
      orderBy:{
        createAt: "desc"
      }
    });

    return {
      success: true,
      data: chats,
      message: "Successfully retrived all users chats.",
    };
  }
);
