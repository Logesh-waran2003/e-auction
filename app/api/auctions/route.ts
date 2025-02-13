import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient, Role, AuctionStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== Role.SELLER) {
      return NextResponse.json(
        { error: "Only sellers can create auctions" },
        { status: 403 }
      );
    }

    const data = await req.json();
    const { title, description, startPrice, endTime, images } = data;

    // Validate required fields
    if (!title || !description || !startPrice || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the auction
    const auction = await prisma.auction.create({
      data: {
        title,
        description,
        startPrice,
        currentPrice: startPrice,
        endTime: new Date(endTime),
        images: images || [],
        sellerId: session.user.id,
        status: AuctionStatus.ACTIVE,
      },
    });

    return NextResponse.json(auction);
  } catch (error) {
    console.error("Auction creation error:", error);
    return NextResponse.json(
      { error: "Failed to create auction" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as AuctionStatus | null;
    const sellerId = searchParams.get("sellerId");
    const approvalStatus = searchParams.get("approvalStatus");
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auctions = await prisma.auction.findMany({
      where: {
        ...(status && { status: status as AuctionStatus }),
        ...(sellerId && { sellerId }),
        ...(approvalStatus === "pending" && { status: AuctionStatus.PENDING }),
        ...(approvalStatus === "approved" && { status: AuctionStatus.ACTIVE }),
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
        bids: {
          select: {
            id: true,
            amount: true,
            createdAt: true,
            bidder: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            amount: "desc",
          },
          take: 5,
        },
        _count: {
          select: {
            bids: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(auctions);
  } catch (error) {
    console.error("Auction fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch auctions" },
      { status: 500 }
    );
  }
}
