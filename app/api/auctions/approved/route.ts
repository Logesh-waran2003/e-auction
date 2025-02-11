import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const auctions = await prisma.auction.findMany({
      where: {
        status: "ACTIVE",
        seller: {
          isApproved: true,
        },
      },
      include: {
        seller: {
          select: {
            name: true,
            id: true,
          },
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
    console.error("[AUCTIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
