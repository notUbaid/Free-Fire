"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#about", label: "About" },
  { href: "#rules", label: "Rules" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const cb = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", cb, { passive: true });
    return () => window.removeEventListener("scroll", cb);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ff-darker/90 backdrop-blur-xl border-b border-white/[0.06]" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Image
              src="/images/csgc-logo.png"
              alt="CSGC"
              width={28}
              height={28}
              className="rounded-full"
            />
            <Image
              src="/images/FFMC.png"
              alt="FFMC"
              width={28}
              height={28}
              className="rounded-full"
            />
            <Image
              src="/images/FFMC.png"
              alt="FFMC"
              width={28}
              height={28}
              className="rounded-full"
            />
            <Image
              src="/images/iar-logo.png"
              alt="IAR"
              width={28}
              height={28}
              className="rounded-full"
            />
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/50 hover:text-white text-[13px] font-medium tracking-wide uppercase transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#register"
            className="bg-ff-orange hover:bg-ff-orange/90 text-white text-[13px] font-bold px-5 py-2 rounded-lg tracking-wide uppercase transition-colors"
          >
            Register
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white/60 hover:text-white p-1.5 transition-colors"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ff-darker/95 backdrop-blur-xl border-t border-white/[0.05] overflow-hidden"
          >
            <div className="px-5 py-4 space-y-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block text-white/60 hover:text-white text-sm font-medium tracking-wide uppercase py-2.5 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#register"
                onClick={() => setOpen(false)}
                className="block bg-ff-orange text-white text-sm font-bold px-5 py-3 rounded-lg tracking-wide uppercase text-center mt-3"
              >
                Register Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
