"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Gavel, Trophy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { markNotificationAsRead } from "@/app/actions/notification";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (data) setNotifications(data);
    };

    fetchNotifications();

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
          setIsRinging(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    if (isRinging) {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
      setTimeout(() => setIsRinging(false), 1500);
    }
  }, [isRinging]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRead = async (id: string, link: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    await markNotificationAsRead(id);
    router.push(link);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 focus:outline-none cursor-pointer"
      >
        <Bell className="w-5.5 h-5.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold text-white items-center justify-center">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="
              fixed sm:absolute
              left-1/2 sm:left-auto
              -translate-x-1/2 sm:translate-x-0
              right-auto sm:right-0
              top-16 sm:top-auto
              mt-2
              w-[95vw] sm:w-[380px]
              max-h-[80vh]
              overflow-y-auto
              bg-popover
              shadow-2xl
              rounded-2xl
              border
              border-border/80
              z-50
              scrollbar-hide
              backdrop-blur-md
              divide-y
              divide-border/60
            "
          >
            <div className="p-4 bg-muted/30 font-black text-sm text-foreground flex justify-between items-center shrink-0">
              <span>Notifications</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-black">
                {notifications.length}
              </span>
            </div>

            <div className="divide-y divide-border/40">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-muted/50 text-muted-foreground/50">
                    <Bell className="w-6 h-6" />
                  </div>
                  <p className="font-semibold">No notifications yet</p>
                  <p className="text-xs max-w-[200px] leading-normal opacity-70">We&rsquo;ll let you know when active auctions have updates.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleRead(n.id, n.link)}
                    className={`p-4 flex gap-3 cursor-pointer transition-all duration-200 border-l-2 ${
                      !n.is_read
                        ? "bg-primary/5 border-primary hover:bg-primary/10"
                        : "border-transparent hover:bg-muted/50"
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {n.type === "bid" ? (
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                          <Gavel size={16} />
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                          <Trophy size={16} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-muted-foreground/80 mt-2 block font-medium">
                        {formatDistanceToNow(new Date(n.created_at))} ago
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
