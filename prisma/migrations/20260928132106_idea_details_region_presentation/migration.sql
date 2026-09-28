-- CreateEnum
CREATE TYPE "IdeaVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterEnum
ALTER TYPE "IdeaCategory" ADD VALUE 'INFRASTRUCTURE';

-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "estimatedCost" BIGINT,
ADD COLUMN     "visibility" "IdeaVisibility" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "area" INTEGER,
ADD COLUMN     "capital" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "population" INTEGER;

-- CreateTable
CREATE TABLE "IdeaAttachment" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdeaAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IdeaAttachment_ideaId_idx" ON "IdeaAttachment"("ideaId");

-- AddForeignKey
ALTER TABLE "IdeaAttachment" ADD CONSTRAINT "IdeaAttachment_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
