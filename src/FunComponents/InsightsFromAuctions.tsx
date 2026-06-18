"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PICSUM } from "@/lib/constants/images";

export default function InsightsFromAuctions() {
  return (
    <section className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-16 sm:py-24 bg-background">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <div>
          <span className="inline-block text-xs tracking-widest px-4 py-1 rounded-full border border-border bg-muted mb-3">
            → READ OUR
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-foreground">
            Insights From The{" "}
            <span className="text-muted-foreground font-normal">
              Auctions.
            </span>
          </h2>
        </div>

        <Button
          variant="ghost"
          className="group gap-2 text-sm font-medium text-foreground hover:text-primary self-start sm:self-auto"
        >
          View All Article
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Button>
      </div>

      {/* ARTICLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
        <ArticleCard
          image={PICSUM.insight1}
          meta="Real State · October 3, 2024"
          title="Auction Avenue Your Roadmap to Winning Deals open."
        />

        <ArticleCard
          image={PICSUM.insight2}
          meta="Old Coin · October 8, 2024"
          title="Bidder’s Beat off Insights from the Auction Floor This."
        />
      </div>
    </section>
  );
}

function ArticleCard({
  image,
  meta,
  title,
}: {
  image: string;
  meta: string;
  title: string;
}) {
  const parts = meta.split(" · ");
  const category = parts[0] || "Auction";
  const date = parts[1] || "Today";

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/20 cursor-pointer flex flex-col h-full">
      
      {/* IMAGE CONTAINER WITH ZOOM */}
      <div className="relative h-60 sm:h-72 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        
        {/* Category Badge over Image */}
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md backdrop-blur-xs">
          {category}
        </div>
      </div>

      {/* CARD CONTENT */}
      <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            ✦ Published {date} · 5 min read
          </p>

          <h3 className="text-lg sm:text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
            {title}
          </h3>
        </div>

        <div className="pt-4 border-t border-border mt-4">
          <Button
            variant="ghost"
            className="group/btn px-0 gap-2 text-sm font-bold text-foreground hover:text-primary hover:bg-transparent flex items-center cursor-pointer"
          >
            Read Full Story
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1.5 group-hover/btn:-translate-y-1.5 text-orange-500" />
          </Button>
        </div>
      </div>
    </article>
  );
}
