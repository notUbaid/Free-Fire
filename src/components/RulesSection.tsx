"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Shield,
  Clock,
  Smartphone,
  AlertTriangle,
  Ban,
  Handshake,
  Swords,
  Wifi,
} from "lucide-react";

const rules = [
  {
    icon: Handshake,
    title: "Fair Play",
    desc: "No hacking, cheating, or using any third-party tools. Any team caught cheating will be immediately disqualified with no refund or appeal.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Clock,
    title: "Punctuality",
    desc: "Teams must be present and checked in by 9:15 AM sharp. Late arrivals may forfeit their spot. Doors open at 8:45 AM.",
    color: "from-ff-orange to-amber-600",
  },
  {
    icon: AlertTriangle,
    title: "Disputes",
    desc: "All disputes will be resolved by the organizing committee. Their decision is final and binding. No arguments will be entertained post-verdict.",
    color: "from-ff-red to-rose-600",
  },
  {
    icon: Shield,
    title: "Code of Conduct",
    desc: "Maintain sportsmanship at all times. Toxic behavior, abusive language, or harassment towards other players or organizers will result in immediate removal.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Smartphone,
    title: "Devices",
    desc: "Only mobile devices are allowed. No emulators, tablets with keyboard/mouse, or any external controller peripherals. Bring your own device fully charged.",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Ban,
    title: "No Emulators",
    desc: "Playing on PC emulators like BlueStacks, GameLoop, or any similar software is strictly prohibited. Only Free Fire MAX on mobile is allowed.",
    color: "from-red-600 to-red-800",
  },
  {
    icon: Wifi,
    title: "Connectivity",
    desc: "Bring your own mobile data. Wi-Fi will be available but not guaranteed for gaming. Network issues on your end are your responsibility.",
    color: "from-cyan-500 to-teal-600",
  },
  {
    icon: Swords,
    title: "Match Rules",
    desc: "All matches will be played in Battle Royale - Squad mode. Specific match settings will be communicated on the day of the event.",
    color: "from-ff-yellow to-orange-500",
  },
];

export default function RulesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="rules" className="relative py-20 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ff-darker via-black/50 to-ff-darker" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ff-red/30 to-transparent" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
            <span className="text-white">Rules of </span>
            <span className="bg-gradient-to-r from-ff-red to-ff-orange bg-clip-text text-transparent">
              Engagement
            </span>
          </h2>
          <p className="text-white/40 mt-4 max-w-xl mx-auto text-sm sm:text-base">
            Read carefully. Ignorance is not an excuse. Breaking any rule means instant disqualification.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {rules.map((rule, i) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-white/20 transition-all duration-300 overflow-hidden"
            >
              {/* Glow effect on hover */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${rule.color} opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity duration-500`} />

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rule.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <rule.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-white font-bold text-base mb-2">{rule.title}</h3>
              <p className="text-white/40 text-xs sm:text-sm leading-relaxed">{rule.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Prize section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 text-center"
        >
          <div className="inline-block relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-ff-orange/20 via-ff-yellow/20 to-ff-orange/20 rounded-3xl blur-2xl" />
            <div className="relative bg-black/60 backdrop-blur-sm border border-ff-yellow/30 rounded-3xl p-8 sm:p-12">
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <span className="text-4xl sm:text-6xl">💎</span>
                <div>
                  <p className="text-5xl sm:text-7xl font-black bg-gradient-to-r from-ff-yellow via-white to-ff-yellow bg-clip-text text-transparent">
                    15,000
                  </p>
                  <p className="text-white/40 text-sm uppercase tracking-widest">Free Fire MAX Diamonds</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
