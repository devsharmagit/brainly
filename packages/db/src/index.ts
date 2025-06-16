import { PrismaClient } from "@prisma/client";
export { Memory, Chat, Message, CATEGORY } from "@prisma/client";

export const prisma = new PrismaClient();


