-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CITIZEN', 'ADMIN');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "IdeaCategory" AS ENUM ('AMELIORATION', 'SIGNALEMENT', 'INVESTISSEMENT', 'PROJET_COMMUNAUTAIRE');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNED', 'ONGOING', 'DONE');

-- CreateEnum
CREATE TYPE "ParticipationType" AS ENUM ('INITIATIVE', 'MAYOR_CANDIDACY');

-- CreateEnum
CREATE TYPE "NewsType" AS ENUM ('NEWS', 'EVENT', 'MEETING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CITIZEN',
    "communeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "centroidLat" DOUBLE PRECISION NOT NULL,
    "centroidLng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commune" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "population" INTEGER,
    "description" TEXT,
    "centroidLat" DOUBLE PRECISION NOT NULL,
    "centroidLng" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Commune_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "communeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNED',
    "startDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "IdeaCategory" NOT NULL,
    "authorId" TEXT NOT NULL,
    "communeId" TEXT NOT NULL,
    "status" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "adminReply" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdeaVote" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdeaVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "ModerationStatus" NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipationRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "communeId" TEXT NOT NULL,
    "type" "ParticipationType" NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParticipationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "NewsType" NOT NULL DEFAULT 'NEWS',
    "communeId" TEXT,
    "regionId" TEXT,
    "eventDate" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Region_slug_key" ON "Region"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Department_slug_key" ON "Department"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Department_regionId_name_key" ON "Department"("regionId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Commune_slug_key" ON "Commune"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Commune_departmentId_name_key" ON "Commune"("departmentId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "IdeaVote_ideaId_userId_key" ON "IdeaVote"("ideaId", "userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "Commune"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commune" ADD CONSTRAINT "Commune_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "Commune"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "Commune"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdeaVote" ADD CONSTRAINT "IdeaVote_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdeaVote" ADD CONSTRAINT "IdeaVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipationRequest" ADD CONSTRAINT "ParticipationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipationRequest" ADD CONSTRAINT "ParticipationRequest_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "Commune"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "Commune"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
