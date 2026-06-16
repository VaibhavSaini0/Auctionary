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
    transition: { duration: 1, ease: "easeOut" },
  },
};

const imageVariant: Variants = {
  hidden: { opacity: 0, x: 80, scale: 0.9 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
};

export default function FeaturedAuctionCarousel() {
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
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Carousel opts={{ loop: true }} setApi={setApi} className="relative">
        <CarouselContent>
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <CarouselItem key={index}>
                <div
                  className="relative overflow-hidden rounded-[28px] text-primary-foreground"
                  style={{ backgroundColor: slide.bg }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-primary h-20 w-18 flex flex-col justify-center items-center text-sm font-semibold px-4 py-2 rounded-b-[32px]">
                      <p>HOT</p>
                      <p>NOW</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
                    <div className="p-10 lg:p-16 space-y-6">
                      <motion.div
                        variants={textItem}
                        initial="hidden"
                        animate={isActive ? "show" : "hidden"}
                      >
                        <p className="text-sm text-primary-foreground/70 mb-1">
                          Starting bid:
                        </p>
                        <h2 className="text-4xl font-semibold">
                          {slide.price}
                        </h2>
                      </motion.div>

                      <motion.h1
                        variants={textItem}
                        initial="hidden"
                        animate={isActive ? "show" : "hidden"}
                        className="text-3xl lg:text-4xl font-semibold max-w-md"
                      >
                        {slide.title}
                      </motion.h1>

                      <motion.div
                        variants={textItem}
                        initial="hidden"
                        animate={isActive ? "show" : "hidden"}
                      >
                        <Button className="mt-6 px-8 py-6 text-lg font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                          Bid Now
                        </Button>
                      </motion.div>
                    </div>

                    <motion.div
                      variants={imageVariant}
                      initial="hidden"
                      animate={isActive ? "show" : "hidden"}
                      className="relative flex items-center justify-center p-10"
                    >
                      <div
                        className="absolute w-175 h-125 -right-26 rounded-l-full"
                        style={{ backgroundColor: slide.accent }}
                      />
                      <Image
                        src="https://images.unsplash.com/photo-1600180758890-6b94519a8ba6"
                        alt="Antique Sculpture"
                        width={420}
                        height={420}
                        className="relative z-10"
                      />
                    </motion.div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="left-6 bg-card border-border text-foreground hover:bg-muted" />
        <CarouselNext className="right-6 bg-card border-border text-foreground hover:bg-muted" />
      </Carousel>
    </section>
  );
}
