"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuctionItem = {
  id: number;
  title: string;
  image_url: string;
  starting_bid: number;
  current_bid: number | null;
  status: "Live" | "Upcoming" | "Ended";
};

const FALLBACK_IMAGE =
  "https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg?b=1&s=170x170&k=20&c=rUeK8H2EAp_sBFlbk7-m5STaJw18ldbBWsb2093N0-s=";

function ItemCard({
  item,
  i,
  className = "w-full",
}: {
  item: AuctionItem;
  i: number;
  className?: string;
}) {
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(item.image_url);

  function handleClick() {
    router.push(`/product/${item.id}`);
  }

  const displayPrice = item.current_bid ?? item.starting_bid;

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
      className={`bg-card rounded-3xl border border-border shadow-sm overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col justify-between ${className}`}
    >
      <div className="relative overflow-hidden h-64 sm:h-72">
        <Image
          src={imgSrc}
          alt={item.title}
          width={400}
          height={400}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 cursor-pointer"
        />

        {/* Live / Status Pill */}
        <div
          className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-md transition-all ${
            item.status === "Live"
              ? "bg-destructive text-white border-destructive animate-pulse"
              : "bg-background/90 text-muted-foreground border-border backdrop-blur-sm"
          }`}
        >
          {item.status === "Live" && <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />}
          {item.status === "Live"
            ? "LIVE"
            : item.status === "Ended"
            ? "ENDED"
            : item.status.toUpperCase()}
        </div>

        {/* Dark Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={handleClick}
            className="text-base sm:text-lg font-bold leading-snug mb-2 text-foreground cursor-pointer hover:text-primary transition-colors line-clamp-1"
          >
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
            {item.status === "Live" && (
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
                Active Bids
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={handleClick}
          className="w-full rounded-2xl py-6 font-bold text-sm tracking-wider uppercase transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20 group-active:scale-95 cursor-pointer"
        >
          {item.status === "Live" ? "Bid Now" : "View Details"}
        </Button>
      </div>
    </motion.div>
  );
}

export default ItemCard;
