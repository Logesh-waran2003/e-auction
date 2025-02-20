import { CreateAuctionForm } from "@/components/auctions/CreateAuctionForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function CreateAuctionPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    // <div className="font-montserrat bg-createauctionimg no-repeat bg-cover">
    <div className="max-w-1xl mx-auto p-6">
      
      <CreateAuctionForm />
    </div>
    // </div>
  );
}
