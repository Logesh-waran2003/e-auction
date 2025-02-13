import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auction = await prisma.auction.findUnique({
      where: {
        id: params.id,
      },
      include: {
        seller: {
          include: {
            profile: true,
          },
        },
        bids: {
          include: {
            bidder: true,
          },
          orderBy: {
            amount: 'desc',
          },
        },
        Comment: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!auction) {
      return NextResponse.json(
        { error: "Auction not found" },
        { status: 404 }
      );
    }

    // Transform the data to exclude sensitive information
    const transformedAuction = {
      ...auction,
      seller: {
        id: auction.seller.id,
        name: auction.seller.name,
        email: auction.seller.email,
        profile: auction.seller.profile,
      },
      bids: auction.bids.map(bid => ({
        id: bid.id,
        amount: bid.amount,
        createdAt: bid.createdAt,
        bidder: {
          id: bid.bidder.id,
          name: bid.bidder.name,
        },
      })),
      Comment: auction.Comment.map(comment => ({
        id: comment.id,
        text: comment.text,
        createdAt: comment.createdAt,
        user: {
          id: comment.user.id,
          name: comment.user.name,
        },
      })),
    };

    return NextResponse.json(transformedAuction);
  } catch (error) {
    console.error("Error fetching auction details:", error);
    return NextResponse.json(
      { error: "Failed to fetch auction details" },
      { status: 500 }
    );
  }
}
