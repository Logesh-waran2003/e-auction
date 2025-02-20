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
    <div>
    <div className="border border-black bg-gray-700 w-full h-32 font-montserrat  text-white text-2xl ">
      <Navbar user={session.user} />
      </div>
      <main className="bg-createauctionimg bg-cover bg-center bg-no-repeat filter brightness-90 ">
        <div className=" rounded-lg shadow-md">{children}</div>
      </main>
  
    
    </div>
  );
}
