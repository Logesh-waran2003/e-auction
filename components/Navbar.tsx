"use client";

import { Role } from "@prisma/client";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface NavbarProps {
  user: {
    name?: string | null;
    role: Role;
  };
}

export function Navbar({ user }: NavbarProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const adminNav = [{ label: "Approvals", href: "/dashboard/approvals" }];

  const sellerNav = [
    { label: "Create Auction", href: "/auctions/create" },
    { label: "My Auctions", href: "/auctions" },
  ];

  const buyerNav = [
    { label: "Profile", href: "/dashboard/profile" },
    { label: "My Auctions", href: "/auctions" },
    { label: "Watchlist", href: "/auctions" },
  ];

  const navItems = {
    [Role.SUPER_ADMIN]: adminNav,
    [Role.SELLER]: sellerNav,
    [Role.BUYER]: buyerNav,
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <h2 className="text-lg font-semibold cursor-pointer">
              {user.role.charAt(0) + user.role.slice(1).toLowerCase()} Dashboard
            </h2>
          </Link>

          {user.role && (
            <div className="flex space-x-4 ml-8">
              {navItems[user.role].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Welcome, {user.name || "User"}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
