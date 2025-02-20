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
    // { label: "Profile", href: "/dashboard/profile" },
    { label: "My Auctions", href: "/auctions" },
    { label: "Watchlist", href: "/auctions" },
  ];

  const navItems = {
    [Role.SUPER_ADMIN]: adminNav,
    [Role.SELLER]: sellerNav,
    [Role.BUYER]: buyerNav,
  };

  return (
    <nav className="border-b-200 font-montserrat font-bold text-3xl">
     <div className=" h-16 flex items-center px-4  justify-center bg-gray-700 w-full h-32 font-montserrat  text-white text-2xl ">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <h2 className="text-5xl font-semibold cursor-pointer text-green-500 p-1"> Gluby
              {/* {user.role.charAt(0) + user.role.slice(1).toLowerCase()} Dashboard */}
            </h2>
          </Link>

          {user.role && (
            <div className="flex space-x-4 ml-8">
              {navItems[user.role].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-base text-white font-bold  hover:text-rose-600">
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-4 font-montserrat">
          <span className=" text-muted-foreground text-lg">
            Welcome, {user.name || "User"}
          </span>
          <button
            onClick={handleLogout}
            className="bg-rose-500 text-white p-2 rounded hover:bg-red-600 transition-color font-semibold text-base"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
