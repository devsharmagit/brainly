-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "response" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMemory" (
    "chatId" INTEGER NOT NULL,
    "memoryId" INTEGER NOT NULL,

    CONSTRAINT "ChatMemory_pkey" PRIMARY KEY ("chatId","memoryId")
);

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMemory" ADD CONSTRAINT "ChatMemory_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMemory" ADD CONSTRAINT "ChatMemory_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
