"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Package, Clock, ExternalLink, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OrdersTab({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            auction_items (
              title,
              image_url,
              status
            )
          `)
          .eq("buyer_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase Error:", error.message);
        } else {
          setOrders(data || []);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchOrders();
  }, [userId]);

  if (loading) return <div className="p-10 text-center animate-pulse text-gray-400">Loading your orders...</div>;

  return (
    <div className="space-y-4 pt-4">
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-[2rem] border border-dashed border-border/80 gap-3">
          <div className="p-3.5 rounded-2xl bg-muted/50 text-muted-foreground/60">
            <Package size={28} />
          </div>
          <p className="text-sm font-bold text-foreground">No orders found</p>
          <p className="text-xs text-muted-foreground max-w-xs leading-normal">Items you win in live auctions will appear here once checkout is processed.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div 
            key={order.id} 
            className="flex flex-col md:flex-row items-center gap-6 p-5 bg-card rounded-[2rem] border border-border hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 group"
          >
            {/* Item Image */}
            <div className="relative w-full md:w-32 h-32 rounded-2xl overflow-hidden bg-muted border border-border/60 flex-shrink-0">
              <Image
                src={order.auction_items?.image_url || "/placeholder.png"}
                alt={order.auction_items?.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Order Details */}
            <div className="flex-1 w-full">
              <div className="flex justify-between items-start gap-4 mb-2">
                <div>
                  <h4 className="text-base font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                    {order.auction_items?.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
                    Order ID: <span className="font-mono text-foreground/80">{order.id.slice(0, 8)}...</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-black text-foreground">₹{order.order_amount.toLocaleString()}</p>
                  <p className="text-[9px] text-emerald-500 font-black uppercase tracking-wider mt-0.5">Paid via {order.payment_method}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                  <CheckCircle2 size={12} />
                  <span className="text-[9px] font-black uppercase tracking-wider">{order.status}</span>
                </div>
                
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded-full border border-border">
                  <Clock size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="w-full md:w-auto shrink-0 flex justify-end">
              <Link href={`/product/${order.auction_item_id}`} target="_blank" rel="noopener noreferrer"
               className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/20 hover:scale-105 active:scale-95 cursor-pointer">
                <ExternalLink size={16} />
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}