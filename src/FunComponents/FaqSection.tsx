"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    id: "01",
    question: "What is an auction?",
    answer:
      "Auctions allow items to be sold to the highest bidder. Participants bid on the item until the highest bid is reached within a set timeframe. The highest bidder wins and pays the bid amount.",
  },
  {
    id: "02",
    question: "How do auctions work?",
    answer:
      "Bidders place increasing offers on items. When the auction ends, the highest bid wins and completes the purchase.",
  },
  {
    id: "03",
    question: "What types of auctions are there?",
    answer:
      "There are live auctions, online auctions, silent auctions, reserve auctions, and no-reserve auctions.",
  },
  {
    id: "04",
    question: "Who can participate in auctions?",
    answer:
      "Anyone who meets the auction requirements and agrees to the terms can participate.",
  },
  {
    id: "05",
    question: "What happens if I win an auction?",
    answer:
      "You’ll be notified and required to complete payment and shipping details within the given timeframe.",
  },
  {
    id: "06",
    question: "Can I sell items at auctions?",
    answer:
      "Yes, sellers can list their items by registering and submitting item details for approval.",
  },
  {
    id: "07",
    question: "What are some tips for successful auction?",
    answer:
      "Research items, set a budget, bid strategically, and understand auction rules.",
  },
  {
    id: "08",
    question: "Are there risks associated buying at auctions?",
    answer:
      "Yes, risks include limited inspection, competition-driven pricing, and non-refundable bids.",
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="relative bg-muted/40 py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-xs tracking-widest px-4 py-1 rounded-full border border-border bg-card text-muted-foreground font-semibold mb-4">
            → QUESTION NOW
          </span>
          <h2 className="text-4xl lg:text-5xl font-semibold text-foreground">
            Frequently Asked{" "}
            <span className="text-muted-foreground font-normal">
              Questions
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <motion.div
                key={faq.id}
                layout
                className={`rounded-2xl border p-6 transition-all duration-300 shadow-sm cursor-pointer ${
                  isOpen
                    ? "bg-card border-primary shadow-md"
                    : "bg-card hover:bg-muted/40 border-border hover:border-primary/20"
                }`}
                onClick={() => toggle(faq.id)}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between text-left cursor-pointer outline-none"
                >
                  <span className={`font-bold text-base sm:text-lg transition-colors duration-300 ${
                    isOpen ? "text-primary" : "text-foreground"
                  }`}>
                    {faq.id}. {faq.question}
                  </span>

                  <motion.span
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      isOpen ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    }`}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isOpen ? (
                      <Minus size={16} />
                    ) : (
                      <Plus size={16} />
                    )}
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
