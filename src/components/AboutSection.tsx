"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Calendar, MapPin, Clock, Trophy, Users, Gamepad2 } from "lucide-react";

const details = [
  {
    icon: Calendar,
    title: "Date",
    value: "Saturday, 18 April 2026",
    color: "text-ff-orange",
  },
  {
    icon: Clock,
    title: "Time",
    value: "9:00 AM - 5:00 PM",
    sub: "Doors open at 8:45 AM",
    color: "text-ff-yellow",
  },
  {
    icon: MapPin,
    title: "Venue",
    value: "IAR Main Campus, A3 Building",
    link: "https://maps.app.goo.gl/9ZbJN5PvMv2CzBLA8",
    color: "text-ff-red",
  },
  {
    icon: Trophy,
    title: "Prize Pool",
    value: "15,000 Diamonds",
    color: "text-cyan-400",
  },
  {
    icon: Users,
    title: "Team Size",
    value: "3-4 Players per Team",
    color: "text-green-400",
  },
  {
    icon: Gamepad2,
    title: "Game",
    value: "Free Fire MAX",
    color: "text-purple-400",
  },
];

const timeline = [
  { time: "8:45 AM", event: "Doors Open", desc: "Arrive early, get settled" },
  { time: "9:15 AM", event: "Registration & Check-in", desc: "Verify your team details" },
  { time: "9:30 AM", event: "Opening Ceremony", desc: "Welcome & rules briefing" },
  { time: "10:00 AM", event: "Round 1 Begins", desc: "Let the battle begin!" },
  { time: "1:00 PM", event: "Lunch Break", desc: "Refuel for the finals" },
  { time: "2:00 PM", event: "Semi Finals", desc: "Top teams clash" },
  { time: "3:30 PM", event: "Grand Finals", desc: "The ultimate showdown" },
  { time: "5:00 PM", event: "Awards Ceremony", desc: "Winners announced & prizes distributed" },
];

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ff-orange/30 to-transparent" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
            <span className="text-white">The </span>
            <span className="bg-gradient-to-r from-ff-orange to-ff-red bg-clip-text text-transparent">
              Battleground
            </span>
          </h2>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
            Get ready for the most intense Free Fire Max tournament in the city. Organized by the
            Computer Science & Gaming Club of Institute of Advanced Research.
          </p>
        </motion.div>

        {/* Logos */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-6 sm:gap-10 mb-16"
        >
          <div className="relative group">
            <div className="absolute -inset-2 bg-ff-orange/20 rounded-full blur-xl group-hover:bg-ff-orange/30 transition-colors" />
            <Image
              src="/images/csgc-logo.png"
              alt="CSGC Logo"
              width={80}
              height={80}
              className="relative rounded-full border-2 border-ff-orange/40 sm:w-[100px] sm:h-[100px]"
            />
          </div>
          <span className="text-3xl sm:text-5xl font-black text-ff-orange">×</span>
          <div className="relative group">
            <div className="absolute -inset-2 bg-ff-maroon/20 rounded-full blur-xl group-hover:bg-ff-maroon/30 transition-colors" />
            <Image
              src="/images/FFMC.png"
              alt="FFMC Logo"
              width={80}
              height={80}
              className="relative rounded-full border-2 border-ff-maroon/40 sm:w-[100px] sm:h-[100px]"
            />
          </div>
        </motion.div>

        {/* Details grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-20">
          {details.map((detail, i) => (
            <motion.div
              key={detail.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 hover:border-ff-orange/30 transition-colors group"
            >
              <detail.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${detail.color} mb-3 group-hover:scale-110 transition-transform`} />
              <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest mb-1">
                {detail.title}
              </p>
              <p className="text-white font-bold text-sm sm:text-base">{detail.value}</p>
              {detail.sub && (
                <p className="text-white/30 text-xs mt-1">{detail.sub}</p>
              )}
              {detail.link && (
                <a
                  href={detail.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ff-orange text-xs mt-1 inline-block hover:underline"
                >
                  Open in Maps →
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-2xl sm:text-3xl font-black text-center mb-10 uppercase tracking-wider">
            <span className="text-ff-orange">Event</span> Timeline
          </h3>

          <div className="relative max-w-2xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-ff-orange via-ff-red to-ff-orange/0" />

            {timeline.map((item, i) => (
              <motion.div
                key={item.time}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                className={`relative flex items-start gap-4 mb-6 sm:mb-8 pl-10 sm:pl-0 ${
                  i % 2 === 0 ? "sm:flex-row sm:text-right" : "sm:flex-row-reverse sm:text-left"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-2.5 sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 bg-ff-orange rounded-full border-2 border-ff-darker shadow-lg shadow-ff-orange/30 mt-1" />

                <div className={`sm:w-1/2 ${i % 2 === 0 ? "sm:pr-10" : "sm:pl-10"}`}>
                  <span className="text-ff-orange font-mono text-sm font-bold">{item.time}</span>
                  <h4 className="text-white font-bold text-sm sm:text-base mt-0.5">{item.event}</h4>
                  <p className="text-white/40 text-xs sm:text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
