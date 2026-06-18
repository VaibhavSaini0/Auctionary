"use client";

import { useUser } from "@clerk/nextjs";
import AddAuctionModal from "../Modals/AddAuctionModal";
import { Hammer, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface AuctionItem {
  id: string;
  title: string;
  current_bid: number;
  starting_bid: number;
  buy_now_price?: number | null;
  status: string;
  image_url?: string;
}

export default function SellingProductTab({
  sellingAuctions,
  isSeller,
}: {
  sellingAuctions: AuctionItem[];
  isSeller: boolean;
}) {
  const userId = useUser().user?.id || "";
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-foreground">
            Your Active Listings
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage and monitor your live auction items
          </p>
        </div>
        {isSeller && (
          <div className="w-full sm:w-auto flex justify-end">
            <AddAuctionModal userId={userId} />
          </div>
        )}
      </div>

      {sellingAuctions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/85 p-12 text-center bg-muted/20 flex flex-col items-center justify-center gap-3">
          <div className="p-3.5 rounded-2xl bg-muted/50 text-muted-foreground/60">
            <Hammer className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-foreground">No active listings found</p>
          <p className="text-xs text-muted-foreground max-w-xs leading-normal">
            You haven&rsquo;t listed any items for auction yet. Start listing to get bidders!
          </p>
          {isSeller && (
            <div className="mt-2">
              <AddAuctionModal userId={userId} />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {sellingAuctions.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between rounded-2xl border border-border bg-card p-4.5 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border/60 shrink-0 flex items-center justify-center">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground/45" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    Current Bid: <span className="font-semibold text-foreground">₹{(item.current_bid ?? item.starting_bid).toLocaleString()}</span>
                    {item.buy_now_price ? (
                      <>
                        {" · "}
                        Buy Now: <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹{Number(item.buy_now_price).toLocaleString()}</span>
                      </>
                    ) : null}
                  </p>
                </div>
              </div>

              <span
                className={`w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${
                  item.status === "Live"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
