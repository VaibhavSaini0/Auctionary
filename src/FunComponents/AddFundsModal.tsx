"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  Wallet,
  CreditCard,
  ShieldCheck,
  IndianRupee,
  X,
} from "lucide-react";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export default function AddFundsModal() {
  const [amount, setAmount] = useState<number>(500);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { userId } = useAuth();

  const handleAddFunds = async () => {
    if (!amount || amount < 100) {
      toast.error("Minimum top-up amount is ₹100");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-stripe-session",
        {
          body: { amount, userId },
        }
      );

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err: any) {
      console.error("Payment Error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* TRIGGER */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 rounded-full border-primary border-2 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-black uppercase tracking-wider hover:opacity-90 transition"
      >
        + Add Funds
      </button>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-[2.75rem] bg-background p-8 shadow-2xl border border-border">
            {/* CLOSE */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition"
            >
              <X size={22} />
            </button>

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Wallet className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-foreground">
                  Wallet Top-Up
                </h2>
                <p className="text-sm text-muted-foreground">
                  Add balance to place bids instantly
                </p>
              </div>
            </div>

            {/* AMOUNT INPUT */}
            <div className="space-y-4">
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-5 rounded-2xl bg-muted border-2 border-transparent focus:border-primary outline-none text-2xl font-black"
                />
              </div>

              {/* QUICK SELECT */}
              <div className="flex flex-wrap gap-3">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition ${
                      amount === amt
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* PAY BUTTON */}
            <button
              onClick={handleAddFunds}
              disabled={loading}
              className="w-full mt-8 py-5 rounded-2xl bg-primary text-primary-foreground font-black text-lg flex items-center justify-center gap-3 hover:opacity-90 transition disabled:opacity-60"
            >
              <CreditCard />
              {loading ? "Redirecting…" : `Pay ₹${amount.toLocaleString()}`}
            </button>

            {/* TRUST INFO */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck size={14} className="text-primary" />
              Secure payment powered by Stripe
            </div>
          </div>
        </div>
      )}
    </>
  );
}
