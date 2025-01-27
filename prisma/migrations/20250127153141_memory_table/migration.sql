/*
  Warnings:

  - You are about to drop the `Saves` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Saves" DROP CONSTRAINT "Saves_userId_fkey";

-- DropTable
DROP TABLE "Saves";

-- CreateTable
CREATE TABLE "Memory" (
    "id" SERIAL NOT NULL,
    "category" "CATEGORY" NOT NULL,
    "content" TEXT,
    "link" TEXT,
    "userId" INTEGER NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
