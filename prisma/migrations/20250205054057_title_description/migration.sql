/*
  Warnings:

  - You are about to drop the column `pinned` on the `Memory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Memory" DROP COLUMN "pinned",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "title" TEXT;
