"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
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

export async function syncClerkProfileToDatabase(
  clerkUserId: string,
  data: {
    full_name: string | null;
    email: string | undefined;
    avatar_url: string;
  }
) {
  const user = await currentUser();
  if (!user || user.id !== clerkUserId) {
    return { success: false as const, reason: "not_authenticated" as const };
  }

  const { error } = await supabaseAdmin.from("profiles").upsert({
    id: user.id,
    full_name: data.full_name,
    email: data.email,
    avatar_url: data.avatar_url,
  });

  if (error) {
    console.error("Failed to sync profile:", error);
    return { success: false as const, reason: "database_error" as const };
  }

  return { success: true as const };
}
