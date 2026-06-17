"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, ArrowDownRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import ItemsRow from "@/FunComponents/ItemsRow";
import HotBidsModal from "@/FunComponents/Modals/HotBidsModal";
import FaqSection from "@/FunComponents/FaqSection";
import TestimonialSection from "@/FunComponents/TestimonialSection";
import HowToBid from "@/FunComponents/HowToBid";
import FeaturedHighlights from "@/FunComponents/FeaturedHighlights";
import InsightsFromAuctions from "@/FunComponents/InsightsFromAuctions";
import AuctionByCategory from "@/FunComponents/AuctionByCategory";
import HomeAuctionIntro from "@/FunComponents/HomeAuctionIntro";

const textContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 18,
    },
  },
};

const imageContainer: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
      staggerChildren: 0.15,
    },
  },
};

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <section
        className="max-w-[1400px] mx-auto mt-6 rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden relative border border-white/10"
        style={{
          background: "radial-gradient(circle at 10% 20%, rgb(84, 110, 71) 0%, rgb(50, 70, 40) 50%, rgb(30, 45, 22) 100%)",
        }}
      >
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-orange-400/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-white/5 blur-[80px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center p-6 md:p-12 lg:p-16 relative z-10">
          <motion.div
            className="w-full lg:w-1/2 text-white relative"
            variants={textContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {/* Social handles with glassmorphic dock */}
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col space-y-6 bg-white/5 backdrop-blur-md px-3 py-6 rounded-full border border-white/10 shadow-lg shadow-black/10">
              <Facebook className="w-4 h-4 cursor-pointer hover:text-orange-400 hover:scale-125 transition-all duration-300" />
              <Twitter className="w-4 h-4 cursor-pointer hover:text-orange-400 hover:scale-125 transition-all duration-300" />
              <Instagram className="w-4 h-4 cursor-pointer hover:text-orange-400 hover:scale-125 transition-all duration-300" />
            </div>

            <div className="lg:pl-8">
              <motion.span
                className="inline-block text-xs font-black tracking-[0.25em] text-orange-400 uppercase mb-4"
                variants={textItem}
              >
                ✦ Premium Live Auctions
              </motion.span>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-[1.15] tracking-tight"
                variants={textItem}
              >
                Select{" "}
                <span className="italic font-serif font-light text-orange-400 relative">
                  Our Product
                  <span className="absolute bottom-1 left-0 w-full h-[3px] bg-orange-400/40 rounded-full" />
                </span>{" "}
                <br />
                At Our Auction.
              </motion.h1>

              <motion.p
                className="text-sm sm:text-base md:text-lg mb-10 text-white/80 max-w-lg leading-relaxed font-medium"
                variants={textItem}
              >
                Join us as we carve a path to success, driven by passion,
                powered by innovation, and we&apos;re here to turn your dreams into
                reality.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-16"
                variants={textItem}
              >
                <Link href="/auction-products" className="contents">
                  <Button
                    className="px-8 py-7 text-lg font-bold rounded-full transition-all hover:scale-105 active:scale-95 flex gap-2 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer w-full sm:w-auto"
                    style={{
                      backgroundColor: "rgb(238, 126, 68)",
                      color: "white",
                    }}
                  >
                    Start A Bid <ArrowDownRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>

                <Link href="/auction-products" className="contents">
                  <Button
                    variant="outline"
                    className="px-8 py-7 text-lg font-bold rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white transition-all hover:scale-105 active:scale-95 cursor-pointer w-full sm:w-auto"
                  >
                    View All Auction
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                className="pt-8 border-t border-white/10"
                variants={textItem}
              >
                <p className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-white/40">
                  Trusted Partners :
                </p>
                <div className="flex flex-wrap items-center gap-6 md:gap-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer">
                  <span className="text-xl font-black tracking-tighter italic hover:text-orange-400 transition-colors">
                    OTIVAR°
                  </span>
                  <span className="text-xl font-black tracking-widest hover:text-orange-400 transition-colors">
                    KAON
                  </span>
                  <span className="text-xl font-black tracking-tighter italic hover:text-orange-400 transition-colors">
                    archzilla°
                  </span>
                  <span className="text-xl font-black hover:text-orange-400 transition-colors">PARK PLACE</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="w-full lg:w-1/2 mt-12 lg:mt-0 grid grid-cols-2 gap-4 h-80 md:h-125"
            variants={imageContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div
              variants={textItem}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="col-span-1 h-full relative group overflow-hidden rounded-tl-[60px] md:rounded-tl-[80px] rounded-br-[32px] shadow-2xl"
            >
              <img
                src="https://i.pinimg.com/564x/e5/95/39/e59539e01b53c00e6fed854db2779af8.jpg"
                alt="Antique Tea Set"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 cursor-pointer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-xs font-bold tracking-widest uppercase text-white/90">✦ Collector Tea Set</span>
              </div>
            </motion.div>

            <div className="col-span-1 flex flex-col gap-4 h-full">
              <motion.div
                variants={textItem}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="h-1/2 relative group overflow-hidden rounded-2xl rounded-tr-[32px] md:rounded-tr-[40px] shadow-xl"
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXFD8iTCcximIgcJPVRDrXBaJpXcNlL-n3XQ&s"
                  alt="Copper Ewer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 cursor-pointer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">✦ Copper Ewer</span>
                </div>
              </motion.div>
              
              <motion.div
                variants={textItem}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="h-1/2 relative group overflow-hidden rounded-2xl rounded-br-[60px] md:rounded-br-[80px] shadow-xl border border-white/10"
              >
                <img
                  src="https://m.media-amazon.com/images/I/61v9YPhuv-L._AC_UF894,1000_QL80_.jpg"
                  alt="Vase"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 cursor-pointer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">✦ Celadon Vase</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="space-y-10 py-15">
        <HomeAuctionIntro/>
        <ItemsRow />
        <HotBidsModal />
        <AuctionByCategory />
        <HowToBid />
        <FaqSection />
        <TestimonialSection />
        <FeaturedHighlights />
        <InsightsFromAuctions />
      </main>
    </div>
  );
}
