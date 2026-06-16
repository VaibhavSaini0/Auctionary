"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { Star, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

export default function ProductComments({
  auctionId,
  userId,
}: {
  auctionId: string;
  userId: string | null | undefined;
}) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const profileCache = useRef<Record<string, any>>({});
  const { getToken } = useAuth();

  useEffect(() => {
    if (!auctionId) return;

    const fetchInitialComments = async () => {
      try {
        setIsFetching(true);
        const { data } = await supabase
          .from("comments")
          .select("*, profiles(full_name, avatar_url)")
          .eq("auction_item_id", auctionId)
          .order("created_at", { ascending: false });
        if (data) setComments(data);
      } finally {
        setIsFetching(false);
      }
    };

    fetchInitialComments();

    const channel = supabase
      .channel(`comments-${auctionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `auction_item_id=eq.${auctionId}`,
        },
        async (payload) => {
          const commenterId = payload.new.commenter_id;
          let profile = profileCache.current[commenterId];

          if (!profile) {
            const { data: fetchedProfile } = await supabase
              .from("profiles")
              .select("full_name, avatar_url")
              .eq("id", commenterId)
              .single();
            
            if (fetchedProfile) {
              profile = fetchedProfile;
              profileCache.current[commenterId] = fetchedProfile;
            }
          }

          setComments((prev) => [
            { ...payload.new, profiles: profile },
            ...prev,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auctionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    if (!userId) {
      toast.error("Please sign in to comment");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = await getToken({ template: "supabase" });

      const { error } = await supabase.functions.invoke("add-comment", {
        body: {
          auction_item_id: auctionId,
          rating: rating || 5,
          content: text,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!error) {
        setText("");
        setRating(0);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {userId ? (
        <form
          onSubmit={handleSubmit}
          className={`p-6 border border-border rounded-xl bg-card shadow-sm transition-all ${
            isSubmitting ? "opacity-70 pointer-events-none" : ""
          }`}
        >
          <p className="text-sm font-semibold mb-3">Add a Comment</p>

          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={20}
                onClick={() => setRating(s)}
                className={`cursor-pointer transition-all hover:scale-110 ${
                  rating >= s
                    ? "fill-accent text-accent"
                    : "text-muted-foreground"
                }`}
              />
            ))}
            <span className="text-[10px] text-muted-foreground ml-2 mt-1">
              (Optional Rating)
            </span>
          </div>

          <textarea
            className="w-full p-4 text-sm border border-input rounded-lg outline-none focus:ring-1 focus:ring-primary transition-all bg-background min-h-25"
            placeholder="What do you think about this item?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 bg-primary text-primary-foreground px-8 py-2.5 rounded-full text-xs font-semibold hover:opacity-90 transition-colors shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </button>
        </form>
      ) : (
        <div className="p-6 text-center border border-dashed border-border rounded-xl bg-muted/40">
          <p className="text-sm text-muted-foreground">
            Please sign in to join the discussion.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {isFetching ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex gap-3 animate-pulse">
                <div className="w-9 h-9 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c.id}
              className="group border-b border-border pb-6 last:border-0 animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={
                    c.profiles?.avatar_url ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                      c.commenter_id
                  }
                  className="w-9 h-9 rounded-full object-cover border border-border"
                  alt="avatar"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {c.profiles?.full_name || "Anonymous User"}
                    </span>
                    {c.rating > 0 && (
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={8}
                            className={`${
                              i < c.rating
                                ? "fill-accent text-accent"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-12">
                {c.content}
              </p>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground bg-muted/40 rounded-xl">
            <p className="text-sm italic">
              No comments yet. Be the first to start the conversation!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
