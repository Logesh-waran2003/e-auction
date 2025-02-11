import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AuctionCardProps {
  auction: {
    id: string;
    title: string;
    description: string;
    currentPrice: number;
    images: string[];
    status: string;
    endTime: Date;
    _count: {
      bids: number;
    };
  };
}

export function AuctionCard({ auction }: AuctionCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={auction.images[0] || "/placeholder-auction.jpg"}
          alt={auction.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{auction.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {auction.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Current Price:</span> ₹
            {auction.currentPrice}
          </p>
          <p>
            <span className="font-medium">Bids:</span> {auction._count.bids}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={
                auction.status === "ACTIVE" ? "text-green-600" : "text-red-600"
              }
            >
              {auction.status}
            </span>
          </p>
          <p>
            <span className="font-medium">Ends:</span>{" "}
            {formatDistanceToNow(new Date(auction.endTime), {
              addSuffix: true,
            })}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{auction.title}</DialogTitle>
              <DialogDescription>
                Created on {new Date(auction.endTime).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="relative h-64 w-full">
                <Image
                  src={auction.images[0] || "/placeholder-auction.jpg"}
                  alt={auction.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <p>{auction.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Current Price</h4>
                    <p>₹{auction.currentPrice}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Total Bids</h4>
                    <p>{auction._count.bids}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Status</h4>
                    <p
                      className={
                        auction.status === "ACTIVE"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {auction.status}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Auction Ends</h4>
                    <p>
                      {formatDistanceToNow(new Date(auction.endTime), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
