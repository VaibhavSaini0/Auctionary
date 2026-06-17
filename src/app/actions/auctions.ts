"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

import { z } from "zod";

const createAuctionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  starting_bid: z.coerce.number().positive("Starting bid must be a positive number"),
  starts_at: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
  ends_at: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid end date"),
  category: z.coerce.number().int().positive("Category is required"),
  image_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export async function createAuctionAction(data: any) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verify user role is "seller"
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError || profile?.role !== "seller") {
      throw new Error("Only users with the seller role can create auctions.");
    }

    // Validate inputs
    const parsedData = createAuctionSchema.parse({
      title: data.title,
      description: data.description,
      starting_bid: data.starting_bid,
      starts_at: data.starts_at,
      ends_at: data.ends_at,
      category: data.category,
      image_url: data.image_url,
    });

    const now = new Date();
    const startsAtDate = new Date(parsedData.starts_at);
    const endsAtDate = new Date(parsedData.ends_at);

    if (endsAtDate <= startsAtDate) {
      throw new Error("End date must be after start date.");
    }
    if (endsAtDate <= now) {
      throw new Error("End date must be in the future.");
    }

    const calculatedStatus = startsAtDate > now ? "Scheduled" : "Live";

    const { error } = await supabase.from("auction_items").insert({
      title: parsedData.title,
      description: parsedData.description,
      starting_bid: parsedData.starting_bid,
      current_bid: parsedData.starting_bid, // Initial current bid is the starting bid
      status: calculatedStatus,
      starts_at: parsedData.starts_at,
      ends_at: parsedData.ends_at,
      image_url: parsedData.image_url,
      category_id: parsedData.category,
      seller_id: userId,
    });

    if (error) {
      console.error("SUPABASE ERROR:", error);
      throw new Error(error.message);
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (err: any) {
    console.error("CREATE AUCTION ERROR:", err.message);
    throw new Error(err.message || "Failed to create auction");
  }
}

export async function buyNowAction(auctionId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // 1. Fetch auction item details
    const { data: auction, error: auctionError } = await supabase
      .from("auction_items")
      .select("*")
      .eq("id", auctionId)
      .single();

    if (auctionError || !auction) {
      throw new Error("Auction not found.");
    }

    if (auction.status !== "Live" || auction.bought_by) {
      throw new Error("Auction is no longer active.");
    }

    if (!auction.buy_now_price) {
      throw new Error("This item does not have a Buy Now price.");
    }

    if (auction.seller_id === userId) {
      throw new Error("Sellers cannot buy their own items.");
    }

    const price = Number(auction.buy_now_price);

    // 2. Fetch buyer's wallet balance
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("current_balance")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      throw new Error("Failed to retrieve user profile.");
    }

    const currentBalance = Number(profile.current_balance || 0);

    if (currentBalance < price) {
      throw new Error("Insufficient wallet balance to buy now.");
    }

    // 3. Deduct wallet balance from buyer
    const { error: deductError } = await supabase
      .from("profiles")
      .update({ current_balance: currentBalance - price })
      .eq("id", userId);

    if (deductError) {
      throw new Error("Failed to process payment from wallet.");
    }

    // 4. Update auction item status
    const { error: updateError } = await supabase
      .from("auction_items")
      .update({
        status: "Ended",
        bought_by: userId,
        current_bid: price, // Set current bid to the buy now price
      })
      .eq("id", auctionId);

    if (updateError) {
      // Rollback payment
      await supabase
        .from("profiles")
        .update({ current_balance: currentBalance })
        .eq("id", userId);
      throw new Error("Failed to complete purchase.");
    }

    // 5. Create order record
    const { error: orderError } = await supabase.from("orders").insert({
      buyer_id: userId,
      auction_item_id: auctionId,
      order_amount: price,
      payment_method: "Wallet",
      status: "Processing",
    });

    if (orderError) {
      console.error("ORDER CREATION ERROR:", orderError);
    }

    // 6. Create notification for buyer and seller
    await supabase.from("notifications").insert([
      {
        user_id: userId,
        title: "Purchase Successful!",
        message: `You bought "${auction.title}" instantly for ₹${price.toLocaleString()}.`,
        link: `/product/${auctionId}`,
        type: "system",
        is_read: false,
      },
      {
        user_id: auction.seller_id,
        title: "Item Sold Instantly!",
        message: `Your item "${auction.title}" was purchased instantly for ₹${price.toLocaleString()}.`,
        link: `/product/${auctionId}`,
        type: "system",
        is_read: false,
      }
    ]);

    revalidatePath("/profile");
    revalidatePath(`/product/${auctionId}`);

    return { success: true };
  } catch (err: any) {
    console.error("BUY NOW ERROR:", err.message);
    throw new Error(err.message || "Failed to complete checkout");
  }
}