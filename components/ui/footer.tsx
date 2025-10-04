"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function Footer() {
  const [darkMode, setDarkMode] = useState(false);

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <footer className="bg-gray-900 text-gray-300 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="md:max-w-sm">
        <Link href="/">
            <img
              src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/light%20logo.png"
              alt="CyberLearn Logo"
              className="h-11 w-auto"
            />
        </Link>
            <p className="text-[15px] text-gray-400 leading-relaxed mt-4">
              CyberYearn is your comprehensive platform for cybersecurity
              education, offering hands-on training and expert-led courses
              to master cybersecurity skills efficiently.
            </p>
          </div>

          {/* Links wrapper */}
          <div className="flex flex-1 flex-col sm:flex-row justify-between gap-10">
            {/* Courses */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Courses</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="hover:text-white transition">Ethical Hacking</Link></li>
                <li><Link href="#" className="hover:text-white transition">Digital Forensics</Link></li>
                <li><Link href="#" className="hover:text-white transition">Security Analysis</Link></li>
                <li><Link href="#" className="hover:text-white transition">Network Security</Link></li>
                <li><Link href="#" className="hover:text-white transition">Penetration Testing</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Legal Pages</h3>
              <ul className="space-y-3">
                <li><Link href="/landing/legalpages/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/landing/legalpages/cookies" className="hover:text-white transition">Cookie Policy</Link></li>
                <li><Link href="/landing/legalpages/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/landing/legalpages/aup" className="hover:text-white transition">Acceptable Use Policy</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/landing/contact" className="hover:text-white transition">Help Center</Link></li>
                <li><Link href="/landing/contact" className="hover:text-white transition">Contact Support</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div className="border-t border-gray-800 pt-6 text-center md:text-left">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} CyberYearn. All rights reserved.
          </p>
        </div>

        {/* Floating Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="fixed bottom-8 right-6 p-3 rounded-[10px] bg-gray-100 dark:bg-gray-700 shadow-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center z-50 cursor-pointer"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-900 dark:text-gray-300" />
          )}
        </button>
      </div>
    </footer>
  );
}
