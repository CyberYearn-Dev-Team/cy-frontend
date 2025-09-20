"use client";

import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* inporting header drom component */}
      <Header />

      <div className="mx-auto lg:px-20 px-6 py-12 text-gray-800 leading-relaxed">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          Legal & Accessibility
        </h1>

        {/* Educational Use Disclaimer */}
        <h2 className="text-2xl font-semibold mt-12 mb-3 text-[#72a210]">
          Educational Use Only
        </h2>
        <p className="mb-6 text-gray-600">
          CyberLearn is for educational purposes only. Do not use techniques
          learned here to test or access systems without explicit authorization.
          You agree to follow all applicable laws and the Acceptable Use Policy.
        </p>

        {/* Acceptable Use Policy */}
        <h2 className="text-2xl font-semibold mt-10 mb-3 text-[#72a210]">
          Acceptable Use Policy (AUP)
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>
            Run labs only on your local virtual machines, never on third-party
            systems.
          </li>
          <li>
            Do not attack, scan, or disrupt networks or services you do not own.
          </li>
          <li>Do not share malware, exploits, or harmful code.</li>
          <li>Respect privacy and intellectual property.</li>
        </ul>

        {/* Privacy Highlights */}
        <h2 className="text-2xl font-semibold mt-10 mb-3 text-[#72a210]">
          Privacy
        </h2>
        <p className="mb-6 text-gray-600">
          We collect essential account data and anonymous analytics (e.g.,
          lesson opened, quiz submitted) to improve the platform. Avoid
          uploading sensitive personal data.
        </p>

        {/* Accessibility */}
        <h2 className="text-2xl font-semibold mt-10 mb-3 text-[#72a210]">
          Accessibility
        </h2>
        <p className="mb-6 text-gray-600">
          We aim to meet WCAG 2.2 AA basics. If you encounter barriers, contact
          support so we can make improvements.
        </p>

        {/* Closing */}
        <p className="mt-12 text-gray-500 italic">
          These pages may be refined over time. Continued use indicates
          acceptance of updates.
        </p>
      </div>

      {/* inporting footer drom component */}
      <Footer />
    </div>
  );
}
