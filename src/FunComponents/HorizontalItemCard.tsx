"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Clock,
  Gavel,
  TrendingUp,
  User,
} from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants/images";

export type AuctionItem = {
  id: string;
  title: string;
  description?: string | null;
  image_url: string;
  starting_bid: number;
  current_bid: number | null;
  status: string;
  ends_at?: string;
  seller_name?: string;
};

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
  const productHref = `/product/${item.id}`;
  const isLive = item.status?.toLowerCase() === "live";
  const [imgSrc, setImgSrc] = useState(item.image_url || PLACEHOLDER_IMAGE);
  const [timeLeft, setTimeLeft] = useState(formatRemainingTime(item.ends_at));

  const displayPrice = item.current_bid ?? item.starting_bid;
  const nextBid = displayPrice + 10;

  useEffect(() => {
    if (!item.ends_at || !isLive) return;

    const t = setInterval(() => {
      setTimeLeft(formatRemainingTime(item.ends_at));
    }, 1000);

    return () => clearInterval(t);
  }, [item.ends_at, isLive]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: Math.min(i * 0.05, 0.35),
        type: "spring",
        stiffness: 100,
        damping: 18,
      }}
      whileHover={{ y: -6 }}
    >
      <Link
        href={productHref}
        className="group flex flex-col md:flex-row bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500"
      >
        <div className="relative md:w-80 h-56 md:h-auto shrink-0 overflow-hidden">
          <Image
            src={imgSrc}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          <div
            className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-md transition-all ${
              isLive
                ? "bg-destructive text-white border-destructive animate-pulse"
                : "bg-background/90 text-muted-foreground border-border backdrop-blur-sm"
            }`}
          >
            {isLive && (
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
            )}
            {(item.status ?? "Upcoming").toUpperCase()}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        <div className="flex flex-col justify-between p-6 sm:p-8 flex-1">
          <div>
            <div className="flex justify-between items-start gap-4 mb-2">
              <h3 className="text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">
                {item.title}
              </h3>
              {item.seller_name && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1 rounded-lg shrink-0">
                  <User size={12} />
                  <span className="font-semibold text-foreground">
                    {item.seller_name}
                  </span>
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
                {isLive && (
                  <p className="text-[10px] text-muted-foreground mt-1 font-semibold">
                    Next bid: ₹{nextBid.toLocaleString()}
                  </p>
                )}
              </div>

              {isLive && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider mb-0.5">
                    Time Remaining
                  </p>
                  <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-bold text-base mt-1">
                    <Clock size={16} />
                    <span className="font-mono">{timeLeft}</span>
                  </div>
                </div>
              )}

              {isLive && (
                <div className="hidden sm:block">
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider mb-0.5">
                    Activity
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1.5">
                    <TrendingUp size={14} />
                    <span>High Activity</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-border mt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
              <Gavel size={14} className="text-primary" />
              Live Competitive Room
            </div>

            <span className="rounded-2xl px-8 py-3 font-bold text-sm tracking-wider uppercase bg-primary text-primary-foreground group-hover:bg-primary/90 transition-all shadow-md">
              {isLive ? "Place Bid" : "View"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
