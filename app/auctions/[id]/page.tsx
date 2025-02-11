import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AuctionDetail } from "./components/AuctionDetail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AuctionPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const auction = await prisma.auction.findUnique({
    where: {
      id: params.id,
    },
    include: {
      seller: {
        select: {
          name: true,
          id: true,
        },
      },
      bids: {
        orderBy: {
          amount: "desc",
        },
        take: 5,
        include: {
          bidder: {
            select: {
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          bids: true,
        },
      },
    },
  });

  if (!auction) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <AuctionDetail auction={auction} session={session} />
    </div>
  );
}
