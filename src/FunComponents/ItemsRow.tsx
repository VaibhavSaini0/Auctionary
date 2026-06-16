"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ItemCard from "./ItemCard";
import { supabase } from "@/lib/supabase/client";

const CARD_WIDTH = 360;
const VISIBLE_CARDS = 4;
const AUTO_DELAY = 3500;

export default function ItemsRow() {
  const [items, setItems] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const AUTO_DELAY = 4500;

  useEffect(() => {
    const fetchAuctions = async () => {
      const { data } = await supabase
        .from("auction_items")
        .select("*")
        .eq("status", "Live")
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) setItems(data);
    };

    fetchAuctions();
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!containerRef.current) return;
    const cardElement = containerRef.current.querySelector(".item-card");
    const cardWidth = cardElement ? cardElement.clientWidth : 320;
    const gap = 24; // gap-6 is 24px
    const scrollAmount = cardWidth + gap;

    containerRef.current.scrollBy({
      left: dir === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      if (!containerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      
      // If we are at the end, scroll back to 0, else scroll right
      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroll("right");
      }
    }, AUTO_DELAY);

    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <section className="relative py-16 my-16 bg-muted/30">
      <div className="relative max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <span className="inline-block text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-primary/10 text-primary font-black mb-3">
              ✦ BIDDING NOW
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Live <span className="text-orange-500 font-light font-serif italic">Auctions</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center bg-card hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center bg-card hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Responsive, snap-scrolling list wrapper */}
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-6 overscroll-x-contain"
        >
          {items.map((item, i) => (
            <div key={`${item.id}-${i}`} className="item-card snap-start flex-shrink-0">
              <ItemCard item={item} i={i} className="w-[280px] sm:w-[320px] md:w-[340px]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
