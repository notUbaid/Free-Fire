import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MessageCircle } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "CSGC x Free Fire Max Tournament | IAR",
  description:
    "The ultimate Free Fire Max tournament by Computer Science & Gaming Club at Institute of Advanced Research. 15K Diamonds Prize Pool. April 18, 2026.",
  keywords: ["Free Fire Max", "tournament", "CSGC", "IAR", "gaming", "esports"],
  openGraph: {
    title: "CSGC x Free Fire Max Tournament",
    description: "15K Diamonds Prize Pool | April 18, 2026 | IAR Main Campus",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/917855937175"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg shadow-green-500/30 transition-all hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-ff-darker text-white">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
