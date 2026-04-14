"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-ff-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image
              src="/images/iar-logo.png"
              alt="IAR"
              width={40}
              height={40}
              className="rounded-full border border-ff-maroon/20"
            />
            <Image
              src="/images/FFMIC.png"
              alt="FFMIC"
              width={40}
              height={40}
              className="rounded-full border border-ff-maroon/20"
            />
            <div className="ml-2">
              <p className="text-white font-bold text-sm">IAR × FFMIC</p>
              <p className="text-white/30 text-xs">Institute of Advanced Research</p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-white/30 text-xs">
              Free Fire MAX Tournament — April 18, 2026
            </p>
            <p className="text-white/20 text-[10px] mt-1">
              Institute of Advanced Research, Gandhinagar
            </p>
          </div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-ff-orange/20 to-transparent my-6"
        />

        <p className="text-center text-white/15 text-[10px] uppercase tracking-widest">
          Made with 🔥 by CSGC
        </p>
      </div>
    </footer>
  );
}
