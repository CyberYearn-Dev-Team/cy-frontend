"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function Footer() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, []);

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
    <footer className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="md:max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              {/* Light mode logo */}
              <img
                src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/dark%20logo.png"
                alt="CyberYearn Logo"
                className="h-11 w-auto block dark:hidden"
              />
              {/* Dark mode logo */}
              <img
                src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/light%20logo.png"
                alt="CyberYearn Logo"
                className="h-11 w-auto hidden dark:block"
              />
            </Link>

            <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
              CyberYearn is your comprehensive platform for cybersecurity
              education, offering hands-on training and expert-led courses to
              master cybersecurity skills efficiently.
            </p>
            <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
              Our curriculum is mapped to competencies and exam objectives from
              (ISC)², CompTIA Security+, and Splunk, making it suitable as
              supplementary study material. CyberYearn is not affiliated with,
              sponsored, or endorsed by these organizations. All names, logos,
              and trademarks belong to their respective owners and are used for
              identification and reference only.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-1 flex-col sm:flex-row justify-between gap-10">
            {/* Courses */}
            <div>
              <h3 className="text-[#507800] dark:text-[#a3e635] font-semibold text-lg mb-4">
                Courses
              </h3>
              <ul className="space-y-3">
                <li><Link href="#" className="hover:text-[#72a210] dark:hover:text-[#a3e635] transition">Ethical Hacking</Link></li>
                <li><Link href="#" className="hover:text-[#72a210] dark:hover:text-[#a3e635] transition">Digital Forensics</Link></li>
                <li><Link href="#" className="hover:text-[#72a210] dark:hover:text-[#a3e635] transition">Security Analysis</Link></li>
                <li><Link href="#" className="hover:text-[#72a210] dark:hover:text-[#a3e635] transition">Network Security</Link></li>
                <li><Link href="#" className="hover:text-[#72a210] dark:hover:text-[#a3e635] transition">Penetration Testing</Link></li>
              </ul>
            </div>

            {/* Legal Pages */}
            <div>
              <h3 className="text-[#507800] dark:text-[#a3e635] font-semibold text-lg mb-4">
                Legal Pages
              </h3>
              <ul className="space-y-3">
                <li><Link href="/landing/legalpages/privacy" className="hover:text-[#72a210] dark:hover:text-[#a3e635] transition">Privacy Policy</Link></li>
                <li><Link href="/landing/legalpages/cookies" className="hover:text-[#72a210] dark:hover:text-[#a3e635] transition">Cookie Policy</Link></li>
                <li><Link href="/landing/legalpages/terms" className="hover:text-[#72a210] dark:hover:text-[#a3e635] transition">Terms of Service</Link></li>
                <li><Link href="/landing/legalpages/aup" className="hover:text-[#72a210] dark:hover:text-[#a3e635] transition">Acceptable Use Policy</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-[#507800] dark:text-[#a3e635] font-semibold text-lg mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                {/* <li><Link href="/landing/contact" className="hover:text-[#72a210] dark:hover:text-[#a3e635] transition">Help Center</Link></li> */}
                <li><Link href="/landing/contact" className="hover:text-[#72a210] dark:hover:text-[#a3e635] transition">Contact Support</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Logo Row */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 pb-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <img src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/-isc-logo-vectorized-.svg" alt="ISC2 Logo" className="h-8 sm:h-10 w-auto object-contain cursor-pointer" />
            <img src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/comptia-logo.svg" alt="CompTIA Logo" className="h-8 sm:h-10 w-auto object-contain cursor-pointer" />
            <img src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/cisco-2.svg" alt="Cisco Logo" className="h-8 sm:h-10 w-auto object-contain cursor-pointer" />
            <img src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/splunk.svg" alt="Splunk Logo" className="h-8 sm:h-10 w-auto object-contain cursor-pointer" />
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 text-center md:text-left">
          <p className="text-sm text-gray-600 dark:text-gray-400">
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
