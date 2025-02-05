/*
  Warnings:

  - Made the column `content` on table `Memory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Memory" ALTER COLUMN "content" SET NOT NULL;
