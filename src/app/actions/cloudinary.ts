"use server";
import { v2 as cloudinary } from "cloudinary";

import { auth } from "@clerk/nextjs/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be logged in to upload files.");
  }

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided.");
  }

  // Validate MIME type (images only)
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size must be less than 5MB.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "auctions" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || "");
      }
    ).end(buffer);
  });
}