// components/ui/footer.tsx
"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-10">
      <div className="container mx-auto px-2">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <img
                src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/CyberYearn_OctaTech_Logo_White.png"
                alt="Logo"
                className="h-12 sm:h-16 md:h-20 w-auto"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mt-4">
              CyberLearn is your comprehensive platform for cybersecurity
              education, offering hands-on training and expert-led courses
              to master cybersecurity skills efficiently.
            </p>
          </div>

          {/* Courses Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Courses</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition">Ethical Hacking</a></li>
              <li><a href="#" className="hover:text-white transition">Network Security</a></li>
              <li><a href="#" className="hover:text-white transition">Penetration Testing</a></li>
              <li><a href="#" className="hover:text-white transition">Digital Forensics</a></li>
              <li><a href="#" className="hover:text-white transition">Security Analysis</a></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Support</a></li>
              <li>
                <Link href="/landing/terms" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/landing/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Resources</a></li>
              <li><a href="#" className="hover:text-white transition">Community</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom border */}
        <div className="border-t border-gray-800 pt-6">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} CyberLearn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
