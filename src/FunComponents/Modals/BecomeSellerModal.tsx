"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { activateSellerAccount } from "@/app/actions/seller-onboarding";
import { toast } from "sonner";

export default function BecomeSeller() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeBio, setStoreBio] = useState("");
  const router = useRouter();

  async function handleCreateSeller() {
    setLoading(true);
    const toastId = toast.loading("Activating your seller account...");
    try {
      await activateSellerAccount(storeName, storeBio);
      toast.success("Seller account activated!", { id: toastId });
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to activate account", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded font-semibold hover:opacity-90 transition"
      >
        Become a Seller
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-2">
              Create Seller Store
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Enter your business details to start listing auctions.
            </p>

            <div className="space-y-4">
              <input
                placeholder="Unique Store Name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full border border-input p-3 rounded-xl bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              />

              <textarea
                placeholder="About your store..."
                value={storeBio}
                onChange={(e) => setStoreBio(e.target.value)}
                className="w-full border border-input p-3 h-32 rounded-xl bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  className="font-medium text-muted-foreground px-4 hover:text-foreground transition"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSeller}
                  disabled={loading || !storeName}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 disabled:bg-muted transition"
                >
                  {loading ? "Activating..." : "Launch Store"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
