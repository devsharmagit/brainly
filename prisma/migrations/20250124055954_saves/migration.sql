-- CreateEnum
CREATE TYPE "CATEGORY" AS ENUM ('LINK', 'YTLINK', 'TWTLINK', 'NOTE');

-- CreateTable
CREATE TABLE "Saves" (
    "id" SERIAL NOT NULL,
    "category" "CATEGORY" NOT NULL,
    "content" TEXT,
    "link" TEXT,
    "userId" INTEGER NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Saves_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Saves" ADD CONSTRAINT "Saves_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
