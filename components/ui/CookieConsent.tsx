"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [consent, setConsent] = useState<string | null>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookieConsent");
    if (savedConsent) setConsent(savedConsent);
  }, []);

  // Handle close logic — hide temporarily, reappear after 5 min
  const handleClose = () => {
    setClosed(true);
    const timeout = setTimeout(() => {
      setClosed(false);
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearTimeout(timeout);
  };

  const handleConsent = (value: "accepted" | "declined") => {
    setConsent(value);
    localStorage.setItem("cookieConsent", value);

    if (value === "accepted") {
      console.log("Cookies accepted — load analytics here");
    } else {
      console.log("Cookies declined — block tracking");
    }
  };

  return (
    <AnimatePresence>
      {!consent && !closed && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="relative w-[320px] sm:w-[400px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg text-center p-6">
            {/* ✖ Close button */}
            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition text-[20px] font-bold cursor-pointer"
            >
              ×
            </button>

            {/* Cookie Icon */}
            <div className="flex justify-center mb-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1047/1047711.png"
                alt="Cookie icon"
                className="w-20 h-20"
              />
            </div>

            {/* Heading */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              We use cookies
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
              This website uses cookies to ensure you get the best experience
              on our website.
            </p>

            {/* Accept Button */}
            <button
              onClick={() => handleConsent("accepted")}
              className="w-full py-2 rounded-md bg-[#72a210] hover:bg-[#507800] text-white font-medium transition cursor-pointer"
            >
              ACCEPT
            </button>

            {/* Decline option (optional, subtle link) */}
            <button
              onClick={() => handleConsent("declined")}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
