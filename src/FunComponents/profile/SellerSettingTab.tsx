"use client";

import { Pencil, Save, Loader2, Settings } from "lucide-react";
import { useState } from "react";
import { updateSellerProfile } from "@/app/actions/profile";
import { toast } from "sonner";
import BecomeSeller from "@/FunComponents/Modals/BecomeSellerModal";

interface StoreInfo {
  store_name: string;
  store_bio: string;
}

export default function StoreSettingTab({
  storeInfo,
  isSeller,
  activeListingsCount,
}: {
  storeInfo: StoreInfo | null | undefined;
  isSeller: boolean;
  activeListingsCount: number;
}) {
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(storeInfo?.store_name || "");
  const [bio, setBio] = useState(storeInfo?.store_bio || "");

  if (!isSeller) {
    return (
      <div className="border border-dashed border-border/80 rounded-[2rem] p-10 sm:p-12 text-center bg-muted/20 flex flex-col items-center justify-center gap-4">
        <div className="p-4 rounded-full bg-primary/10 text-primary">
          <Settings size={28} />
        </div>
        <div>
          <h3 className="text-lg font-black text-foreground">Become a Seller</h3>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-sm leading-normal">
            Activate your seller profile to start listing your premium items for auction and manage bids in real time.
          </p>
        </div>
        <div className="mt-2">
          <BecomeSeller />
        </div>
      </div>
    );
  }

  async function handleSave() {
    if (edit) {
      setSaving(true);
      const toastId = toast.loading("Saving store settings...");
      try {
        await updateSellerProfile(name, bio);
        toast.success("Settings saved successfully!", { id: toastId });
        setEdit(false);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Failed to save settings";
        toast.error(errMsg, { id: toastId });
      } finally {
        setSaving(false);
      }
    } else {
      setEdit(true);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-black text-foreground">Store Settings</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Manage your public seller store profile</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:bg-muted text-xs font-black uppercase tracking-wider text-foreground hover:text-primary hover:border-primary/20 transition-all duration-200 outline-none shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : edit ? (
            <Save size={14} />
          ) : (
            <Pencil size={14} />
          )}
          {saving ? "Saving..." : edit ? "Save" : "Edit Info"}
        </button>
      </div>

      {/* Store Info */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-center min-h-[100px]">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2 block">
            Store Name
          </span>
          {edit ? (
            <input
              className="w-full border border-border focus:border-primary bg-muted/40 rounded-xl p-3 text-sm focus-visible:ring-primary/40 focus-visible:ring-2 outline-none transition-all shadow-inner text-foreground font-semibold"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p className="text-base font-bold text-foreground">{storeInfo?.store_name || "Unnamed Store"}</p>
          )}
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-center min-h-[100px]">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2 block">
            Active Listings
          </span>
          <p className="text-2xl font-black text-foreground">{activeListingsCount}</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-3 block">
          Store Description
        </span>

        {edit ? (
          <textarea
            className="w-full border border-border focus:border-primary bg-muted/40 rounded-xl p-3.5 text-sm focus-visible:ring-primary/40 focus-visible:ring-2 outline-none transition-all shadow-inner resize-none leading-relaxed text-foreground font-medium"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            {storeInfo?.store_bio || "No description provided. Add a description to tell buyers about your collection."}
          </p>
        )}
      </div>
    </div>
  );
}
