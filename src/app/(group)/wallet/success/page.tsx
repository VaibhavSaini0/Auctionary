import { CheckCircle2, ArrowRight, Wallet } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center py-20 px-6 overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
      
      <div className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-in zoom-in duration-300">
        
        {/* Success Icon */}
        <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30 animate-bounce">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>

        {/* Text Header */}
        <div className="space-y-2">
          <span className="text-[10px] tracking-widest px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 font-black uppercase">
            Payment Completed
          </span>
          <h1 className="text-3xl font-black text-foreground tracking-tight leading-tight pt-2">
            Top-up Successful!
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed font-medium">
            Your wallet balance has been successfully credited. You can now resume live bidding.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link href="/profile" className="contents">
            <button className="w-full py-4.5 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer">
              <Wallet size={16} />
              View Wallet
              <ArrowRight size={14} className="ml-1" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
