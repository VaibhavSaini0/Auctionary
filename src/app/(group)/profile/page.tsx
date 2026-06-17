import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import ProfileTabs from "@/FunComponents/ProfileTabs";
import { redirect } from "next/navigation";
import ParticipatingTab from "@/FunComponents/profile/ParticipatingTab";
import SellingProductTab from "@/FunComponents/profile/SellingProductTab";
import { Suspense } from "react";
import AddFundsModal from "@/FunComponents/AddFundsModal";
import OrdersTab from "@/FunComponents/profile/OrderTab";
import StoreSettingTab from "@/FunComponents/profile/SellerSettingTab";
import { Wallet, Gavel, Coins, ShieldCheck, User } from "lucide-react";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const isSeller = user.publicMetadata?.role === "seller";
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [userDetailsRes, participatingRes, sellerProfileRes, sellingAuctionsRes] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("bids").select("amount, created_at, auction_items(*)").eq("bidder_id", user.id).order("created_at", { ascending: false }),
      isSeller
        ? supabase.from("seller_profiles").select("*").eq("id", user.id).single()
        : Promise.resolve({ data: null }),
      supabase.from("auction_items").select("*").eq("seller_id", user.id),
    ]);

  const userDetails = userDetailsRes.data;
  const myBids = participatingRes.data || [];
  const storeInfo = sellerProfileRes.data;
  const auctions = sellingAuctionsRes.data || [];

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-in fade-in duration-500">
      {/* Header Profile Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="lg:col-span-2 bg-card border border-border p-6 sm:p-8 rounded-[2rem] flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110" />
          
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 border-4 border-background shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={user.imageUrl} 
              alt={user.fullName || "Profile"} 
              className="object-cover w-full h-full" 
            />
          </div>
          
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground truncate">
                {user.fullName}
              </h1>
              {isSeller ? (
                <span className="w-fit mx-auto sm:mx-0 flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-full text-xs font-black uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                  Seller
                </span>
              ) : (
                <span className="w-fit mx-auto sm:mx-0 flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-black uppercase tracking-wider">
                  Standard
                </span>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mt-1.5 break-all font-medium">
              {user.emailAddresses?.[0]?.emailAddress || ""}
            </p>
            <p className="text-xs text-muted-foreground mt-3 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
              <ShieldCheck size={14} className="text-primary" />
              Member ID: <span className="font-mono text-foreground/80">{user.id.slice(0, 12)}...</span>
            </p>
          </div>
        </div>

        {/* Wallet balance Widget */}
        <div className="bg-card border border-border p-6 sm:p-8 rounded-[2rem] flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl shrink-0">
                <Wallet size={20} />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Wallet Balance</span>
                <h3 className="text-2xl sm:text-3xl font-black text-foreground mt-0.5 truncate">
                  ₹{userDetails?.current_balance?.toLocaleString() ?? "0"}
                </h3>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-normal font-medium">
              Top up your balance instantly to place fast active bids on premium listings.
            </p>
          </div>

          <div className="mt-6 shrink-0">
            <AddFundsModal />
          </div>
        </div>
      </div>

      {/* STATS PANEL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Bids Card */}
        <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Active Bids</span>
            <p className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">{myBids.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Gavel size={20} />
          </div>
        </div>

        {/* Total Sales Card */}
        {isSeller ? (
          <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md hover:border-emerald-500/20 transition-all duration-300 group">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Total Revenue</span>
              <p className="text-3xl font-black text-foreground group-hover:text-emerald-500 transition-colors">{storeInfo?.total_sales || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
              <Coins size={20} />
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Account Access</span>
              <p className="text-xl font-bold text-foreground">Standard Bidder</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 text-primary">
              <User size={20} />
            </div>
          </div>
        )}

        {/* Account Verification Card */}
        <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md hover:border-orange-500/20 transition-all duration-300 group">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Account Security</span>
            <p className="text-xl font-bold text-foreground">Verified Account</p>
          </div>
          <div className="p-4 rounded-xl bg-orange-500/10 text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      {/* Tabs navigation & sections */}
      <div className="bg-card border border-border rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 shadow-sm">
        <ProfileTabs>
          <Suspense fallback={<div className="py-12 text-center animate-pulse text-muted-foreground font-semibold">Loading selling products...</div>}>
            <SellingProductTab sellingAuctions={auctions} isSeller={isSeller} />
          </Suspense>

          <ParticipatingTab myBids={myBids} />

          <OrdersTab userId={user?.id || ""} />

          <StoreSettingTab
            storeInfo={storeInfo}
            isSeller={isSeller}
            activeListingsCount={auctions.length}
          />
        </ProfileTabs>
      </div>
    </section>
  );
}
