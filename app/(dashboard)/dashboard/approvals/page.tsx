"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApprovals } from "@/hooks/useApprovals";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  title: string;
}

function DetailsModal({ isOpen, onClose, data, title }: DetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {Object.entries(data).map(([key, value]) => {
            if (key === "id" || typeof value === "function") return null;
            if (typeof value === "object" && value !== null) {
              return (
                <div key={key} className="space-y-2">
                  <h3 className="font-semibold capitalize">{key}</h3>
                  <div className="pl-4">
                    {Object.entries(value).map(([subKey, subValue]) => {
                      if (subKey === "id" || typeof subValue === "function")
                        return null;
                      return (
                        <div key={subKey} className="flex gap-2">
                          <span className="font-medium capitalize">
                            {subKey}:
                          </span>
                          <span>{String(subValue)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return (
              <div key={key} className="flex gap-2">
                <span className="font-medium capitalize">{key}:</span>
                <span>{String(value)}</span>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ApprovalsPage() {
  const { data, loading, handleApproval } = useApprovals();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalType, setModalType] = useState<"seller" | "auction" | null>(null);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const openModal = (type: "seller" | "auction", item: any) => {
    setModalType(type);
    setSelectedItem(item);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedItem(null);
  };

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
                      variant="outline"
                      onClick={() => openModal("seller", seller)}
                    >
                      View Details
                    </Button>
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
                      variant="outline"
                      onClick={() => openModal("auction", auction)}
                    >
                      View Details
                    </Button>
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

      {selectedItem && modalType && (
        <DetailsModal
          isOpen={true}
          onClose={closeModal}
          data={selectedItem}
          title={modalType === "seller" ? "Seller Details" : "Auction Details"}
        />
      )}
    </div>
  );
}
