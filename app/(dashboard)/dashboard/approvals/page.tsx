"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApprovals } from "@/hooks/useApprovals";
import { Button } from "@/components/ui/button";

export default function ApprovalsPage() {
  const { data, loading, handleApproval } = useApprovals();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Approval Management</h2>
      <Tabs defaultValue="sellers" className="w-full">
        <TabsList>
          <TabsTrigger value="sellers">
            Pending Sellers ({data.pendingSellers.length})
          </TabsTrigger>
          <TabsTrigger value="auctions">
            Pending Auctions ({data.pendingAuctions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sellers">
          {data.pendingSellers.length === 0 ? (
            <div className="p-4">
              <p className="text-gray-500">No pending sellers to approve</p>
            </div>
          ) : (
            <div className="divide-y">
              {data.pendingSellers.map((seller: any) => (
                <div
                  key={seller.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{seller.name}</p>
                    <p className="text-sm text-gray-500">{seller.email}</p>
                  </div>
                  <div className="space-x-2">
                    <Button
                      onClick={() => handleApproval("seller", seller.id, true)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleApproval("seller", seller.id, false)}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="auctions">
          {data.pendingAuctions.length === 0 ? (
            <div className="p-4">
              <p className="text-gray-500">No pending auctions to approve</p>
            </div>
          ) : (
            <div className="divide-y">
              {data.pendingAuctions.map((auction: any) => (
                <div
                  key={auction.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{auction.title}</p>
                    <p className="text-sm text-gray-500">
                      by {auction.seller.name} ({auction.seller.email})
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button
                      onClick={() =>
                        handleApproval("auction", auction.id, true)
                      }
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() =>
                        handleApproval("auction", auction.id, false)
                      }
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
