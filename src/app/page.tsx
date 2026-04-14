"use client";

import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RegistrationForm from "@/components/RegistrationForm";
import RulesSection from "@/components/RulesSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Toaster position="top-center" />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <RulesSection />
      <RegistrationForm />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
