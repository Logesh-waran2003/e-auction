"use client";

import { AuctionCard } from "@/components/auctions/AuctionCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Auction {
  id: string;
  title: string;
  description: string;
  currentPrice: number;
  images: string[];
  status: string;
  endTime: Date;
  seller: {
    name: string;
    id: string;
  };
  _count: {
    bids: number;
  };
}

export function BuyerDashboard() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch("/api/auctions/approved");
        if (!response.ok) throw new Error("Failed to fetch auctions");
        const data = await response.json();
        setAuctions(data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-6">
        <p>Loading auctions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Available Auctions</h2>
        <Link href="/auctions">
          <Button variant="outline">View All Auctions</Button>
        </Link>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center p-6 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            No active auctions available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <Link key={auction.id} href={`/auctions/${auction.id}`}>
              <AuctionCard auction={auction} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
