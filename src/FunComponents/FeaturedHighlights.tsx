"use client";

import {
  Handshake,
  Gavel,
  ShieldCheck,
  HelpCircle,
  Users,
  Package,
  UserCheck,
  LifeBuoy,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FeaturedHighlights() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-muted/40" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 max-w-xl"
        >
          <span className="inline-block text-xs tracking-widest px-4 py-1 rounded-full border border-border bg-card text-muted-foreground mb-4">
            → HIGHLIGHTED
          </span>
          <h2 className="text-4xl font-semibold text-foreground">
            Our Featured{" "}
            <span className="text-muted-foreground font-normal">
              Highlights.
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24 relative">
          {features.map((f, i) => (
            <Feature key={i} {...f} index={i} />
          ))}
        </div>

        <div className="relative pt-12 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Stat
              icon={<Users className="w-6 h-6 text-primary" />}
              value={3500}
              suffix="K"
              label="Customers"
              sub="Active community base"
            />
            <Stat
              icon={<Package className="w-6 h-6 text-primary" />}
              value={700}
              suffix="+"
              label="Auctions"
              sub="Premium listings daily"
            />
            <Stat
              icon={<UserCheck className="w-6 h-6 text-primary" />}
              value={5500}
              suffix="K"
              label="Bidders"
              sub="Registered active bids"
            />
            <Stat
              icon={<LifeBuoy className="w-6 h-6 text-primary" />}
              value={7400}
              suffix="K"
              label="Resolved"
              sub="User queries answered"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: <Handshake className="w-6 h-6 text-primary" />,
    title: "Discover the best deals",
    text: "Access unmatched prices directly set by high-demand bidding auctions.",
  },
  {
    icon: <Gavel className="w-6 h-6 text-primary" />,
    title: "Standout Auctions",
    text: "Bid on curated antiques, rare jewelry, coins, and premium collectibles.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: "Pay safely",
    text: "All payments are processed securely via verified Stripe checkouts.",
  },
  {
    icon: <LifeBuoy className="w-6 h-6 text-primary" />,
    title: "We're here to help",
    text: "24/7 client support for hassle-free shipping and bidding transactions.",
  },
];

function Feature({
  icon,
  title,
  text,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="relative z-10 bg-card border border-border p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Rounded Icon Backdrop */}
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:rotate-6">
          {icon}
        </div>
        <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

function Stat({
  icon,
  value,
  suffix = "",
  label,
  sub,
}: {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  sub: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * value));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-4 bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
    >
      <div className="p-3 bg-muted rounded-xl text-primary">{icon}</div>
      <div>
        <div className="text-lg font-black text-foreground tracking-tight">
          {count}
          {suffix}{" "}
          <span className="font-bold text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md ml-1 inline-block">
            {label}
          </span>
        </div>
        <p className="text-[10px] uppercase font-black tracking-wider text-muted-foreground mt-0.5">{sub}</p>
      </div>
    </motion.div>
  );
}
