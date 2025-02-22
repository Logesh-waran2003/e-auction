'use client';

import { AuctionCard } from '@/components/auctions/AuctionCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Auction {
  id: string;
  title: string;
  description: string;
  currentPrice: number;
  images: string[];
  status: string;
  endTime: string; // 👈 Change from `Date` to `string`
  seller: {
    name: string;
    id: string;
  };
  _count: {
    bids: number;
  };
}

export function SellerDashboard() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch('/api/auctions/approved');

        const text = await response.text(); // Read response as text first
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${text}`);

        const data = JSON.parse(text); // Ensure it's valid JSON
        setAuctions(data);
      } catch (error) {
        console.error('Error fetching auctions:', error);
        setError('Failed to load auctions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) {
    return (
      <div className='text-center p-6'>
        <p>Loading auctions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center p-6 bg-red-100 text-red-600 rounded-lg'>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Available Auctions</h2>
        <Button variant='outline'>View All Auctions</Button>
      </div>

      {auctions.length === 0 ? (
        <div className='text-center p-6 bg-muted rounded-lg'>
          <p className='text-muted-foreground'>
            No active auctions available at the moment.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {auctions.map((auction) => (
            <Link key={auction.id} href={`/auctions/${auction.id}`}>
              <AuctionCard
                auction={{ ...auction, endTime: new Date(auction.endTime) }}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
