-- AlterTable
ALTER TABLE "ApiKey"
ADD COLUMN "environment" TEXT NOT NULL DEFAULT 'dev';