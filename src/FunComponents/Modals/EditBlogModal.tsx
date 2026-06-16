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
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X size={24} className="text-gray-400" />
        </button>

        <div className="p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold mb-1 text-gray-900">Edit Blog Post</h1>
            <p className="text-gray-500 text-sm">Update your story details and save changes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Title</label>
              <input
                required
                value={formData.title}
                className="w-full p-4 rounded-2xl bg-gray-50 border focus:ring-2 focus:ring-orange-400 outline-none font-bold"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-4 bg-gray-50 rounded-2xl border font-bold"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Thumbnail</label>
                <label className="flex items-center justify-center gap-2 p-4 border rounded-2xl cursor-pointer hover:bg-gray-50 transition border-dashed">
                  <UploadCloud size={18} className="text-orange-500" />
                  <span className="text-sm font-bold text-gray-600">
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
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Short Description</label>
              <textarea
                rows={2}
                value={formData.excerpt}
                className="w-full p-4 rounded-2xl bg-gray-50 border resize-none font-medium"
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Full Content</label>
              <textarea
                rows={6}
                value={formData.content}
                className="w-full p-4 rounded-2xl bg-gray-50 border resize-none leading-relaxed font-medium"
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                className="flex-[2] py-4 rounded-2xl bg-gray-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-orange-500 transition disabled:opacity-50"
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