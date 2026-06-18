"use client";

import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        {/* Big 404 */}
        <h1 className="text-7xl font-extrabold text-primary mb-4">404</h1>

        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Page Not Found
        </h2>

        <p className="text-muted-foreground mb-8">
          Oops! The page you are looking for doesn’t exist or may have been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
          >
            <Home size={18} />
            Go Home
          </Link>

          <Link
            href="/auction-products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground hover:bg-muted transition"
          >
            <Search size={18} />
            Browse Auctions
          </Link>
        </div>
      </div>
    </div>
  );
}
