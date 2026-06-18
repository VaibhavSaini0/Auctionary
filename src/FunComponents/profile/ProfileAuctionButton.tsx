"use client";

import AddAuctionModal from "@/FunComponents/Modals/AddAuctionModal";

export default function ProfileAuctionButton({
  isSeller,
  userId,
}: {
  isSeller: boolean;
  userId: string;
}) {
  if (!isSeller) return null;

  return <AddAuctionModal userId={userId} />;
}
