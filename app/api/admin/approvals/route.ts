import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [pendingSellers, pendingAuctions, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where: { role: "SELLER", isApproved: false },
        include: {
          profile: true,
        },
      }),
      prisma.auction.findMany({
        where: { isApproved: false },
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
      }),
      prisma.user.count(),
    ]);

    console.log('API Response - Pending Sellers:', JSON.stringify(pendingSellers, null, 2));
    console.log('API Response - Pending Auctions:', JSON.stringify(pendingAuctions, null, 2));

    return NextResponse.json({ pendingSellers, pendingAuctions, totalUsers });
  } catch (error) {
    console.error("Error in GET /api/admin/approvals:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { type, id, approved } = await request.json();

    if (type === "seller") {
      await prisma.user.update({
        where: { id },
        data: { isApproved: approved },
      });
    } else if (type === "auction") {
      await prisma.auction.update({
        where: { id },
        data: { isApproved: approved },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in PATCH /api/admin/approvals:", error);
    return NextResponse.json(
      { error: "Failed to update approval status" },
      { status: 500 }
    );
  }
}
