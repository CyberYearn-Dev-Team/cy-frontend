import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import CookieConsent from "@/components/ui/CookieConsent";
import InactivityHandler from "@/components/ui/InactivityHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// All related to my header 
export const metadata: Metadata = {
  title: "CyberYearn",
  description: "Master Cybersecurity through hands-on learning",
  icons: {
    icon: "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/CyberYearn_favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Client side inactivity monitor for (loging user out) */}
        <InactivityHandler />

        {children}
        <Toaster position="top-right" richColors /> {/* Sonner Toaster */}
        <CookieConsent /> {/* shows on every page */}
      </body>
    </html>
  );
}
