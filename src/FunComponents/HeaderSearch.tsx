"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, CornerDownLeft } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export type SearchSuggestion = {
  id: string;
  title: string;
  image_url: string;
  starting_bid: number;
  current_bid: number | null;
};

const FALLBACK_IMAGE =
  "https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg?b=1&s=170x170&k=20&c=rUeK8H2EAp_sBFlbk7-m5STaJw18ldbBWsb2093N0-s=";

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut (Press '/' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        // Prevent key from typing into input
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debouncing Logic with race-condition prevention
  useEffect(() => {
    let active = true;

    const timer = setTimeout(async () => {
      const trimmedQuery = query.trim();
      if (trimmedQuery.length > 1) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("auction_items")
            .select("id, title, image_url, current_bid, starting_bid")
            .ilike("title", `%${trimmedQuery}%`)
            .limit(5);

          if (error) throw error;

          if (active) {
            setSuggestions((data as SearchSuggestion[]) || []);
            setIsOpen(true);
          }
        } catch (err) {
          console.error("Suggestion fetch error:", err);
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      } else {
        if (active) {
          setSuggestions([]);
          setIsOpen(false);
        }
      }
    }, 350); // 350ms delay for snappier suggestions

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/auction-products?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full md:w-64 lg:w-72" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          ref={inputRef}
          placeholder="Search auctions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (query.length > 1) setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          className="w-full rounded-full pl-4 pr-12 h-10 border-border bg-card text-sm focus-visible:ring-primary/40 focus-visible:ring-2 focus-visible:border-primary/50 transition-all shadow-inner"
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <>
              {/* Keyboard Hotkey Indicator */}
              {!isFocused && (
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-sans text-[10px] font-black text-muted-foreground shadow-sm">
                  /
                </kbd>
              )}
              <Search className="h-4 w-4 text-muted-foreground" />
            </>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && (suggestions.length > 0 || query.length > 1) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full mt-2 w-full md:w-80 bg-popover border border-border rounded-2xl shadow-xl z-[60] overflow-hidden backdrop-blur-md"
          >
            {suggestions.length > 0 ? (
              <div className="p-2 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground px-3 py-1.5 border-b border-border/40">
                  ⚡ Match Suggestions
                </p>
                {suggestions.map((item) => {
                  const displayPrice = item.current_bid ?? item.starting_bid;
                  return (
                    <Link
                      key={item.id}
                      href={`/product/${item.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-2 hover:bg-muted/80 rounded-xl transition-all duration-200 group"
                    >
                      <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                        <Image
                          src={item.image_url || FALLBACK_IMAGE}
                          alt={item.title}
                          fill
                          sizes="44px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                          Current: <span className="font-semibold text-foreground">₹{displayPrice.toLocaleString()}</span>
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : !loading && query.length > 1 ? (
              <div className="p-6 text-center">
                <Search className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-40" />
                <p className="text-xs text-muted-foreground">
                  No auctions match &ldquo;{query}&rdquo;
                </p>
              </div>
            ) : null}

            {query.trim().length > 1 && (
              <button
                onClick={handleSearch}
                className="w-full bg-muted/40 p-2.5 text-[11px] font-bold text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 border-t border-border flex items-center justify-between px-4"
              >
                <span>See all results for &ldquo;{query}&rdquo;</span>
                <CornerDownLeft size={10} className="opacity-60" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}