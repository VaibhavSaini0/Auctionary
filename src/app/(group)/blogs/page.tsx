"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Tag as TagIcon, Loader2, X, PenSquareIcon, Calendar, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { SignInButton, useUser } from "@clerk/nextjs";

const POSTS_PER_PAGE = 4;
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1516979187457-637abb4f9353";

export default function BlogPage() {
  const { isSignedIn } = useUser();
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        if (categories.length === 0) {
          const { data: catData, error: catError } = await supabase
            .from("categories")
            .select("name")
            .order("name");

          if (catError) console.error("Categories fetch failed:", catError);
          if (catData && active) setCategories(catData);
        }

        let query = supabase
          .from("blogs")
          .select("*", { count: "exact" })
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (selectedCategory !== "All") query = query.eq("category", selectedCategory);
        if (searchQuery)
          query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);

        const { data, count, error: blogsError } = await query.range(
          (currentPage - 1) * POSTS_PER_PAGE,
          currentPage * POSTS_PER_PAGE - 1
        );

        if (blogsError) throw blogsError;

        if (active) {
          setPosts(data || []);
          setTotalCount(count || 0);
        }
      } catch (err) {
        console.error("Blogs fetch failed:", err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    const t = setTimeout(fetchData, 350);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [selectedCategory, searchQuery, currentPage]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <section className="relative min-h-screen bg-background pt-8 sm:pt-10 pb-16 sm:pb-24 overflow-hidden">
      {/* Premium background mesh lights */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8faf4] via-[#f7f9f2] to-[#eef3ea] -z-20" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-[150px] -z-10 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header Section */}
        <div className="mb-16 relative z-10 bg-card border border-border rounded-[2rem] p-8 sm:p-12 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6 overflow-hidden">
          {/* Decorative header background glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          <div className="space-y-3">
            <span className="inline-block text-[10px] tracking-[0.25em] px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary font-black uppercase">
              ✦ Insights & Articles
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
              Our <span className="text-orange-500 font-light font-serif italic">Blog</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="text-border">/</span>
              <span className="text-foreground font-semibold">
                {searchQuery ? `Search: "${searchQuery}"` : selectedCategory}
              </span>
            </p>
          </div>

          {/* Search bar + button inside blog header */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <div className="relative flex-1 sm:w-64 md:w-72 lg:w-80">
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search articles..."
                className="w-full pl-5 pr-10 py-3.5 rounded-2xl bg-muted/40 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all font-semibold text-foreground placeholder-muted-foreground/50"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                toast.success("Searching for articles...");
              }}
              className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-md hover:shadow-primary/20 active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Search size={14} /> Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start relative z-10">
          {/* Main Feed Container */}
          <div className="lg:col-span-2 space-y-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="animate-spin text-primary" size={42} />
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Fetching articles...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-card rounded-3xl border border-destructive/20 p-8 space-y-4 shadow-sm">
                <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
                <h3 className="text-lg font-bold">Failed to load articles</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  There was a problem communicating with our services. Please try reloading the page.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-primary/95 transition-all shadow-md active:scale-95"
                >
                  Reload Page
                </button>
              </div>
            ) : posts.length ? (
              <div className="space-y-8">
                {posts.map((post) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -6 }}
                    className="bg-card rounded-[2rem] overflow-hidden border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group flex flex-col sm:flex-row h-auto min-h-64"
                  >
                    {/* Cover Image */}
                    <div className="relative w-full sm:w-64 md:w-72 min-h-[220px] sm:min-h-full h-56 sm:h-auto shrink-0 overflow-hidden bg-muted">
                      <Image
                        src={post.image_url || FALLBACK_IMAGE}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 288px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-60 pointer-events-none" />
                    </div>

                    {/* Metadata & Content details */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary mb-3">
                          <span className="bg-primary/10 px-2.5 py-1 rounded-full">
                            {post.category}
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1 font-semibold">
                            <Calendar size={12} />
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <h2 className="text-xl font-bold text-foreground leading-snug hover:text-primary transition-colors mb-2 truncate">
                          <Link href={`/blogs/${post.id}`}>{post.title}</Link>
                        </h2>

                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0">
                        <Link
                          href={`/blogs/${post.id}`}
                          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-500 hover:text-orange-600 transition-colors group/link cursor-pointer"
                        >
                          Read Full Story
                          <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-card rounded-3xl border border-border p-8 shadow-inner">
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">No stories found matching your selection.</p>
              </div>
            )
            }

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2.5 pt-8">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 border ${
                      currentPage === i + 1
                        ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105"
                        : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary cursor-pointer"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Sidebar Container */}
          <aside className="space-y-8 lg:sticky lg:top-24">
            {/* Dashboard Action panel */}
            {isSignedIn ? (
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-3.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">Writer Toolkit</h3>
                
                <Link
                  href="/blogs/create"
                  prefetch={false}
                  className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-3.5 rounded-2xl text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-md active:scale-98"
                >
                  <TagIcon size={16} /> Create New Post
                </Link>
                
                <Link
                  href="/blogs/manage"
                  prefetch={false}
                  className="w-full flex items-center justify-center gap-2 bg-muted/60 text-foreground py-3.5 rounded-2xl text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-sm active:scale-98"
                >
                  <PenSquareIcon size={16} /> Manage Writing Dashboard
                </Link>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-3.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">Writer Toolkit</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sign in to create your own blog posts and manage your writing dashboard.
                </p>
                <SignInButton mode="modal">
                  <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-2xl text-sm font-bold hover:bg-primary/95 transition-all shadow-md active:scale-98 cursor-pointer">
                    Sign In to Write
                  </button>
                </SignInButton>
              </div>
            )}


            {/* Categories Selection */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-4">Categories</h3>
              <ul className="space-y-2.5">
                <li
                  onClick={() => {
                    setSelectedCategory("All");
                    setCurrentPage(1);
                  }}
                  className={`cursor-pointer text-sm py-2 px-3 rounded-xl transition-all font-semibold flex items-center justify-between ${
                    selectedCategory === "All"
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] bg-border/40 px-2 py-0.5 rounded-full font-black text-muted-foreground">★</span>
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat.name}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setCurrentPage(1);
                    }}
                    className={`cursor-pointer text-sm py-2 px-3 rounded-xl transition-all font-semibold flex items-center justify-between ${
                      selectedCategory === cat.name
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] bg-border/40 px-2 py-0.5 rounded-full font-black text-muted-foreground">✦</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
