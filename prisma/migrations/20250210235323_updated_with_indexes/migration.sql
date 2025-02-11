/*
  Warnings:

  - You are about to drop the column `auctionDate` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `isApproved` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Bid` table. All the data in the column will be lost.
  - Added the required column `currentPrice` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bidderId` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ENDED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_userId_fkey";

-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "auctionDate",
DROP COLUMN "isApproved",
ADD COLUMN     "currentPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "status" "AuctionStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Bid" DROP COLUMN "userId",
ADD COLUMN     "bidderId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Bid_auctionId_idx" ON "Bid"("auctionId");

-- CreateIndex
CREATE INDEX "Bid_bidderId_idx" ON "Bid"("bidderId");

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_bidderId_fkey" FOREIGN KEY ("bidderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
