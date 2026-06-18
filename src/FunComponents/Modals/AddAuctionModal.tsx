"use client";

import { useState, useEffect } from "react";
import { Plus, X, Loader2, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/app/actions/cloudinary";
import { createAuctionAction } from "@/app/actions/auctions";
import { toast } from "sonner"; 
import { supabase } from "@/lib/supabase/client"; // Ensure you import your client

export default function AddAuctionModal({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const router = useRouter();

  const [schedule, setSchedule] = useState(false);
  const [enableBuyNow, setEnableBuyNow] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    starting_bid: "",
    buy_now_price: "",
    start_date: "",
    end_date: "",
    category_id: 0,
  });

  // Fetch categories from the category table
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
      
      if (!error && data) {
        setCategories(data);
        if (data.length > 0) setFormData(prev => ({ ...prev, category_id: data[0].id }));
      }
    }
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const createAuctionPromise = async () => {
      let imageUrl = "https://via.placeholder.com/600x400?text=Auction+Item";

      if (imageFile) {
        const data = new FormData();
        data.append("file", imageFile);
        imageUrl = await uploadToCloudinary(data);
      }

      const startTime = schedule
        ? new Date(formData.start_date).toISOString()
        : new Date().toISOString();

      const status = schedule ? "Scheduled" : "Live";

      return await createAuctionAction({
        ...formData,
        category: formData.category_id,
        starting_bid: Number(formData.starting_bid),
        current_bid: Number(formData.starting_bid),
        buy_now_price: enableBuyNow && formData.buy_now_price
          ? Number(formData.buy_now_price)
          : null,
        status,
        starts_at: startTime,
        ends_at: new Date(formData.end_date).toISOString(),
        image_url: imageUrl,
      });
    };

    toast.promise(createAuctionPromise(), {
      loading: "Preparing your auction...",
      success: () => {
        setOpen(false);
        resetForm();
        router.refresh();
        return "Auction launched successfully!";
      },
      error: (err) => err.message || "Failed to create auction",
      finally: () => setLoading(false),
    });
  };

  const resetForm = () => {
    setSchedule(false);
    setEnableBuyNow(false);
    setImageFile(null);
    setPreviewUrl(null);
    setFormData({
      title: "",
      description: "",
      starting_bid: "",
      buy_now_price: "",
      start_date: "",
      end_date: "",
      category_id: categories[0]?.id || 0,
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-primary/20"
      >
        <Plus size={18} />
        Add New Auction
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-card text-card-foreground rounded-3xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] custom-scrollbar animate-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-lg font-bold uppercase tracking-tight">
                List New Product
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-muted transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {previewUrl && (
                <div className="w-full h-48 rounded-2xl overflow-hidden border border-border shadow-inner">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-4">
                <input
                  required
                  placeholder="Product title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-input p-4 rounded-2xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition"
                />

                {/* Category Selection Dropdown */}
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-muted-foreground ml-2 tracking-widest">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                    className="w-full border border-input p-4 rounded-2xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  required
                  type="number"
                  min="1"
                  placeholder="Starting price (₹)"
                  value={formData.starting_bid}
                  onChange={(e) => setFormData({ ...formData, starting_bid: e.target.value })}
                  className="w-full border border-input p-4 rounded-2xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition"
                />

                <label className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-md accent-primary"
                    checked={enableBuyNow}
                    onChange={(e) => setEnableBuyNow(e.target.checked)}
                  />
                  <span className="font-semibold text-sm">Enable Buy Now (instant purchase)</span>
                </label>

                {enableBuyNow && (
                  <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-2 tracking-widest">
                      Buy Now Price (₹)
                    </label>
                    <input
                      required={enableBuyNow}
                      type="number"
                      min="1"
                      placeholder="Instant buy price — must exceed starting bid"
                      value={formData.buy_now_price}
                      onChange={(e) => setFormData({ ...formData, buy_now_price: e.target.value })}
                      className="w-full border border-input p-4 rounded-2xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition"
                    />
                    <p className="text-[11px] text-muted-foreground ml-2">
                      Buyers can skip bidding and purchase immediately at this price.
                    </p>
                  </div>
                )}

                <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-input p-4 rounded-2xl hover:bg-muted/50 transition">
                  <ImagePlus className="text-primary" />
                  <span className="text-sm font-medium text-muted-foreground truncate">
                    {imageFile ? imageFile.name : "Upload product image"}
                  </span>
                  <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                </label>

                <textarea
                  required
                  placeholder="Tell buyers about your product..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-input p-4 rounded-2xl h-32 bg-background focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
                />

                <label className="flex items-center gap-3 p-2 bg-muted/30 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-md accent-primary"
                    checked={schedule}
                    onChange={(e) => setSchedule(e.target.checked)}
                  />
                  <span className="font-semibold text-sm">Schedule for later?</span>
                </label>

                {schedule && (
                  <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-2 tracking-widest">
                      Start Time
                    </label>
                    <input
                      required
                      type="datetime-local"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full border border-input p-4 rounded-2xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-2 tracking-widest">
                    End Time
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full border border-input p-4 rounded-2xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black uppercase tracking-widest transition hover:opacity-90 disabled:bg-muted shadow-xl shadow-primary/10 mt-6"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Launch Auction"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}