-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "auctionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "city" TEXT,
ADD COLUMN     "companyRegNo" TEXT,
ADD COLUMN     "contactNo" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "email" TEXT,
ADD COLUMN     "establishedAt" TIMESTAMP(3),
ADD COLUMN     "natureOfBusiness" TEXT,
ADD COLUMN     "panNo" TEXT,
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "state" TEXT;

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
