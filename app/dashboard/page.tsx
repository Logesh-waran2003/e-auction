"use client";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { Role } from "@prisma/client";

export default function Dashboard() {
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        redirect("/login");
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Use Next.js router for client-side navigation
      redirect("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome to Dashboard</h1>
              <p className="text-gray-600">
                Logged in as:{" "}
                <span className="font-semibold">{user?.email}</span>
              </p>
              <p className="text-gray-600">
                Role:{" "}
                <span className="font-semibold capitalize">
                  {user?.role?.toLowerCase()}
                </span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Role-specific content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {user?.role === Role.SUPER_ADMIN && (
            <div>
              <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
              <p>You have access to all administrative functions.</p>
            </div>
          )}

          {user?.role === Role.SELLER && (
            <div>
              <h2 className="text-xl font-bold mb-4">Seller Dashboard</h2>
              <p>Manage your products and view your sales here.</p>
            </div>
          )}

          {user?.role === Role.BUYER && (
            <div>
              <h2 className="text-xl font-bold mb-4">Buyer Dashboard</h2>
              <p>Browse products and manage your purchases here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
