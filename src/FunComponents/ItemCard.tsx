"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants/images";

export type AuctionItem = {
  id: string;
  title: string;
  image_url: string;
  starting_bid: number;
  current_bid: number | null;
  status: string;
};

function ItemCard({
  item,
  i,
  className = "w-full",
}: {
  item: AuctionItem;
  i: number;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState(item.image_url || PLACEHOLDER_IMAGE);
  const productHref = `/product/${item.id}`;
  const displayPrice = item.current_bid ?? item.starting_bid;
  const isLive = item.status?.toLowerCase() === "live";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: Math.min(i * 0.08, 0.4),
        type: "spring",
        stiffness: 100,
        damping: 18,
      }}
      whileHover={{ y: -8 }}
      className={`h-full ${className}`}
    >
      <Link
        href={productHref}
        className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col justify-between h-full"
      >
        <div className="relative overflow-hidden h-64 sm:h-72">
          <Image
            src={imgSrc}
            alt={item.title}
            width={400}
            height={400}
            onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
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
            {isLive
              ? "LIVE"
              : item.status?.toLowerCase() === "ended"
              ? "ENDED"
              : (item.status ?? "UPCOMING").toUpperCase()}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold leading-snug mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {item.title}
            </h3>

            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider mb-0.5">
                  Current Bid
                </p>
                <p className="text-xl font-black text-foreground">
                  ₹{displayPrice.toLocaleString()}
                </p>
              </div>
              {isLive && (
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">
                  Active Bids
                </span>
              )}
            </div>
          </div>

          <span className="w-full inline-flex items-center justify-center rounded-2xl py-6 font-bold text-sm tracking-wider uppercase border border-border bg-background text-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20">
            {isLive ? "Bid Now" : "View Details"}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default ItemCard;
