"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Grid, List } from "lucide-react";
import Link from "next/link";
import AuctionsList from "./AuctionsList";

export default function AuctionGridContent() {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const currentStatus = searchParams.get("status") ?? "all";
  const searchQuery = searchParams.get("search") ?? "";
  const isDetailedFromUrl = searchParams.get("view") === "true";

  const [isMobile, setIsMobile] = useState(false);
  const [isDetailedCard, setIsDetailedCard] = useState(isDetailedFromUrl);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDetailedView = isMobile ? true : isDetailedCard;

  const filters = [
    { label: "All Auctions", value: "all" },
    { label: "Live", value: "Live" },
    { label: "Upcoming", value: "Upcoming" },
    { label: "Ended", value: "Ended" },
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-6 pt-8 pb-20 bg-background relative overflow-hidden">
      {/* Background soft glow decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="mb-12">
        <span className="inline-block text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-primary/10 text-primary font-black mb-3">
          ✦ LIVE EVENTS
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          Browse <span className="text-orange-500 font-light font-serif italic">Auctions</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-lg leading-relaxed">
          Discover rare collectibles, vintage items, and bid in real-time. Join premium live bidding rooms instantly.
        </p>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-10 pb-6 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Link
              key={f.value}
              href={`/auction-products?status=${f.value}${
                searchQuery ? `&search=${searchQuery}` : ""
              }`}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all duration-300 ${
                currentStatus === f.value
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/15"
                  : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {!isMobile && (
          <button
            onClick={() => setIsDetailedCard(!isDetailedCard)}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all duration-300 shadow-sm cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center"
            title={isDetailedView ? "Switch to Grid View" : "Switch to Detailed List View"}
          >
            {isDetailedView ? <Grid size={18} className="text-primary" /> : <List size={18} className="text-primary" />}
          </button>
        )}
      </div>

      <AuctionsList
        page={page}
        status={currentStatus}
        search={searchQuery}
        isDetailed={isDetailedView}
      />
    </section>
  );
}
