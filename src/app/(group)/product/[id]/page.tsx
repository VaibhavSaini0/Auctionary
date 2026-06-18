"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@clerk/nextjs";
import { getAuctionByIdAction } from "@/app/actions/auctions";
import ProductHeader from "@/FunComponents/product/ProductHeader";
import ProductGallery from "@/FunComponents/product/ProductGallery";
import ProductBidPanel from "@/FunComponents/product/ProductBidPanel";
import AuctionSideTabs from "@/FunComponents/product/AuctionSideTabs";
import ProductBottomTabs from "@/FunComponents/product/ProductBottomTabs";

type AuctionItem = {
  id: string;
  title: string;
  image_url: string;
  starting_bid: number;
  current_bid: number | null;
  status: "Live" | "Upcoming" | "Ended";
  ends_at: string;
  bought_by: string | null;
  buy_now_price: number | null;
  description: string | null;
  seller_id: string;
};

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { userId } = useAuth();

  const [auction, setAuction] = useState<AuctionItem | null>(null);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchAuction() {
      setLoading(true);
      try {
        // Server action bypasses RLS so public product pages always load
        const data = await getAuctionByIdAction(id);

        if (data) {
          setAuction(data as AuctionItem);
          setAmount((data.current_bid ?? data.starting_bid) + 10);
        } else {
          setAuction(null);
        }
      } catch (err) {
        console.error("Failed to load auction:", err);
        setAuction(null);
      } finally {
        setLoading(false);
      }
    }

    fetchAuction();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`live-auction-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "auction_items",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          const updatedItem = payload.new as AuctionItem;
          setAuction(updatedItem);
          if (updatedItem.current_bid) {
            setAmount((prevAmount) => {
              return updatedItem.current_bid! >= prevAmount
                ? updatedItem.current_bid! + 10
                : prevAmount;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  if (loading)
    return (
      <div className="py-24 text-center text-sm font-bold text-muted-foreground animate-pulse">
        Initializing auction…
      </div>
    );

  if (!auction)
    return (
      <div className="py-24 text-center text-sm text-muted-foreground">
        Auction not found
      </div>
    );

  return (
    <section className="max-w-350 mx-auto px-6 py-16 bg-background">
      {auction.bought_by && (
        <div className="mb-6 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-center py-4 font-black tracking-wide border border-emerald-500/20">
          🎉 ITEM SOLD
        </div>
      )}

      <ProductHeader auction={auction} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mt-12">
        <div className="rounded-2xl px-4">
          <ProductGallery auction={auction} />
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <ProductBidPanel
              auction={auction}
              amount={amount}
              setAmount={setAmount}
            />
          </div>

          <div className="rounded-2xl border border-border bg-muted/50 p-6">
            <AuctionSideTabs auctionId={auction.id as any} />
          </div>
        </div>
      </div>

      <div className="mt-20 border-t border-border" />

      <div className="mt-16">
        <ProductBottomTabs
          description={auction.description}
          sellerId={auction.seller_id}
          auctionId={auction.id}
          userId={userId}
        />
      </div>
    </section>
  );
}
