"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { uploadToCloudinary } from "@/app/actions/cloudinary";
import { useRouter } from "next/navigation";
import { Save, Loader2, UploadCloud, ChevronLeft, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function CreateBlogPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await supabase.from("categories").select("*").order("name");
        if (data?.length) {
          setCategories(data);
          setFormData((p) => ({ ...p, category: data[0].name }));
        }
      } catch (err) {
        console.error("Categories fetch failed:", err);
      }
    };
    fetchCategories();
  }, []);

  // Cleanup object URL preview to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle Drag Events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        toast.error("Please upload an image file (PNG, JPG, WebP)");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearSelectedImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return toast.error("Please enter a title");
    if (!formData.category) return toast.error("Please select a category");
    if (!formData.content.trim()) return toast.error("Please enter the blog content");
    
    setLoading(true);

    const publishPromise = async () => {
      let imageUrl = "https://images.unsplash.com/photo-1516979187457-637abb4f9353";

      if (imageFile) {
        const form = new FormData();
        form.append("file", imageFile);
        imageUrl = await uploadToCloudinary(form);
      }

      const token = await getToken({ template: "supabase" });

      const { error } = await supabase.functions.invoke("create-blog", {
        body: { ...formData, image_url: imageUrl },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (error) throw error;
      return "Blog published successfully!";
    };

    toast.promise(publishPromise(), {
      loading: 'Uploading thumbnail and publishing post...',
      success: (data) => {
        router.push("/blogs");
        return data;
      },
      error: (err) => err.message || "Failed to publish blog",
      finally: () => setLoading(false),
    });
  };

  return (
    <section className="relative min-h-screen bg-background pt-8 sm:pt-10 pb-16 sm:pb-20 overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8faf4] via-[#f7f9f2] to-[#eef3ea] -z-20" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <Link 
          href="/blogs" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-primary mb-10 transition-colors group cursor-pointer"
        >
          <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Articles
        </Link>

        <div className="mb-12">
          <span className="inline-block text-[10px] tracking-[0.25em] px-4 py-1.5 rounded-full border border-border bg-card text-muted-foreground font-black mb-3 uppercase">
            ✦ Creator Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-none">
            Create <span className="text-orange-500 font-light font-serif italic">New Post</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Share your thoughts, tips, and insights with the Auctionary bidding community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-[2.5rem] p-6 sm:p-10 shadow-lg space-y-8"
        >
          {/* Title input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">Title</label>
            <input
              required
              disabled={loading}
              placeholder="Give your story an catchy title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-bold text-foreground placeholder-muted-foreground/50 transition-all text-base"
            />
          </div>

          {/* Category selection & Image upload */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">Category</label>
              <select
                disabled={loading}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-semibold text-foreground transition-all cursor-pointer h-14"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name} className="font-semibold text-foreground">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">Cover Thumbnail</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />
              
              {/* Drag & Drop uploader area */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => !loading && fileInputRef.current?.click()}
                className={`relative flex items-center justify-center border-2 border-dashed rounded-2xl p-4 cursor-pointer min-h-[56px] transition-all h-14 overflow-hidden ${
                  isDragActive
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-border hover:bg-muted/40 hover:border-muted"
                } ${loading ? "opacity-50 pointer-events-none" : ""}`}
              >
                {imagePreview ? (
                  <div className="absolute inset-0 flex items-center justify-between px-5 bg-card z-10">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0 border bg-muted">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      </div>
                      <span className="text-xs font-bold text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                        {imageFile?.name}
                      </span>
                    </div>
                    <button
                      onClick={clearSelectedImage}
                      className="p-1 rounded-full bg-muted hover:bg-destructive hover:text-white transition-colors"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <UploadCloud size={18} className="text-primary animate-bounce duration-1000" />
                    <span className="text-xs font-semibold">
                      Drag & Drop or <span className="text-primary font-bold">Browse</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">Short Description</label>
            <textarea
              rows={3}
              disabled={loading}
              placeholder="Write a brief teaser for the listing page..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-medium text-foreground placeholder-muted-foreground/50 transition-all resize-none text-sm leading-relaxed"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">Full Story Content</label>
            <textarea
              rows={12}
              required
              disabled={loading}
              placeholder="Tell your story here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-medium text-foreground placeholder-muted-foreground/50 transition-all resize-none text-sm leading-relaxed"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-foreground text-background font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-sm uppercase tracking-wider"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Publishing Story...
              </>
            ) : (
              <>
                <Save size={16} /> Publish Post
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}