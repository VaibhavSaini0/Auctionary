"use client";

import Image from "next/image";
import { useState } from "react";
import { Search } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants/images";

export default function ProductGallery({ auction }: any) {
  const [imgSrc, setImgSrc] = useState(auction.image_url || PLACEHOLDER_IMAGE);

  return (
    <div className="relative bg-background w-full h-fit p-5 flex items-center justify-center border border-border rounded-2xl overflow-hidden">
      <div className="absolute top-4 right-4 z-10 w-fit h-fit bg-card text-card-foreground p-2 rounded-full shadow border border-border hover:bg-muted transition">
        <Search size={18} />
      </div>

      <Image
        src={imgSrc}
        alt={auction.title}
        width={520}
        height={520}
        onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
        className="object-contain"
      />
    </div>
  );
}
