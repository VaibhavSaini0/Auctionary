"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Clock,
  Gavel,
  TrendingUp,
  User,
} from "lucide-react";

export type AuctionItem = {
  id: number;
  title: string;
  description?: string | null;
  image_url: string;
  starting_bid: number;
  current_bid: number | null;
  status: "Live" | "Upcoming" | "Ended";
  ends_at?: string;
  seller_name?: string;
};

const FALLBACK_IMAGE =
  "https://media.istockphoto.com/id/1055079680/vector/no-image-available-icon.jpg";

function formatRemainingTime(end?: string) {
  if (!end) return "—";
  const diff = new Date(end).getTime() - Date.now();
  if (diff <= 0) return "Ended";

  const h = Math.floor(diff / 1000 / 60 / 60);
  const m = Math.floor((diff / 1000 / 60) % 60);
  const s = Math.floor((diff / 1000) % 60);

  return `${h}h ${m}m ${s}s`;
}

export default function HorizontalItemCard({
  item,
  i,
}: {
  item: AuctionItem;
  i: number;
}) {
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(item.image_url);
  const [timeLeft, setTimeLeft] = useState(
    formatRemainingTime(item.ends_at)
  );

  const displayPrice = item.current_bid ?? item.starting_bid;
  const nextBid = displayPrice + 10;

  useEffect(() => {
    if (!item.ends_at || item.status !== "Live") return;

    const t = setInterval(() => {
      setTimeLeft(formatRemainingTime(item.ends_at));
    }, 1000);

    return () => clearInterval(t);
  }, [item.ends_at, item.status]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(i * 0.05, 0.35), type: "spring", stiffness: 100, damping: 18 }}
      whileHover={{ y: -6 }}
      onClick={() => router.push(`/product/${item.id}`)}
      className="
        group flex flex-col md:flex-row
        bg-card border border-border rounded-3xl
        overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 cursor-pointer
      "
    >
      {/* IMAGE CONTAINER WITH ZOOM */}
      <div className="relative md:w-80 h-56 md:h-auto shrink-0 overflow-hidden">
        <Image
          src={imgSrc}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Live Status Pill */}
        <div
          className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-md transition-all ${
            item.status === "Live"
              ? "bg-destructive text-white border-destructive animate-pulse"
              : "bg-background/90 text-muted-foreground border-border backdrop-blur-sm"
          }`}
        >
          {item.status === "Live" && <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />}
          {item.status.toUpperCase()}
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col justify-between p-6 sm:p-8 flex-1">
        <div>
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">
              {item.title}
            </h3>
            {item.seller_name && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1 rounded-lg shrink-0">
                <User size={12} />
                <span className="font-semibold text-foreground">{item.seller_name}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
            {item.description ??
              "A curated premium auction item attracting competitive bidding."}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider mb-0.5">
                Current Bid
              </p>
              <p className="text-2xl font-black text-foreground">
                ₹{displayPrice.toLocaleString()}
              </p>
              {item.status === "Live" && (
                <p className="text-[10px] text-muted-foreground mt-1 font-semibold">
                  Next bid: ₹{nextBid.toLocaleString()}
                </p>
              )}
            </div>

            {item.status === "Live" && (
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider mb-0.5">
                  Time Remaining
                </p>
                <div className="flex items-center gap-1.5 text-orange-600 font-bold text-base mt-1">
                  <Clock size={16} />
                  <span className="font-mono">{timeLeft}</span>
                </div>
              </div>
            )}

            {item.status === "Live" && (
              <div className="hidden sm:block">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider mb-0.5">
                  Activity
                </p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-1.5">
                  <TrendingUp size={14} />
                  <span>High Activity</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ACTION PANEL */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-border mt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
            <Gavel size={14} className="text-primary" />
            Live Competitive Room
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/product/${item.id}`);
            }}
            className="rounded-2xl px-8 py-5 font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/25 active:scale-95 cursor-pointer"
          >
            {item.status === "Live" ? "Place Bid" : "View"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
