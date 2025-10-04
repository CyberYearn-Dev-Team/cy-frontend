"use client";

import React from "react";
import Link from "next/link";


export default function LearnerFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-15">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="md:max-w-sm">
            <img
            src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/light%20logo.png"
              alt="CyberLearn Logo"
              className="h-11 w-auto"
            />
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
                <li>Ethical Hacking</li>
                <li>Digital Forensics</li>
                <li>Security Analysis</li>
                <li>Network Security</li>
                <li>Penetration Testing</li>
              </ul>
            </div>

            {/* Legal */}
            <div>
            <h3 className="text-white font-semibold text-lg mb-4">Legal Pages</h3>
            <ul className="space-y-3">
              <li><Link href="/learner-dashboard/legalpages/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/learner-dashboard/legalpages/cookies" className="hover:text-white transition">Cookie Policy</Link></li>
              <li><Link href="/learner-dashboard/legalpages/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/learner-dashboard/legalpages/aup" className="hover:text-white transition">Acceptable Use Policy</Link></li>
            </ul>
          </div>

            {/* Support Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/learner-dashboard/contact" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="/learner-dashboard/contact" className="hover:text-white transition">Contact Support</Link></li>
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
      </div>
    </footer>
  );
}
