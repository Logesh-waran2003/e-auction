import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function getUserAuctions() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return prisma.auction.findMany({
    where: {
      sellerId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          bids: true,
        },
      },
    },
  });
}
