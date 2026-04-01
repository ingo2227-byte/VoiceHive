/*
  Warnings:

  - You are about to drop the `Volk` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Volk";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hive" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HiveNote" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "hiveId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HiveNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inspection" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "hiveId" TEXT NOT NULL,
    "inspectedAt" TIMESTAMP(3) NOT NULL,
    "broodFrames" INTEGER,
    "honeyFrames" INTEGER,
    "temperament" TEXT,
    "queenSeen" BOOLEAN,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceCapture" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "hiveId" TEXT,
    "rawText" TEXT NOT NULL,
    "parsedJson" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoiceCapture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Hive_ownerId_idx" ON "Hive"("ownerId");

-- CreateIndex
CREATE INDEX "HiveNote_ownerId_idx" ON "HiveNote"("ownerId");

-- CreateIndex
CREATE INDEX "HiveNote_hiveId_idx" ON "HiveNote"("hiveId");

-- CreateIndex
CREATE INDEX "Inspection_ownerId_idx" ON "Inspection"("ownerId");

-- CreateIndex
CREATE INDEX "Inspection_hiveId_idx" ON "Inspection"("hiveId");

-- CreateIndex
CREATE INDEX "VoiceCapture_ownerId_idx" ON "VoiceCapture"("ownerId");

-- CreateIndex
CREATE INDEX "VoiceCapture_hiveId_idx" ON "VoiceCapture"("hiveId");

-- AddForeignKey
ALTER TABLE "Hive" ADD CONSTRAINT "Hive_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiveNote" ADD CONSTRAINT "HiveNote_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiveNote" ADD CONSTRAINT "HiveNote_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceCapture" ADD CONSTRAINT "VoiceCapture_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceCapture" ADD CONSTRAINT "VoiceCapture_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive"("id") ON DELETE SET NULL ON UPDATE CASCADE;
