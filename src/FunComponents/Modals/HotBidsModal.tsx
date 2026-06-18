"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import { PICSUM } from "@/lib/constants/images";

const slides = [
  {
    bg: "#8b5a3c",
    accent: "#9a6a4a",
    price: "$6,367.00",
    title: "Apex Automotive Excellence New Heights.",
  },
  {
    bg: "#2f4f4f",
    accent: "#3f6f6f",
    price: "$8,920.00",
    title: "Rare Collectibles That Define Prestige.",
  },
  {
    bg: "#4b3621",
    accent: "#6b4a2f",
    price: "$5,480.00",
    title: "Timeless Artifacts From Historic Eras.",
  },
];

const textItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const imageVariant: Variants = {
  hidden: { opacity: 0, x: 80, scale: 0.9 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

export default function HotBidsModal() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
    api.on("select", () => {
      setActiveIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Carousel opts={{ loop: true }} setApi={setApi} className="relative">
        <CarouselContent>
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <CarouselItem key={index}>
                <div
                  className="relative overflow-hidden rounded-[28px] text-primary-foreground min-h-[300px] lg:min-h-[480px]"
                  style={{ backgroundColor: slide.bg }}
                >
                  {/* HOT BADGE */}
                  <div className="absolute top-0 left-1/2  -translate-x-1/2 z-10">
                    <div className="bg-primary  h-8 sm:h-20 w-20 rounded-b-3xl flex items-center justify-center text-xs font-extrabold tracking-wide">
                      HOT
                      NOW
                    </div>
                  </div>

                  <div className="grid grid-cols-1 mt-2 lg:grid-cols-2 h-full items-center">
                    {/* TEXT */}
                    <div className="p-8 sm:p-12 lg:p-20 space-y-8 text-center lg:text-left">
                      <motion.div
                        variants={textItem}
                        initial="hidden"
                        animate={isActive ? "show" : "hidden"}
                      >
                        <p className="text-xs sm:text-sm text-primary-foreground/70 mb-2">
                          Starting bid
                        </p>
                        <h2 className="text-4xl sm:text-5xl font-extrabold">
                          {slide.price}
                        </h2>
                      </motion.div>

                      <motion.h1
                        variants={textItem}
                        initial="hidden"
                        animate={isActive ? "show" : "hidden"}
                        className="text-2xl sm:text-3xl line-clamp-2 lg:text-5xl font-bold max-w-lg leading-tight mx-auto lg:mx-0"
                      >
                        {slide.title}
                      </motion.h1>

                      <motion.div
                        variants={textItem}
                        initial="hidden"
                        animate={isActive ? "show" : "hidden"}
                      >
                        <Button className="mt-2 px-8 py-6 text-lg font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90">
                          Bid Now
                        </Button>
                      </motion.div>
                    </div>

                    {/* IMAGE — DESKTOP ONLY */}
                    <motion.div
                      variants={imageVariant}
                      initial="hidden"
                      animate={isActive ? "show" : "hidden"}
                      className="relative hidden lg:flex items-center justify-center p-16"
                    >
                      <div
                        className="absolute w-130 h-130 rounded-full -right-30"
                        style={{ backgroundColor: slide.accent }}
                      />

                      <div className="relative z-10 w-105 h-105 rounded-full overflow-hidden">
                        <Image
                          src={PICSUM.featuredSculpture}
                          alt="Auction Item"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="left-4 sm:left-6" />
        <CarouselNext className="right-4 sm:right-6" />
      </Carousel>
    </section>
  );
}
