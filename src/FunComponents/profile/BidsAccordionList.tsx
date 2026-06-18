"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Trophy,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

export default function BidsAccordionList({ auctions: initialAuctions }: any) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [liveAuctions, setLiveAuctions] = useState(initialAuctions);

  useEffect(() => {
    setLiveAuctions(initialAuctions);
  }, [initialAuctions]);

  useEffect(() => {
    if (!liveAuctions || liveAuctions.length === 0) return;

    const channels = liveAuctions.map((item: any) => {
      const auctionId = item.auction.id;

      return supabase
        .channel(`live-check-${auctionId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "auction_items",
            filter: `id=eq.${auctionId}`,
          },
          (payload) => {
            setLiveAuctions((prev: any) =>
              prev?.map((a: any) =>
                a.auction.id === auctionId
                  ? { ...a, auction: payload.new }
                  : a
              )
            );
          }
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "bids",
            filter: `auction_item_id=eq.${auctionId}`,
          },
          (payload) => {
            const newBid = payload.new;

            setLiveAuctions((prev: any) =>
              prev?.map((a: any) => {
                if (a.auction.id === auctionId) {
                  const bidExists = a.bids.some(
                    (b: any) => b.id === newBid.id
                  );
                  if (bidExists) return a;

                  return {
                    ...a,
                    bids: [newBid, ...a.bids],
                  };
                }
                return a;
              })
            );
          }
        )
        .subscribe();
    });

    return () => {
      channels.forEach((channel: any) =>
        supabase.removeChannel(channel)
      );
    };
  }, [initialAuctions]);

  const toggle = (id: string) =>
    setExpandedId(expandedId === id ? null : id);

  return (
    <div className="space-y-4">
      {liveAuctions.map(({ auction, bids }: any) => {
        const myHighestBid = Math.max(...bids.map((b: any) => b.amount));
        const isLeading =
          myHighestBid >= (auction.current_bid || 0);
        const isLive = auction.status?.toLowerCase() === "live";

        return (
          <div
            key={auction.id}
            className={`rounded-xl border border-border transition-all duration-300 bg-card ${
              expandedId === auction.id
                ? "ring-1 ring-primary/30 shadow-sm"
                : ""
            }`}
          >
            <button
              onClick={() => toggle(auction.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-xl bg-muted border border-border/60 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={auction.image_url || "/placeholder.jpg"}
                    alt={auction.title}
                    className="object-cover w-full h-full rounded-xl"
                  />
                  {/* Floating status badge indicator */}
                  <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-card shadow-md ${
                    isLeading ? "bg-emerald-500 text-white" : "bg-destructive text-white"
                  }`}>
                    {isLeading ? (
                      <Trophy className="h-2.5 w-2.5" />
                    ) : (
                      <AlertCircle className="h-2.5 w-2.5" />
                    )}
                  </span>
                </div>

                <div>
                  <p className="font-semibold text-foreground">
                    {auction.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      My max: ₹
                      {myHighestBid.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      |
                    </span>
                    <p
                      className={`text-xs font-semibold ${
                        isLeading
                          ? "text-accent"
                          : "text-destructive"
                      }`}
                    >
                      {isLeading
                        ? "Leading"
                        : `Current: ₹${auction.current_bid?.toLocaleString()}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md border ${
                    isLive
                      ? "bg-primary/10 text-primary border-primary/20 animate-pulse"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {auction.status}
                </span>

                {expandedId === auction.id ? (
                  <ChevronUp
                    size={18}
                    className="text-muted-foreground"
                  />
                ) : (
                  <ChevronDown
                    size={18}
                    className="text-muted-foreground"
                  />
                )}
              </div>
            </button>

            {expandedId === auction.id && (
              <div className="border-t border-border bg-muted/30 p-4 space-y-4 animate-in slide-in-from-top-1 duration-200">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Bid History
                  </p>
                  <Link
                    href={`/product/${auction.id}`}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 transition"
                  >
                    Go to Auction <ExternalLink size={12} />
                  </Link>
                </div>

                <div className="space-y-2">
                  {bids.map((bid: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-card border border-border rounded-xl px-4 py-2.5 shadow-sm"
                    >
                      <span className="text-muted-foreground text-[11px] font-medium">
                        {new Date(bid.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                      <span className="font-semibold text-foreground">
                        ₹{bid.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {!isLeading && isLive && (
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle
                        size={14}
                        className="text-destructive"
                      />
                      <span className="text-destructive text-xs font-semibold">
                        Someone placed a higher bid!
                      </span>
                    </div>
                    <Link
                      href={`/product/${auction.id}`}
                      className="bg-destructive text-destructive-foreground px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-tight hover:opacity-90 transition shadow-sm"
                    >
                      Rebid Now
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
