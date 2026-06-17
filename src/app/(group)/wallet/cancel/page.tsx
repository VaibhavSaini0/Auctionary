import { XCircle, ArrowRight, CornerUpLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center py-20 px-6 overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-destructive/5 blur-[100px] pointer-events-none" />
      
      <div className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-in zoom-in duration-300">
        
        {/* Cancel Icon */}
        <div className="mx-auto h-20 w-20 rounded-full bg-destructive/15 flex items-center justify-center border border-destructive/30">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>

        {/* Text Header */}
        <div className="space-y-2">
          <span className="text-[10px] tracking-widest px-3.5 py-1.5 rounded-full bg-destructive/10 text-destructive font-black uppercase">
            Checkout Cancelled
          </span>
          <h1 className="text-3xl font-black text-foreground tracking-tight leading-tight pt-2">
            Payment Cancelled
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed font-medium">
            Your transaction was cancelled, and no charges were made. You can try adding funds again anytime.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex flex-col gap-3">
          <Link href="/profile" className="contents">
            <button className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer">
              Try Again
              <ArrowRight size={14} className="ml-1" />
            </button>
          </Link>
          <Link href="/" className="contents">
            <button className="w-full py-4 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer">
              <CornerUpLeft size={14} />
              Return Home
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
