import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, BookOpen, Share2, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

// UUID validation regex (8-4-4-4-12 hex characters)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1516979187457-637abb4f9353";

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  // 1. Verify UUID format before calling database
  if (!UUID_REGEX.test(id)) {
    notFound();
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let post: any = null;
  let relatedPosts: any[] = [];
  let readTime = 1;

  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      notFound();
    }

    post = data;

    // Calculate reading time based on word count
    const wordCount = post.content ? post.content.trim().split(/\s+/).length : 0;
    readTime = Math.max(1, Math.ceil(wordCount / 225)); // avg 225 words per min

    // Fetch related posts from the same category
    const { data: related } = await supabase
      .from("blogs")
      .select("id, title, category, image_url, created_at")
      .eq("is_published", true)
      .eq("category", post.category)
      .neq("id", id)
      .order("created_at", { ascending: false })
      .limit(3);

    relatedPosts = related || [];
  } catch (err) {
    console.error("BlogPostPage load exception:", err);
    // If notFound was thrown inside, propagate it
    if (err instanceof Error && err.message === "NEXT_NOT_FOUND") {
      throw err;
    }
    
    // Return graceful layout rather than raw 500 page
    return (
      <div className="py-32 text-center max-w-md mx-auto px-6">
        <div className="bg-destructive/10 text-destructive rounded-2xl p-4 w-14 h-14 flex items-center justify-center mx-auto mb-6 border border-destructive/20 animate-pulse">
          <BookOpen size={24} />
        </div>
        <h2 className="text-xl font-bold mb-2">Error loading story</h2>
        <p className="text-sm text-muted-foreground mb-6">
          We encountered an unexpected problem retrieving this article. Please return to our feed or check back later.
        </p>
        <Link 
          href="/blogs"
          className="px-6 py-3 bg-primary text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-primary/95 transition-all shadow-md active:scale-95 inline-block"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background relative overflow-hidden pb-24">
      {/* Background soft mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8faf4] via-[#f7f9f2] to-[#eef3ea] -z-20" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[120px] -z-10 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto pt-8 pb-16 px-6 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <Link 
          href="/blogs" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-primary mb-10 transition-colors group cursor-pointer"
        >
          <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Articles
        </Link>

        {/* Categories + Reading metadata */}
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
            {post.category}
          </span>
          <span className="text-muted-foreground text-xs font-semibold flex items-center gap-1">
            <Calendar size={13} />
            {new Date(post.created_at).toLocaleDateString()}
          </span>
          <span className="text-muted-foreground text-xs font-semibold flex items-center gap-1">
            <Clock size={13} />
            {readTime} min read
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-foreground leading-[1.15] mb-8 tracking-tight">
          {post.title}
        </h1>

        {/* Hero image container */}
        <div className="relative w-full h-[240px] sm:h-[450px] rounded-[2rem] overflow-hidden mb-12 shadow-xl border border-border bg-muted">
          <Image 
            src={post.image_url || FALLBACK_IMAGE} 
            alt={post.title} 
            fill 
            className="object-cover" 
            priority
          />
        </div>

        {/* Article content grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-20">
          
          {/* Side share block */}
          <div className="md:col-span-1 flex md:flex-col items-center gap-3 sticky top-28 pt-2">
            <span className="hidden md:inline text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Share</span>
            <button className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm active:scale-90 cursor-pointer" title="Share link">
              <Share2 size={15} />
            </button>
          </div>

          {/* Actual text body */}
          <div className="md:col-span-11 prose prose-stone max-w-none min-w-0">
            <div className="text-foreground/80 leading-relaxed text-base sm:text-lg whitespace-pre-wrap font-medium space-y-6">
              {post.content}
            </div>
          </div>
        </div>

        {/* Related posts section */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-border pt-16 mt-16">
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground mb-8">Related Stories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.id}
                  href={`/blogs/${rPost.id}`}
                  className="bg-card rounded-2xl border border-border p-4 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Related Image */}
                    <div className="relative h-36 w-full rounded-xl overflow-hidden mb-4 bg-muted border border-border">
                      <Image 
                        src={rPost.image_url || FALLBACK_IMAGE} 
                        alt="" 
                        fill 
                        sizes="(max-width: 768px) 100vw, 220px"
                        className="object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                    </div>
                    
                    <span className="text-[9px] font-black uppercase text-primary/80 tracking-wider">
                      {rPost.category}
                    </span>
                    
                    <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mt-1 mb-4 leading-snug">
                      {rPost.title}
                    </h4>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-orange-500 hover:text-orange-600 transition-colors">
                    Read Story
                    <ArrowRight size={10} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
}