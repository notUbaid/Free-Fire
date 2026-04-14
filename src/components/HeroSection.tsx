"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

/* ── live countdown ─────────────────────────────────── */
function Countdown() {
  const target = new Date("2026-04-18T09:00:00+05:30").getTime();

  const calc = () => {
    const d = Math.max(0, target - Date.now());
    return {
      d: Math.floor(d / 86_400_000),
      h: Math.floor((d % 86_400_000) / 3_600_000),
      m: Math.floor((d % 3_600_000) / 60_000),
      s: Math.floor((d % 60_000) / 1000),
    };
  };

  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-2.5 sm:gap-3">
        {["Days", "Hrs", "Min", "Sec"].map((l) => (
          <div key={l} className="text-center">
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-lg w-14 sm:w-[72px] py-2 sm:py-2.5">
              <span className="text-xl sm:text-3xl font-black text-white tabular-nums leading-none">--</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-white/30 uppercase tracking-widest mt-1 block">{l}</span>
          </div>
        ))}
      </div>
    );
  }

  const units = [
    { v: t.d, l: "Days" },
    { v: t.h, l: "Hrs" },
    { v: t.m, l: "Min" },
    { v: t.s, l: "Sec" },
  ];

  return (
    <div className="flex gap-2.5 sm:gap-3">
      {units.map((u) => (
        <div key={u.l} className="text-center">
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-lg w-14 sm:w-[72px] py-2 sm:py-2.5">
            <span className="text-xl sm:text-3xl font-black text-white tabular-nums leading-none">
              {String(u.v).padStart(2, "0")}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-white/30 uppercase tracking-widest mt-1 block">
            {u.l}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── hero ───────────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          src="/images/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ff-darker via-transparent to-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ff-darker to-transparent" />
        {/* Glow effects */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-ff-orange/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.12, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ff-red/10 rounded-full blur-[100px]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 w-full max-w-3xl mx-auto pt-20 pb-16">
        {/* Logos */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex items-center gap-3 mb-6 sm:mb-8"
        >
          <Image
            src="/images/csgc-logo.png"
            alt="CSGC"
            width={40}
            height={40}
            className="rounded-full border border-white/10"
          />
          <span className="text-white/20 text-lg font-light select-none">/</span>
          <Image
            src="/images/iar-logo.png"
            alt="IAR"
            width={40}
            height={40}
            className="rounded-full border border-white/10"
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <p className="text-white/40 text-xs sm:text-sm font-medium tracking-[0.3em] uppercase mb-2">
            CSGC Presents
          </p>
          <p className="text-white/50 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-1">
            Ultimate
          </p>
          <h1 className="text-[2.8rem] sm:text-6xl md:text-7xl font-black leading-[0.9] tracking-tight text-white">
            FREE&nbsp;FIRE
          </h1>
          <h1 className="text-[3.2rem] sm:text-7xl md:text-8xl font-black leading-[0.85] tracking-tight bg-gradient-to-r from-ff-orange via-ff-yellow to-ff-red bg-clip-text text-transparent">
            MAX
          </h1>
          <p className="text-white/60 text-lg sm:text-xl font-bold tracking-widest uppercase mt-2">
            Tournament
          </p>
        </motion.div>

        {/* Date line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-3 sm:mt-4 flex items-center gap-3"
        >
          <div className="h-px w-8 sm:w-14 bg-white/15" />
          <span className="text-white/40 text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase">
            18 April 2026 &middot; IAR Campus
          </span>
          <div className="h-px w-8 sm:w-14 bg-white/15" />
        </motion.div>

        {/* Prize */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-5 sm:mt-6 inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-full px-5 py-2.5"
        >
          <span className="text-lg">💎</span>
          <span className="text-white/90 text-sm sm:text-base font-bold">15,000 Diamonds</span>
          <span className="text-white/30 text-xs hidden sm:inline">Prize Pool</span>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-5 sm:mt-6"
        >
          <Countdown />
        </motion.div>

        {/* Registration Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4 flex items-center gap-4 text-white/60 text-sm"
        >
          <span>Register by 18 April, 10:00 AM</span>
          <span className="text-white/30">|</span>
          <span>Only 36 teams</span>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
        >
          <motion.a
            href="#register"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto bg-ff-orange hover:bg-ff-orange/90 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl tracking-wide uppercase text-center"
          >
            Register Now
          </motion.a>
          <motion.a
            href="#about"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto border border-white/12 hover:border-white/25 text-white/70 hover:text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-xl tracking-wide uppercase text-center"
          >
            Learn More
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
