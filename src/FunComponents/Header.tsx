"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Mail,
  Headphones,
  Menu,
  X,
  Plus,
  LogOut,
  Settings,
  Bell,
  UserCircle,
  Gavel,
  ArrowUpRight,
  Home,
  BookOpen,
  Info,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { SignInButton, useClerk, useUser, useAuth } from "@clerk/nextjs";
import { supabase, createClerkSupabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import NotificationBell from "./Notification";
import HeaderSearch from "./HeaderSearch";

const sidebarVariants: Variants = {
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 240,
      damping: 26,
    },
  },
  closed: {
    x: "-100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 35,
    },
  },
};

const containerVariants = {
  open: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const itemVariants: Variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Auctions", href: "/auction-products", icon: Gavel },
  { name: "Blog", href: "/blogs", icon: BookOpen },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: MessageSquare },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const syncProfile = async () => {
        try {
          const token = await getToken({ template: "supabase" });
          if (!token) return;
          const authenticatedSupabase = createClerkSupabaseClient(token);
          await authenticatedSupabase.from("profiles").upsert({
            id: user.id,
            full_name: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
            avatar_url: user.imageUrl,
          });
        } catch (err) {
          console.error("Error syncing profile to Supabase:", err);
        }
      };
      syncProfile();
    }
  }, [isLoaded, isSignedIn, user, getToken]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP BAR */}
        <div className="hidden lg:flex items-center justify-between py-2.5 text-xs font-semibold text-muted-foreground/90 border-b border-border/50">
          <div className="flex items-center gap-6">
            <a href="mailto:info@auctionary.com" className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
              <Mail size={13} className="text-primary/70" /> info@auctionary.com
            </a>
            <span className="flex items-center gap-2 select-none">
              <Headphones size={13} className="text-primary/70" /> 24/7 Customer Support
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/howtobid" 
              className="flex items-center gap-1 hover:text-primary transition-colors duration-200"
            >
              How to Bid <ArrowUpRight size={12} className="opacity-60" />
            </Link>
            <span className="text-border/50 select-none">|</span>
            <Link 
              href="/howtosell" 
              className="flex items-center gap-1 hover:text-primary transition-colors duration-200"
            >
              Sell Item <ArrowUpRight size={12} className="opacity-60" />
            </Link>
          </div>
        </div>

        {/* MAIN NAV */}
        <div className="flex items-center justify-between py-4 gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary/85 flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
              <Gavel size={18} className="text-primary-foreground -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <div className="leading-tight flex flex-col">
              <p className="text-xl font-black tracking-tight text-foreground transition-colors">
                Auction<span className="text-primary">ary</span>
              </p>
              <span className="text-[9px] tracking-widest font-black uppercase text-muted-foreground mt-0.5">
                Bid Smart. Win Big.
              </span>
            </div>
          </Link>

          {/* Sliding Animated Active Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 relative z-10">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-bold tracking-tight rounded-full transition-colors duration-300 ${
                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeHeaderTab"
                      className="absolute inset-0 bg-primary rounded-full -z-10 shadow-md shadow-primary/25"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <HeaderSearch />
            </div>

            {isSignedIn ? (
              <NotificationBell userId={user.id} />
            ) : (
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 relative cursor-pointer transition-colors"
              >
                <Bell size={20} />
              </Button>
            )}

            {!isSignedIn ? (
              <SignInButton mode="modal">
                <Button className="hidden md:flex rounded-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-primary/20 cursor-pointer pl-4 pr-5 py-2.5">
                  <User size={16} className="mr-1.5 shrink-0" /> My Account
                </Button>
              </SignInButton>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="hidden md:flex rounded-full bg-card hover:bg-muted/60 border border-border text-foreground px-2 py-1.5 gap-2.5 h-10 items-center pl-2 pr-4 shadow-sm cursor-pointer transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
                  >
                    <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-primary/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={user.imageUrl} 
                        alt={user.firstName || "User"} 
                        className="object-cover w-full h-full" 
                      />
                    </div>
                    <span className="text-sm font-extrabold tracking-tight max-w-[80px] truncate">
                      {user.firstName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl p-2 mt-1 border border-border shadow-xl bg-background"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      prefetch={false}
                      className="profile-menu-item flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-foreground/80 hover:text-foreground cursor-pointer"
                    >
                      <Settings size={15} className="opacity-70" /> Profile Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => signOut({ redirectUrl: "/" })}
                    className="profile-menu-item flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 cursor-pointer"
                  >
                    <LogOut size={15} className="opacity-70" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              size="icon"
              variant="ghost"
              className="md:hidden rounded-full text-foreground hover:bg-muted shrink-0"
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.aside
              className="fixed left-0 top-0 h-full w-80 bg-background/95 backdrop-blur-lg border-r border-border/40 z-50 p-6 flex flex-col justify-between shadow-2xl"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
                <div className="flex justify-between items-center mb-8 shrink-0">
                  <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center shadow-md shadow-primary/25">
                      <Gavel size={16} className="text-primary-foreground -rotate-45" />
                    </div>
                    <div className="leading-tight flex flex-col">
                      <span className="text-lg font-black tracking-tight text-foreground">
                        Auction<span className="text-primary">ary</span>
                      </span>
                      <p className="text-[8px] uppercase tracking-widest font-black text-muted-foreground">
                        Bid Smart. Win Big.
                      </p>
                    </div>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    <X size={18} />
                  </Button>
                </div>

                <div className="mb-6 shrink-0">
                  <HeaderSearch />
                </div>

                <motion.nav 
                  className="space-y-2 flex-1"
                  variants={containerVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  {navLinks.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <motion.div key={item.name} variants={itemVariants}>
                        <Link
                          href={item.href}
                          className={`flex justify-between items-center py-3 px-4 rounded-xl font-bold transition-all duration-200 group ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                              : "text-foreground/80 hover:bg-muted hover:text-foreground border border-transparent hover:border-border/60"
                          }`}
                          onClick={() => setOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={18} className={isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary transition-colors"} />
                            <span>{item.name}</span>
                          </div>
                          <ChevronRight size={14} className={`transition-transform duration-200 ${isActive ? "text-primary-foreground translate-x-0.5" : "text-muted-foreground/60 group-hover:translate-x-0.5"}`} />
                        </Link>
                      </motion.div>
                    );
                  })}
                  {isSignedIn && (
                    <motion.div variants={itemVariants}>
                      <Link
                        href="/profile"
                        prefetch={false}
                        className={`flex justify-between items-center py-3 px-4 rounded-xl font-bold transition-all duration-200 group ${
                          pathname === "/profile"
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "text-foreground/80 hover:bg-muted hover:text-foreground border border-transparent hover:border-border/60"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <UserCircle size={18} className={pathname === "/profile" ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary transition-colors"} />
                          <span>Profile Settings</span>
                        </div>
                        <ChevronRight size={14} className={`transition-transform duration-200 ${pathname === "/profile" ? "text-primary-foreground translate-x-0.5" : "text-muted-foreground/60 group-hover:translate-x-0.5"}`} />
                      </Link>
                    </motion.div>
                  )}

                  {/* Actions & Guides Section inside mobile menu */}
                  <motion.div variants={itemVariants} className="pt-4 mt-4 border-t border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground px-4 mb-2">
                      Guides & Actions
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Link 
                        href="/howtobid"
                        onClick={() => setOpen(false)}
                        className="flex flex-col gap-1 p-3 rounded-xl bg-card border border-border hover:border-primary/20 hover:bg-muted/40 transition-all text-left group"
                      >
                        <span className="p-1.5 rounded-lg bg-primary/10 text-primary w-fit group-hover:scale-105 transition-transform">
                          <Gavel size={14} />
                        </span>
                        <span className="text-xs font-bold text-foreground">How to Bid</span>
                      </Link>
                      <Link 
                        href="/howtosell"
                        onClick={() => setOpen(false)}
                        className="flex flex-col gap-1 p-3 rounded-xl bg-card border border-border hover:border-primary/20 hover:bg-muted/40 transition-all text-left group"
                      >
                        <span className="p-1.5 rounded-lg bg-primary/10 text-primary w-fit group-hover:scale-105 transition-transform">
                          <ArrowUpRight size={14} />
                        </span>
                        <span className="text-xs font-bold text-foreground">Sell Item</span>
                      </Link>
                    </div>
                  </motion.div>
                </motion.nav>
              </div>

              {isSignedIn ? (
                <div className="border-t border-border/50 pt-4 shrink-0">
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-primary/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={user.imageUrl} alt={user.firstName || "User"} className="object-cover w-full h-full" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground leading-none truncate">{user.fullName}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[170px]">{user.primaryEmailAddress?.emailAddress}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut({ redirectUrl: "/" });
                    }}
                    className="w-full flex justify-between items-center py-2.5 px-4 rounded-xl font-bold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    Logout
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="border-t border-border/50 pt-4 shrink-0">
                  <SignInButton mode="modal">
                    <Button 
                      className="w-full rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/20"
                      onClick={() => setOpen(false)}
                    >
                      <User size={16} className="shrink-0" /> My Account
                    </Button>
                  </SignInButton>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
