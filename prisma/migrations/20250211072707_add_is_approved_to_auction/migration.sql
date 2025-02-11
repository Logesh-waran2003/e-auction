-- AlterEnum
ALTER TYPE "AuctionStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;
