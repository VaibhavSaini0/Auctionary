"use client";

import { motion } from "framer-motion";
import { Gavel, ShieldCheck, TrendingUp, Users, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: <Gavel size={20} />,
    title: "Smart Live Auctions",
    desc: "Real-time bidding with instant updates, fair competition, and transparent pricing for every auction.",
    status: "Step 01",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Verified Sellers",
    desc: "All sellers are reviewed and verified to ensure authenticity, trust, and premium quality items.",
    status: "Step 02",
  },
  {
    icon: <TrendingUp size={20} />,
    title: "Competitive Pricing",
    desc: "Bid-driven pricing ensures you always get the true market value — no hidden margins.",
    status: "Step 03",
  },
  {
    icon: <Users size={20} />,
    title: "Growing Community",
    desc: "Thousands of bidders and collectors actively participate every day across multiple categories.",
    status: "Step 04",
  },
];

export default function HomeAuctionIntro() {
  return (
    <section className="pt-24 pb-12 bg-background overflow-hidden relative">
      {/* Subtle background decorations */}
      <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-orange-400/5 blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-20">
          <span className="text-xs font-black tracking-[0.25em] text-primary uppercase bg-primary/10 px-4 py-2 rounded-full">
            The Process
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-6 text-foreground tracking-tight">
            How it <span className="text-orange-500 font-light font-serif italic">Works</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">
            From vintage collectibles to modern masterpieces, here is how you can participate effortlessly.
          </p>
        </div>

        {/* CUSTOM VERTICAL TIMELINE */}
        <div className="relative">
          {/* Vertical Line Connector with Gradient */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-8 w-[2px] bg-gradient-to-b from-primary via-orange-400 to-green-500 -translate-x-1/2 hidden sm:block opacity-60" />

          <div className="space-y-12 md:space-y-0">
            {features.map((item, i) => (
              <div key={i} className="relative flex flex-col md:flex-row items-center justify-between md:mb-20 last:mb-0">
                
                {/* 1. Left Content (Desktop) / Full Content (Mobile) */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`w-full md:w-[44%] p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative group cursor-pointer ${
                    i % 2 === 0 ? "md:text-right" : "md:order-last md:text-left"
                  }`}
                >
                  <span className="text-xs font-black text-orange-500 mb-2 block uppercase tracking-wider">
                    {item.status}
                  </span>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                  
                  {/* Subtle hover accent line */}
                  <div className={`absolute bottom-0 w-12 h-1 bg-primary rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                    i % 2 === 0 ? "right-6" : "left-6"
                  }`} />
                </motion.div>

                {/* 2. Center Icon Node */}
                <div className="absolute left-4 md:left-1/2 top-0 md:top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 hidden sm:block">
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    className="w-12 h-12 rounded-full bg-card border-4 border-primary flex items-center justify-center text-primary shadow-xl shadow-primary/10 transition-colors duration-300 hover:border-orange-500 cursor-pointer"
                  >
                    {item.icon}
                  </motion.div>
                </div>

                {/* 3. Empty Space for layout balance (Desktop) */}
                <div className="hidden md:block w-[44%]" />
              </div>
            ))}

            {/* Final Completion Node */}
            <div className="relative flex justify-center pt-8">
               <motion.div 
                 animate={{ scale: [1, 1.1, 1] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-400/30 z-10 border-4 border-background"
               >
                  <CheckCircle2 size={24} />
               </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}