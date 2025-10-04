"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Theme constants (copied from your login page for consistency)
const primary = "#72a210";
const primaryDarker = "#507800";
const cardBg = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-300";

export default function CookieConsent() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookieConsent");
    if (savedConsent) setConsent(savedConsent);
  }, []);

  const handleConsent = (value: "accepted" | "declined") => {
    setConsent(value);
    localStorage.setItem("cookieConsent", value);

    if (value === "accepted") {
      console.log("✅ Cookies accepted — load analytics here");
    } else {
      console.log("🚫 Cookies declined — block tracking");
    }
  };

  return (
    <AnimatePresence>
      {!consent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`fixed bottom-0 left-0 w-full shadow-lg ${cardBg} border-t border-gray-200 dark:border-gray-800 z-50`}
        >
          <div className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className={`text-sm ${textMedium}`}>
              We use cookies to improve your experience. Please confirm you are{" "}
              <span className="font-semibold">at least 16 years old</span> and consent to cookies.
            </p>

            <div className="flex space-x-2">
              <Button
                onClick={() => handleConsent("accepted")}
                style={{ backgroundColor: primary }}
                className={`hover:bg-[${primaryDarker}] text-white`}
              >
                I am 16+ & Accept
              </Button>

              <Button
                onClick={() => handleConsent("declined")}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Decline
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
