"use client";

import { motion } from "framer-motion";
import { Search, Wallet, Hammer, Trophy, CheckCircle2 } from "lucide-react";

const biddingSteps = [
  {
    icon: <Search size={20} />,
    title: "Find Your Item",
    desc: "Browse our curated collection of premium items. Filter by category, price, or end time to find exactly what you're looking for.",
    status: "Step 01",
  },
  {
    icon: <Wallet size={20} />,
    title: "Top Up Your Wallet",
    desc: "Add funds to your secure wallet using Stripe. Having a balance ready ensures you can place bids instantly without missing out.",
    status: "Step 02",
  },
  {
    icon: <Hammer size={20} />,
    title: "Place Your Bid",
    desc: "Enter your bid amount on the product page. Our real-time system updates instantly so you know exactly where you stand.",
    status: "Step 03",
  },
  {
    icon: <Trophy size={20} />,
    title: "Win the Auction",
    desc: "If you're the highest bidder when the clock hits zero, the item is yours! Funds are automatically processed for a smooth handover.",
    status: "Step 04",
  },
];

export default function HowToBid() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-16">
          <span className="text-xs font-black tracking-[0.25em] text-primary uppercase bg-primary/10 px-4 py-2 rounded-full">
            Guide
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-6 text-foreground tracking-tight">
            How to <span className="text-orange-500 font-light font-serif italic">Bid</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">
            Get started in minutes with our transparent, step-by-step bidding process.
          </p>
        </div>

        {/* 4-COLUMN CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {biddingSteps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="relative bg-card border border-border p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-orange-500/20 transition-all duration-300 group cursor-pointer overflow-hidden flex flex-col justify-between min-h-[260px]"
            >
              {/* Large low-opacity Step indicator */}
              <div className="absolute -top-4 -right-2 text-8xl font-black text-foreground/[0.03] select-none group-hover:text-primary/[0.04] transition-colors duration-300">
                {item.status.split(" ")[1]}
              </div>

              <div>
                {/* Icon Circle */}
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                  {item.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Progress pill indicator */}
              <div className="mt-6 text-[10px] font-black uppercase text-orange-500 tracking-wider">
                {item.status}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}