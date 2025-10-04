"use client";

import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { useState, useEffect } from "react";
import { FileText } from "lucide-react";

// Theme Constants
const primary = "#72a210";
const bgLight = "bg-white dark:bg-gray-950"; // Main page background
const textDark = "text-gray-900 dark:text-gray-100"; // Headings/Strong text
const textMedium = "text-gray-800 dark:text-gray-300"; // Body text
const textLight = "text-gray-500 dark:text-gray-400"; // Subtle/Placeholder text
const proseText = "text-gray-700 dark:text-gray-300"; // Prose content text

export default function PrivacyPage() {
  const [privacyContent, setPrivacyContent] = useState<{
    title?: string;
    content?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrivacy = async () => {
      try {
        const res = await fetch("/api/legal-pages?type=privacy");
        const data = await res.json();

        if (data.data && data.data.length > 0) {
          setPrivacyContent({
            title: data.data[0].title,
            content: data.data[0].content,
          });
        } else {
          setPrivacyContent(null);
        }
      } catch (err) {
        console.error("Error fetching Privacy Policy:", err);
        setPrivacyContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacy();
  }, []);

  return (
    // Applied dark mode background
    <div className={`min-h-screen flex flex-col ${bgLight}`}>
      <Header />

      {/* Applied dark mode text color for main container */}
      <main className={`flex-1 mx-auto lg:px-20 px-6 py-12 ${textMedium} leading-relaxed`}>
        {loading ? (
          <p className={textLight}>Loading content...</p>
        ) : privacyContent ? (
          <>
            {/* Applied dark mode text color for title */}
            <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${textDark}`}>
              {privacyContent.title || "Privacy Policy"}
            </h1>
            <div
              // Applied dark mode text color for the dynamic content
              // NOTE: For full dark mode support, the `prose` class requires a custom `prose-dark` configuration in the Tailwind CSS setup, which isn't present here. The text color class below provides partial adaptation.
              className={`prose max-w-none space-y-6 ${proseText}
                dark:prose-invert 
                dark:prose-headings:text-gray-100 
                dark:prose-strong:text-gray-100 
                dark:prose-a:text-blue-400
              `}
              dangerouslySetInnerHTML={{ __html: privacyContent.content || "" }}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-gray-500 space-y-4 px-4 sm:px-0">
            {/* Applied theme color to icon */}
            <FileText className={`w-15 h-15 sm:w-20 sm:h-20 mx-auto text-[${primary}]`} />
            <p className={`text-xl sm:text-1xl font-semibold ${textDark}`}>
              Oops! No content available.
            </p>
            <p className="max-w-sm sm:max-w-md text-gray-400">
              It looks like the Privacy Policy hasn’t been added yet. Please
              check back later.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}