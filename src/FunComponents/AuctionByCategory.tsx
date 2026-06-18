"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Paintbrush, CircleDollarSign, Sofa, Music, Gem } from "lucide-react";
import { useRef } from "react";
import { motion } from "framer-motion";

import { PICSUM } from "@/lib/constants/images";

const categories = [
  {
    title: "Ceramics",
    icon: <Paintbrush className="w-6 h-6 text-primary" />,
    items: "4 Items",
    img: PICSUM.ceramics,
  },
  {
    title: "Coins",
    icon: <CircleDollarSign className="w-6 h-6 text-primary" />,
    items: "2 Items",
    img: PICSUM.coins,
  },
  {
    title: "Furniture",
    icon: <Sofa className="w-6 h-6 text-primary" />,
    items: "8 Items",
    img: PICSUM.furniture,
  },
  {
    title: "Instruments",
    icon: <Music className="w-6 h-6 text-primary" />,
    items: "8 Items",
    img: PICSUM.instruments,
  },
  {
    title: "Jewelry",
    icon: <Gem className="w-6 h-6 text-primary" />,
    items: "3 Items",
    img: PICSUM.jewelry,
  },
  {
    title: "Ceramics",
    icon: <Paintbrush className="w-6 h-6 text-primary" />,
    items: "4 Items",
    img: PICSUM.ceramics,
  },
  {
    title: "Coins",
    icon: <CircleDollarSign className="w-6 h-6 text-primary" />,
    items: "2 Items",
    img: PICSUM.coins,
  },
  {
    title: "Furniture",
    icon: <Sofa className="w-6 h-6 text-primary" />,
    items: "8 Items",
    img: PICSUM.furniture,
  },
  {
    title: "Instruments",
    icon: <Music className="w-6 h-6 text-primary" />,
    items: "8 Items",
    img: PICSUM.instruments,
  },
  {
    title: "Jewelry",
    icon: <Gem className="w-6 h-6 text-primary" />,
    items: "3 Items",
    img: PICSUM.jewelry,
  },
];

export default function AuctionByCategory() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: dir === "right" ? 286 : -286,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative py-20 overflow-x-hidden bg-background">
      <div className="absolute inset-0 bg-muted/20" />

      <div className="relative max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="inline-block text-[10px] tracking-widest px-4 py-1.5 rounded-full border border-border bg-card mb-3 text-muted-foreground font-black">
              ✦ EXPLORE OUR
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Browse by <span className="text-orange-500 font-light font-serif italic">Category</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous categories"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next categories"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-7 overflow-x-auto pb-8 scrollbar-hide scroll-smooth snap-x snap-mandatory overscroll-x-contain"
        >
          {categories.map((cat, i) => (
            <div key={i} className="relative min-w-[260px] snap-start pt-8">
              {/* Category Icon Badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  className="w-16 h-16 rounded-full bg-card p-2 flex items-center justify-center shadow-lg border border-border transition-all cursor-pointer"
                >
                  {cat.icon}
                </motion.div>
              </div>

              {/* Glassmorphic/Premium Category Image Container */}
              <div className="group relative h-60 rounded-3xl overflow-hidden bg-card border border-border hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/20 transition-all duration-500 cursor-pointer">
                <Image
                  src={cat.img}
                  alt={cat.title}
                  fill
                  sizes="260px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Glassmorphic Category Info Pill */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-md rounded-2xl px-6 py-3 text-center shadow-lg border border-white/20 w-[80%] transition-transform duration-300 group-hover:scale-[1.03]">
                  <p className="font-bold text-foreground tracking-wide">
                    {cat.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">
                    {cat.items}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
