"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is the entry fee?",
    a: "The tournament is completely free to enter. No registration fee required!",
  },
  {
    q: "How many players per team?",
    a: "Minimum 3 players, maximum 4 players per team. You must have at least 3 players to participate.",
  },
  {
    q: "Can teams from outside IAR / other schools participate?",
    a: "Absolutely! Outside school and college teams are welcome to participate. This tournament is open to everyone.",
  },
  {
    q: "What device can I use?",
    a: "Only mobile phones are allowed. No emulators (BlueStacks, GameLoop etc.), no tablets with keyboard/mouse, and no external controllers. Bring your own fully charged device.",
  },
  {
    q: "What if I don't have a team?",
    a: "No worries! Contact our Gaming Head Hemang at +91 78599 37175 (WhatsApp) and he'll help set you up with a team looking for members.",
  },
  {
    q: "What is the prize?",
    a: "The winning team takes home 15,000 Free Fire MAX Diamonds. One prize pool, no split — winner takes all!",
  },
  {
    q: "Where is the venue?",
    a: "IAR Main Campus, A3 Building. Doors open at 8:45 AM. Be there before 9:15 AM for check-in.",
  },
  {
    q: "What should I bring?",
    a: "Your mobile phone (fully charged), charger/power bank, AND your official school/college ID card. No ID = No entry!",
  },
  {
    q: "What game mode will be played?",
    a: "All matches will be played in Free Fire MAX — Battle Royale Squad mode. Detailed match settings will be briefed on event day.",
  },
  {
    q: "Who needs to register?",
    a: "Only the Team Leader needs to fill out the registration form. Make sure to provide accurate details for all team members.",
  },
  {
    q: "Will there be internet provided?",
    a: "Wi-Fi may be available, but it's not guaranteed for gaming. We strongly recommend bringing your own mobile data.",
  },
  {
    q: "What happens if my team is late?",
    a: "Teams that are not checked in by 9:15 AM sharp may forfeit their spot. Arrive early — doors open at 8:45 AM.",
  },
];

function FAQItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="border border-white/10 rounded-xl overflow-hidden hover:border-ff-orange/20 transition-colors"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-white font-medium text-sm sm:text-base pr-4">{faq.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-ff-orange shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-white/50 text-sm leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="relative py-20 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ff-orange/30 to-transparent" />

      <div ref={ref} className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
            <span className="text-white">Got </span>
            <span className="bg-gradient-to-r from-ff-orange to-ff-yellow bg-clip-text text-transparent">
              Questions?
            </span>
          </h2>
          <p className="text-white/40 mt-4 text-sm sm:text-base">
            Everything you need to know before the showdown
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
