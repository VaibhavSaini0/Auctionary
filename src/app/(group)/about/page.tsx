"use client";

import Image from "next/image";
import { CheckCircle2, ShieldCheck, Sparkles, TrendingUp, Quote, Users, Hammer, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import TestimonialSection from "@/FunComponents/TestimonialSection";
import InsightsFromAuctions from "@/FunComponents/InsightsFromAuctions";
import FaqSection from "@/FunComponents/FaqSection";

export default function WhoWeAre() {
  return (
    <div className="w-full bg-background relative overflow-hidden">
      {/* Decorative gradient backdrops */}
      <div className="absolute top-24 left-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-[rgb(84,110,71)]/8 blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] right-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-orange-400/5 blur-[120px] sm:blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[15%] w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] rounded-full bg-[rgb(84,110,71)]/6 blur-[110px] sm:blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-24 sm:space-y-32">
        {/* Who We Are Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, type: "spring", stiffness: 60 }}
          >
            <span className="inline-block text-xs font-black tracking-[0.25em] text-orange-500 uppercase mb-4">
              ✦ Discover Our Legacy
            </span>
            <h2 className="text-4xl sm:text-5xl font-black mb-6 text-gray-900 tracking-tight leading-[1.15]">
              Who We{" "}
              <span className="italic font-serif font-light text-orange-500 relative">
                Are
                <span className="absolute bottom-1.5 left-0 w-full h-[3px] bg-orange-400/40 rounded-full animate-pulse" />
              </span>
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl text-base sm:text-lg">
              Welcome to <span className="font-semibold text-gray-900">Auctionary</span>, where the thrill of live bidding meets strategic transparency. We connect passionate collectors and eager buyers with rare, premium assets in a secure, digital auction house designed to make bidding simple, engaging, and premium.
            </p>

            <div className="space-y-4">
              <Feature
                icon={<Sparkles className="w-5 h-5 text-orange-500" />}
                title="Our Expert Solutions"
                text="Curated selections and dynamic real-time live bidding systems built for flawless transaction security."
              />
              <Feature
                icon={<ShieldCheck className="w-5 h-5 text-orange-500" />}
                title="Trusted Performance"
                text="Backed by verifiable digital records, strict escrow systems, and comprehensive seller validation."
              />
              <Feature
                icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
                title="Experience the Difference"
                text="Immersive bidding wars, automated proxy bids, and smooth notifications accessible across all devices."
              />
            </div>
          </motion.div>

          <motion.div
            className="relative h-[450px] sm:h-[550px] w-full flex items-center justify-center mt-8 lg:mt-0"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Background color glow frame wrapper */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[rgb(84,110,71)]/10 to-orange-400/10 rounded-[2.5rem] -rotate-3 scale-95 pointer-events-none" />

            {/* Main top/right image */}
            <motion.div
              className="absolute top-4 right-4 w-[65%] sm:w-[60%] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 group"
              whileHover={{ scale: 1.03, rotate: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1518770660439-4636190af475"
                alt="Tech & Innovation"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-w-768px) 100vw, 40vw"
              />
            </motion.div>

            {/* Secondary bottom/left floating image */}
            <motion.div
              className="absolute bottom-4 left-4 w-[55%] sm:w-[50%] aspect-video rounded-[1.5rem] overflow-hidden shadow-2xl bg-white p-2 border border-gray-100/50"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden group">
                <Image
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                  alt="Modern Workspace"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-w-768px) 100vw, 30vw"
                />
              </div>
            </motion.div>

            {/* Floating Live Bidder Badge */}
            <motion.div
              className="absolute top-1/2 -left-4 bg-white/90 backdrop-blur-md rounded-2xl px-5 py-4 shadow-lg border border-gray-100 flex items-center gap-3 cursor-default"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center relative shrink-0">
                <Users className="w-5 h-5 text-emerald-700" />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900 leading-none">
                  5.6k
                </p>
                <p className="text-[9px] uppercase tracking-widest font-black text-muted-foreground mt-0.5">
                  Active Bidders
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Get In Know Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-8">
          {/* Left Block Image Banner */}
          <motion.div
            className="relative rounded-[2.5rem] overflow-hidden shadow-2xl group border border-white/20 aspect-[4/3] sm:aspect-[16/10] order-last lg:order-first"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            whileHover={{ scale: 1.01 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1594731804071-48f479cbe508?auto=format&fit=crop&w=800"
              alt="Premium Auction Showroom"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-w-768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 sm:p-8">
              <div className="max-w-md">
                <span className="inline-block text-[10px] font-black tracking-[0.2em] text-orange-400 uppercase mb-2">
                  ✦ Global Consignments
                </span>
                <p className="text-white text-lg sm:text-xl font-bold leading-snug">
                  Appraise, register, and bid on authentic premium items backed by certificates of authenticity.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Block Details & Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, type: "spring", stiffness: 60 }}
          >
            <span className="inline-block text-xs font-black tracking-[0.25em] text-orange-500 uppercase mb-4">
              ✦ Seamless System Ecosystem
            </span>
            <h2 className="text-4xl sm:text-5xl font-black mb-6 text-gray-900 tracking-tight leading-[1.15]">
              Get In{" "}
              <span className="italic font-serif font-light text-orange-500 relative">
                Know
                <span className="absolute bottom-1.5 left-0 w-full h-[3px] bg-orange-400/40 rounded-full" />
              </span>
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl text-base sm:text-lg">
              Transparency forms the bedrock of our platform. From quick catalog appraisal to secure digital payment transactions and final logistics fulfillment, our bidding safeguards ensure complete protection.
            </p>

            {/* Checkmark lists styled inside cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                "Ready to boost your bidding edge",
                "Transform your collection listings",
                "Don’t miss out on verified insights",
                "See live results at the click of a button",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-3 bg-gray-50/50 hover:bg-orange-50/30 p-3.5 rounded-xl border border-gray-100 transition-all duration-300 group"
                  whileHover={{ x: 5, borderColor: "rgb(254, 215, 170)" }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <CheckCircle2 className="text-orange-500 w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                  <p className="text-sm font-semibold text-gray-700 leading-tight">{item}</p>
                </motion.div>
              ))}
            </div>

            {/* Statistics badges as Cards */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              <Stat value="3.5k" label="Customers" icon={<Users className="w-4 h-4 text-orange-500" />} />
              <Stat value="700k" label="Auctions" icon={<Hammer className="w-4 h-4 text-orange-500" />} />
              <Stat value="5.6k" label="Bidders" icon={<TrendingUp className="w-4 h-4 text-orange-500" />} />
            </div>

            <motion.button
              className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Auctions <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>
        </section>

        {/* Premium Styled Blockquote */}
        <motion.div
          className="max-w-4xl mx-auto bg-gradient-to-r from-[rgb(84,110,71)]/5 via-orange-400/5 to-[rgb(84,110,71)]/5 p-8 sm:p-12 rounded-[2rem] border border-gray-100 shadow-inner flex flex-col md:flex-row items-center gap-6 md:gap-10 relative overflow-hidden"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative quote icon background */}
          <div className="absolute -top-6 -left-6 text-orange-500/8 pointer-events-none">
            <Quote className="w-32 h-32 rotate-180" />
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 border-2 border-orange-500/20 relative shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1508685096489-7aac296839c6?auto=format&fit=crop&w=150"
              alt="Leslie Alexander"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-10 text-center md:text-left flex-1">
            <p className="italic text-gray-700 text-lg sm:text-xl font-medium leading-relaxed mb-4">
              “I work with Auctionary on many bids and consignment projects. They always exceed my expectations with their platform speed, secure escrow guarantees, and stellar customer service.”
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-2">
              <p className="font-extrabold text-gray-900 text-base">
                Leslie Alexander
              </p>
              <span className="hidden sm:inline text-gray-400">•</span>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">
                Verified Collector
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom widgets / layouts */}
      <TestimonialSection />
      <InsightsFromAuctions />
      <FaqSection />
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <motion.div
      className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-300 cursor-default group"
      whileHover={{ x: 6 }}
    >
      <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100/50 flex items-center justify-center shrink-0 shadow-sm transition-colors duration-300 group-hover:bg-orange-500 group-hover:border-orange-500 *:text-orange-500 group-hover:*:text-white">
        {icon}
      </div>
      <div>
        <h4 className="font-bold mb-1 text-gray-900 text-base">
          {title}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

function Stat({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <motion.div
      className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group relative overflow-hidden"
      whileHover={{ y: -6, scale: 1.02, borderColor: "rgb(251, 146, 60)" }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-125" />
      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mb-4 transition-colors group-hover:bg-orange-500 group-hover:*:text-white shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-orange-500 transition-colors leading-none">
          {value}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1.5 leading-none">
          {label}
        </p>
      </div>
    </motion.div>
  );
}
