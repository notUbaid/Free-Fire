import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
      <Analytics />
      {children}
    </body>
    </html>
  );
}
