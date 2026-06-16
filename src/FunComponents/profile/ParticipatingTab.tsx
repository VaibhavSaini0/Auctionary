import BidsAccordionList from "./BidsAccordionList";
import { Suspense } from "react";

interface ParticipatingTabProps {
  myBids: any[];
}

export default function ParticipatingTab({ myBids }: ParticipatingTabProps) {
  const groupedBids: Record<number, any> = {};

  myBids?.forEach((bid: any) => {
    if (!bid.auction_items) return;

    const auctionId = bid.auction_items.id;
    if (!groupedBids[auctionId]) {
      groupedBids[auctionId] = {
        auction: bid.auction_items,
        bids: [],
      };
    }
    groupedBids[auctionId].bids.push({
      amount: bid.amount,
      created_at: bid.created_at,
    });
  });

  const auctionList = Object.values(groupedBids);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            My Bidding Activity
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Track auctions where you have active bids.
          </p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-semibold uppercase">
          {auctionList.length} Items Joined
        </div>
      </div>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-muted/40">
            <p className="text-sm font-medium text-muted-foreground italic">
              You haven’t placed any bids yet. Explore auctions to get started!
            </p>
          </div>
        }
      >
        <BidsAccordionList auctions={auctionList} />
      </Suspense>
    </div>
  );
}
