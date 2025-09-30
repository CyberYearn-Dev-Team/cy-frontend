// components/ui/footer.tsx
"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-12 lg:px-0 py-12">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <img
                src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/CyberYearn_OctaTech_Logo_White.png"
                alt="CyberLearn Logo"
                className="h-15 sm:h-14 md:h-17 w-auto"
              />
            </div>
            <p className="text-[15] text-white-400 leading-relaxed mt-4">
              CyberYearn is your comprehensive platform for cybersecurity
              education, offering hands-on training and expert-led courses
              to master cybersecurity skills efficiently.
            </p>
          </div>  

          {/* Courses Section */}
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

          {/* Legal Pages Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Legal Pages</h3>
            <ul className="space-y-3">
              <li><Link href="/landing/legalpages/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/landing/legalpages/cookies" className="hover:text-white transition">Cookie Policy</Link></li>
              <li><Link href="/landing/legalpages/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/landing/legalpages/aup" className="hover:text-white transition">Acceptable Use Policy</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/landing/contact" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="/landing/contact" className="hover:text-white transition">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom border */}
        <div className="border-t border-gray-800 pt-6 text-center md:text-left">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} CyberYearn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
