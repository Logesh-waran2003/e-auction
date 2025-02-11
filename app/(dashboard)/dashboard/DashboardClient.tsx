"use client";

import { Role } from "@prisma/client";
import { useApprovals } from "@/hooks/useApprovals";
import { BuyerDashboard } from "./components/BuyerDashboard";

interface DashboardClientProps {
  user: {
    id: string;
    email: string;
    name?: string | null;
    role: Role;
    isApproved: boolean;
  };
}

export function DashboardClient({ user }: DashboardClientProps) {
  const { data, loading } = useApprovals();

  const renderRoleSpecificContent = () => {
    switch (user.role) {
      case Role.SUPER_ADMIN:
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Admin Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium">Pending Sellers</h3>
                <p className="text-2xl font-bold">
                  {loading ? "..." : data.pendingSellers.length}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium">Pending Auctions</h3>
                <p className="text-2xl font-bold">
                  {loading ? "..." : data.pendingAuctions.length}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium">Total Users</h3>
                <p className="text-2xl font-bold">
                  {loading ? "..." : data.totalUsers}
                </p>
              </div>
            </div>
          </div>
        );
      case Role.SELLER:
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Seller Dashboard</h2>
            {/* Add seller-specific content here */}
          </div>
        );
      case Role.BUYER:
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Buyer Dashboard</h2>
            {/* Add buyer-specific content here */}
            <BuyerDashboard />
          </div>
        );
      default:
        return <div>Access Denied</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-md">
          {renderRoleSpecificContent()}
        </div>
      </main>
    </div>
  );
}
