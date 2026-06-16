"use client";

import { useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Hammer, Trophy, Package, Settings } from "lucide-react";

const tabs = [
  { name: "Selling", icon: Hammer },
  { name: "Participating", icon: Trophy },
  { name: "Orders", icon: Package },
  { name: "Seller Settings", icon: Settings },
];

export default function ProfileTabs({
  children,
}: {
  children: React.ReactNode[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-border/80 pb-3 mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 sm:gap-4 min-w-max">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = active === i;

            return (
              <button
                key={tab.name}
                onClick={() => setActive(i)}
                className={clsx(
                  "relative py-2.5 px-4 sm:px-5 text-sm font-bold tracking-tight rounded-full transition-all duration-300 outline-none select-none cursor-pointer",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeProfileTab"
                    className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/25 z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={16} className={isActive ? "text-primary-foreground" : "text-muted-foreground"} />
                  <span>{tab.name}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 animate-in fade-in duration-300">{children[active]}</div>
    </div>
  );
}
