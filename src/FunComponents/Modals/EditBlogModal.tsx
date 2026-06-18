"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { uploadToCloudinary } from "@/app/actions/cloudinary";
import { Save, Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner"; // Ensure sonner is installed
import { useAuth } from "@clerk/nextjs";

export interface BlogItem {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  image_url: string;
  is_published: boolean;
  author_id: string;
  created_at: string;
}

interface EditBlogModalProps {
  blog: BlogItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBlogModal({ blog, isOpen, onClose, onSuccess }: EditBlogModalProps) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        category: blog.category || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
      });
    }
    
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      if (data) setCategories(data);
    };
    fetchCategories();
  }, [blog]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;
    setLoading(true);

    // Create a toast ID to update the same toast throughout the process
    const toastId = toast.loading("Updating your story...");

    try {
      let imageUrl = blog.image_url;

      if (imageFile) {
        const form = new FormData();
        form.append("file", imageFile);
        imageUrl = await uploadToCloudinary(form);
      }

      const token = await getToken({ template: "supabase" });

      const { error } = await supabase.functions.invoke("update-blog", {
        body: { 
            id: blog.id,
            ...formData, 
            image_url: imageUrl 
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (error) throw error;
      
      // Success Notification
      toast.success("Blog updated successfully!", { id: toastId });
      
      onSuccess(); 
      onClose();   
    } catch (err) {
      // Error Notification
      const errMsg = err instanceof Error ? err.message : "Failed to update blog";
      toast.error(errMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in duration-300 shadow-2xl">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
        >
          <X size={24} />
        </button>

        <div className="p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold mb-1 text-foreground">Edit Blog Post</h1>
            <p className="text-muted-foreground text-sm">Update your story details and save changes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Title</label>
              <input
                required
                value={formData.title}
                className="w-full p-4 rounded-2xl bg-muted border border-border text-foreground focus:ring-2 focus:ring-primary/40 outline-none font-bold"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-4 bg-muted rounded-2xl border border-border text-foreground font-bold"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Thumbnail</label>
                <label className="flex items-center justify-center gap-2 p-4 border border-dashed border-border rounded-2xl cursor-pointer hover:bg-muted/60 transition-colors text-foreground">
                  <UploadCloud size={18} className="text-primary" />
                  <span className="text-sm font-bold text-muted-foreground">
                    {imageFile ? imageFile.name : "Change image (Optional)"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Short Description</label>
              <textarea
                rows={2}
                value={formData.excerpt}
                className="w-full p-4 rounded-2xl bg-muted border border-border text-foreground resize-none font-medium"
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Full Content</label>
              <textarea
                rows={6}
                value={formData.content}
                className="w-full p-4 rounded-2xl bg-muted border border-border text-foreground resize-none leading-relaxed font-medium"
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl bg-muted text-foreground font-bold hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                className="flex-[2] py-4 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}