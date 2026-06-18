"use client";

import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageSquareQuote, Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    title: "Great Auction Product!",
    text: "Feel free to customize the key features based on the services and strategies you offer in each plan. This breakdown helps potential clients understand the specific value they'll receive at each pricing tier.",
    name: "Weston Bennett",
    role: "CEO at Triprex",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    title: "Excellent Experience!",
    text: "The platform is intuitive and the bidding process is smooth. I felt confident throughout the auction and the support team was extremely responsive.",
    name: "Emily Watson",
    role: "Art Collector",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    title: "Highly Recommended",
    text: "Auctionary helped me discover rare collectibles with ease. The UI is clean and the experience feels premium.",
    name: "Daniel Cooper",
    role: "Antique Dealer",
    avatar: "https://randomuser.me/api/portraits/men/56.jpg",
  },
];

const textVariants: Variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction: number) => ({
    y: direction > 0 ? -50 : 50,
    opacity: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function TestimonialSection() {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);

  const paginate = (dir: number) => {
    setIndex(([prev]) => [
      (prev + dir + testimonials.length) % testimonials.length,
      dir,
    ]);
  };

  const testimonial = testimonials[index];

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-24 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-orange-400/5 blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-block text-[10px] tracking-widest px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black mb-4">
            ✦ TESTIMONIALS
          </span>

          <div className="flex justify-between items-start">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-10 text-foreground tracking-tight">
              Praise from Our <span className="text-orange-500 font-light font-serif italic">Clients</span>
            </h2>
            <MessageSquareQuote size={48} className="text-primary/20 hover:text-primary transition-colors" />
          </div>

          <div className="min-h-[260px] p-8 rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={testimonial.id}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* 5-Star Rating Widget */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-orange-400 text-orange-400" />
                  ))}
                </div>

                <p className="text-primary font-bold text-lg mb-3">
                  &ldquo;{testimonial.title}&rdquo;
                </p>

                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base mb-8 max-w-xl">
                  {testimonial.text}
                </p>

                <div className="flex items-center gap-4 border-t border-border pt-6">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full border border-border"
                  />
                  <div>
                    <p className="font-bold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => paginate(-1)}
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => paginate(1)}
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Client overlapping avatar grid (Desktop & Tablet) */}
        <div className="relative w-full max-w-[500px] h-[450px] hidden md:block lg:ml-auto">
          {[
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
          ].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ scale: 1.1, zIndex: 40 }}
              className={`
                absolute w-[220px] h-[220px] rounded-full overflow-hidden border-4 border-background cursor-pointer shadow-xl transition-all duration-300
                ${i === 0 && "top-0 left-0 z-20"}
                ${i === 1 && "top-0 right-0 z-10"}
                ${i === 2 && "bottom-0 left-0 z-10"}
                ${i === 3 && "bottom-0 right-0 z-30"}
              `}
            >
              <Image src={img} alt="Client" fill sizes="220px" className="object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
