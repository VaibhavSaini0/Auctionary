import { Suspense } from "react";
import AuctionGridContent from "./AuctionGrid";

export default function Page() {
  return (
    <Suspense fallback={<AuctionGridSkeleton />}>
      <AuctionGridContent />
    </Suspense>
  );
}

function AuctionGridSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-16">
      <div className="h-8 w-48 bg-muted rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-64 bg-muted rounded-xl animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
