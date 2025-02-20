import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Navbar } from "@/components/Navbar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 w-full font-montserrat h-screen">
      <Navbar user={session.user} />
      <main className="max-w-7xl mx-auto mt-6">
        <div className="bg-red rounded-lg shadow-md">{children}</div>
      </main>
    </div>
  );
}
