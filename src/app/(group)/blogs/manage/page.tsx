"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useUser, useAuth } from "@clerk/nextjs";
import { Edit, Trash2, Eye, EyeOff, Loader2, Plus, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import EditBlogModal, { BlogItem } from "@/FunComponents/Modals/EditBlogModal";
import { toast } from "sonner";

export default function ManageBlogsPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchMyBlogs = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .eq("author_id", user?.id)
      .order("created_at", { ascending: false });

    setBlogs((data as BlogItem[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchMyBlogs();
  }, [user, fetchMyBlogs]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setActionId(id);
    const toastId = toast.loading("Deleting post...");

    try {
      const token = await getToken({ template: "supabase" });

      const { error } = await supabase.functions.invoke("delete-blog", {
        body: { id },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;

      setBlogs(blogs.filter((b) => b.id !== id));
      toast.success("Post deleted successfully", { id: toastId });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to delete post";
      toast.error(errMsg, { id: toastId });
    } finally {
      setActionId(null);
    }
  };

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    setActionId(id);
    const statusText = !currentStatus ? "Published" : "Hidden (Draft)";
    const toastId = toast.loading(`Moving to ${statusText}...`);

    try {
      const token = await getToken({ template: "supabase" });

      const { error } = await supabase.functions.invoke("update-blog", {
        body: {
          id,
          is_published: !currentStatus,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;

      setBlogs(
        blogs.map((b) =>
          b.id === id ? { ...b, is_published: !currentStatus } : b
        )
      );
      toast.success(`Post is now ${statusText}`, { id: toastId });
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to update visibility";
      toast.error(errMsg, { id: toastId });
    } finally {
      setActionId(null);
    }
  };

  const handleEditClick = (blog: BlogItem) => {
    setSelectedBlog(blog);
    setIsEditModalOpen(true);
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse font-black text-muted-foreground">
        Loading Dashboard...
      </div>
    );

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 bg-background">
      <Link
        href="/blogs"
        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary mb-10 transition-colors"
      >
        <ChevronLeft size={16} /> Back to Blogs
      </Link>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-foreground">Manage Blogs</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Edit, delete, or change visibility of your stories.
          </p>
        </div>
        <Link
          href="/blogs/create"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black hover:bg-primary/90 transition shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> New Post
        </Link>
      </div>

      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Post Info
              </th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Status
              </th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {blogs.map((blog) => (
              <tr
                key={blog.id}
                className="hover:bg-muted/40 transition-colors"
              >
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                      <Image src={blog.image_url} alt="" fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground line-clamp-1">
                        {blog.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {blog.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      blog.is_published
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {blog.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVisibility(blog.id, blog.is_published)}
                      className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500/40 transition-colors"
                      title="Toggle Visibility"
                      disabled={actionId === blog.id}
                    >
                      {actionId === blog.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : blog.is_published ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                    <button
                      onClick={() => handleEditClick(blog)}
                      className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-colors"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40 transition-colors"
                      disabled={actionId === blog.id}
                    >
                      {actionId === blog.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {blogs.length === 0 && (
          <div className="py-20 text-center text-muted-foreground font-bold uppercase tracking-widest text-xs">
            You haven&apos;t written any stories yet.
          </div>
        )}
      </div>

      <EditBlogModal
        blog={selectedBlog}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchMyBlogs}
      />
    </section>
  );
}
