"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function updateSellerProfile(storeName: string, storeBio: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be logged in to perform this action");
  }

  const { error } = await supabaseAdmin
    .from("seller_profiles")
    .update({
      store_name: storeName,
      store_bio: storeBio,
    })
    .eq("id", userId);

  if (error) {
    console.error("Failed to update seller profile:", error);
    throw new Error(error.message || "Failed to update profile");
  }

  revalidatePath("/profile");
  return { success: true };
}
