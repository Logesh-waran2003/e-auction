import { PrismaClient, Role, AuctionStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.comment.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create Super Admin
  const adminPassword = await hash("admin123", 12);
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: Role.SUPER_ADMIN,
      isApproved: true,
    },
  });

  // Create Sellers
  const sellerPassword = await hash("seller123", 12);
  const sellers = await Promise.all([
    prisma.user.create({
      data: {
        name: "John Seller",
        email: "john@seller.com",
        password: sellerPassword,
        role: Role.SELLER,
        isApproved: true,
        profile: {
          create: {
            company: "John Trading Co",
            taxId: "TAX123456",
            phone: "1234567890",
            address: "123 Seller St",
            city: "Mumbai",
            state: "Maharashtra",
            country: "India",
            pincode: "400001",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: "Alice Seller",
        email: "alice@seller.com",
        password: sellerPassword,
        role: Role.SELLER,
        isApproved: false,
        profile: {
          create: {
            company: "Alice Enterprises",
            taxId: "TAX789012",
            phone: "9876543210",
            address: "456 Trader Ave",
            city: "Delhi",
            state: "Delhi",
            country: "India",
            pincode: "110001",
          },
        },
      },
    }),
  ]);

  // Create Buyers
  const buyerPassword = await hash("buyer123", 12);
  const buyers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Bob Buyer",
        email: "bob@buyer.com",
        password: buyerPassword,
        role: Role.BUYER,
        isApproved: true,
        profile: {
          create: {
            phone: "5555555555",
            address: "789 Buyer Lane",
            city: "Bangalore",
            state: "Karnataka",
            country: "India",
            pincode: "560001",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: "Emma Buyer",
        email: "emma@buyer.com",
        password: buyerPassword,
        role: Role.BUYER,
        isApproved: true,
        profile: {
          create: {
            phone: "6666666666",
            address: "321 Shop Street",
            city: "Chennai",
            state: "Tamil Nadu",
            country: "India",
            pincode: "600001",
          },
        },
      },
    }),
  ]);

  // Create Auctions
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const auctions = await Promise.all([
    prisma.auction.create({
      data: {
        title: "Vintage Watch Collection",
        description: "Rare collection of vintage watches from the 1950s",
        startPrice: 1000,
        currentPrice: 1000,
        images: ["watch1.jpg", "watch2.jpg"],
        sellerId: sellers[0].id,
        status: AuctionStatus.ACTIVE,
        isApproved: true,
        endTime: tomorrow,
      },
    }),
    prisma.auction.create({
      data: {
        title: "Antique Furniture Set",
        description: "Beautiful Victorian-era furniture set",
        startPrice: 5000,
        currentPrice: 5000,
        images: ["furniture1.jpg", "furniture2.jpg"],
        sellerId: sellers[1].id,
        status: AuctionStatus.PENDING,
        isApproved: false,
        endTime: nextWeek,
      },
    }),
  ]);

  // Create Bids
  await Promise.all([
    prisma.bid.create({
      data: {
        amount: 1200,
        bidderId: buyers[0].id,
        auctionId: auctions[0].id,
      },
    }),
    prisma.bid.create({
      data: {
        amount: 1500,
        bidderId: buyers[1].id,
        auctionId: auctions[0].id,
      },
    }),
  ]);

  // Create Comments
  await Promise.all([
    prisma.comment.create({
      data: {
        text: "Is the watch still working?",
        userId: buyers[0].id,
        auctionId: auctions[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        text: "Yes, all watches are in working condition",
        userId: sellers[0].id,
        auctionId: auctions[0].id,
      },
    }),
  ]);

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
