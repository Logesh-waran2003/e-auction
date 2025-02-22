'use client';

import { AuctionCard } from '@/components/auctions/AuctionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch('/api/auctions/approved');
        if (!response.ok) throw new Error('Failed to fetch auctions');
        const data = await response.json();
        setAuctions(data);
        setFilteredAuctions(data);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  useEffect(() => {
    const filtered = auctions.filter((auction) =>
      auction.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAuctions(filtered);
  }, [searchQuery, auctions]);

  if (loading) {
    return (
      <div className='text-center p-6'>
        <p>Loading auctions...</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <h2 className='text-2xl font-bold'>Available Auctions</h2>
        <Button variant='outline'>View All Auctions</Button>
      </div>

      <Input
        type='text'
        placeholder='Search auctions...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className='w-full md:w-1/2 p-2 border border-gray-300 rounded-lg'
      />

      {filteredAuctions.length === 0 ? (
        <div className='text-center p-6 bg-muted rounded-lg'>
          <p className='text-muted-foreground'>
            No auctions match your search.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredAuctions.map((auction) => (
            <Link key={auction.id} href={`/auctions/${auction.id}`}>
              <AuctionCard auction={auction} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
