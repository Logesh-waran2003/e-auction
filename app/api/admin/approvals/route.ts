import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [pendingSellers, pendingAuctions, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where: { role: "SELLER", isApproved: false },
        select: { id: true, name: true, email: true },
      }),
      prisma.auction.findMany({
        where: { isApproved: false },
        select: {
          id: true,
          title: true,
          seller: { select: { name: true, email: true } },
        },
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({ pendingSellers, pendingAuctions, totalUsers });
  } catch (error) {
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
    return NextResponse.json(
      { error: "Failed to update approval" },
      { status: 500 }
    );
  }
}
