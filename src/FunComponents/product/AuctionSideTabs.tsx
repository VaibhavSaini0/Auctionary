"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import ChatRoom from "./ChatRoom";

export default function AuctionSideTabs({ auctionId }: { auctionId: string }) {
  const [active, setActive] = useState("Auction History");
  const [bids, setBids] = useState<any[]>([]);
  const { userId } = useAuth();

  useEffect(() => {
    if (!auctionId) return;

    const fetchBids = async () => {
      const { data } = await supabase
        .from("bids")
        .select(`*, profiles (full_name, avatar_url)`)
        .eq("auction_item_id", auctionId)
        .order("amount", { ascending: false });
      if (data) setBids(data);
    };

    fetchBids();

    const channel = supabase
      .channel(`auction-${auctionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bids",
          filter: `auction_item_id=eq.${auctionId}`,
        },
        async (payload) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", payload.new.bidder_id)
            .single();
          const newBidWithProfile = {
            ...payload.new,
            profiles: profile,
          };
          setBids((prev) =>
            [newBidWithProfile, ...prev].sort(
              (a, b) => b.amount - a.amount
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auctionId]);

  const sortedBids = bids;
  const userHighestBid = sortedBids.find(
    (bid) => bid.bidder_id === userId
  );

  return (
    <div className="mt-14 h-125 flex flex-col">
      <div className="flex gap-10 border-b border-border mb-6">
        {["Auction History", "Live Chat"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
              active === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {active === "Auction History" ? (
          <div className="space-y-4 overflow-y-auto h-full pr-2">
            {userId && userHighestBid && (
              <div className="sticky top-0 z-10 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-4 shadow-sm">
  <div className="flex justify-between items-center">
    <span className="text-xs font-bold uppercase tracking-widest text-primary">
      Your Highest Bid
    </span>
    <span className="text-lg font-extrabold text-primary">
      ₹{userHighestBid.amount.toLocaleString()}
    </span>
  </div>
</div>

            )}

            <div className="space-y-3">
              {sortedBids.length > 0 ? (
                sortedBids.map((bid, index) => (
                  <div
                    key={bid.id}
                    className="flex justify-between items-center p-3 rounded-lg border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          bid.profiles?.avatar_url ||
                          "https://github.com/identicons/jason.png"
                        }
                        alt="avatar"
                        className="w-9 h-9 rounded-full bg-muted"
                      />
                      <div>
                        <p className="text-sm font-semibold">
                          {bid.bidder_id === userId
                            ? "You"
                            : bid.profiles?.full_name || "Anonymous"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(bid.created_at),
                            { addSuffix: true }
                          )}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-bold ${
                        index === 0
                          ? "text-accent"
                          : "text-foreground"
                      }`}
                    >
                      ₹{bid.amount.toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center py-10 text-muted-foreground italic">
                  No bids yet.
                </p>
              )}
            </div>
          </div>
        ) : (
          <ChatRoom auctionId={auctionId} userId={userId} />
        )}
      </div>
    </div>
  );
}