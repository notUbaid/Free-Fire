"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";

const contacts = [
  {
    name: "Ved",
    role: "Gaming Head",
    phone: "+91 63542 72295",
    whatsapp: "916354272295",
    color: "from-ff-orange to-ff-red",
    image: "Ved",
  },
  {
    name: "Aditya",
    role: "Gaming Head",
    phone: "+91 95860 58333",
    whatsapp: "919586058333",
    color: "from-purple-500 to-indigo-600",
    image: "Aditya",
  },
  {
    name: "Ubaid",
    role: "Coordinator",
    phone: "+91 96244 44730",
    whatsapp: "919624444730",
    color: "from-green-500 to-emerald-600",
    image: "Ubaid",
  },
  {
    name: "Hemang",
    role: "Gaming Head",
    phone: "+91 78599 37175",
    whatsapp: "917859937175",
    color: "from-cyan-500 to-blue-600",
    image: "Hemang",
  },
];

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="relative py-20 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ff-darker via-black/30 to-ff-darker" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ff-orange/30 to-transparent" />

      <div ref={ref} className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
            <span className="text-white">Contact </span>
            <span className="bg-gradient-to-r from-ff-orange to-ff-yellow bg-clip-text text-transparent">
              Us
            </span>
          </h2>
          <p className="text-white/40 mt-4 text-sm sm:text-base">
            Have questions? Need a team? Reach out to our organizers
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {contacts.map((contact, i) => (
            <motion.div
              key={contact.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-ff-orange/30 transition-all duration-300"
            >
<div className="w-20 h-20 mx-auto rounded-full mb-4 group-hover:scale-110 transition-transform bg-gradient-to-br from-ff-orange to-ff-red overflow-hidden border-2 border-white/20">
                  <img src={`/images/${contact.image}${['Aditya', 'Ubaid'].includes(contact.image) ? '.jpeg' : '.jpg'}`} alt={contact.name} className="w-full h-full object-cover" />
                </div>
              <h3 className="text-white font-bold text-lg">{contact.name}</h3>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-4">
                {contact.role}
              </p>

              <div className="space-y-2">
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {contact.phone}
                </a>
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Venue Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-ff-red" />
            <div>
              <h3 className="text-white font-bold">Venue</h3>
              <p className="text-white/40 text-sm">IAR Main Campus, A3 Building</p>
            </div>
          </div>
          <a
            href="https://maps.app.goo.gl/9ZbJN5PvMv2CzBLA8"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-ff-orange/10 to-ff-red/10 border border-ff-orange/20 rounded-xl p-6 text-center hover:border-ff-orange/40 transition-colors group"
          >
            <MapPin className="w-10 h-10 text-ff-orange mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-ff-orange font-bold mb-1">Open in Google Maps</p>
            <p className="text-white/30 text-xs">IAR Main Campus, A3 Building</p>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
