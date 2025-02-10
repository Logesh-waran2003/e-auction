"use client";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function Dashboard() {
  const { user } = useAuthStore();
  console.log("user: ", user);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      console.log("session", session);

      if (!session) {
        redirect("/login");
      }
    };

    checkSession();
  }, []); // Empty dependency array to run once on mount

  const handleLogout = async () => {
    // Call your logout API or clear the auth store here
    // For example:
    await fetch("/api/auth/logout", { method: "POST" }); // Adjust the endpoint as necessary
    redirect("/login");
  };

  return (
    <div>
      <h1>Welcome, {user?.role}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  ); // Assuming user has a role property
}
