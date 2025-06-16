import { PrismaClient } from "@prisma/client";
export type { Memory, Chat, Message } from "@prisma/client";
export { CATEGORY } from "@prisma/client";

export const prisma = new PrismaClient();


