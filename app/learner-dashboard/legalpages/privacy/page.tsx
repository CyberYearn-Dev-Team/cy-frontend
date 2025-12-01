"use client";

import Sidebar from "@/components/learner-sidebar";
import Header from "@/components/learner-header";
import Nav from "@/components/learner-nav";
import LearnerFooter from "@/components/learner-footer";
import { useState, useEffect } from "react";
import { FileText } from "lucide-react";

// Theme Constants
const primary = "#72a210";
const bgLight = "bg-white dark:bg-gray-950"; // Main page background
const textDark = "text-gray-900 dark:text-gray-100"; // Headings
const textMedium = "text-gray-700 dark:text-gray-300"; // Body text and prose content
const textLight = "text-gray-500 dark:text-gray-400"; // Loading/placeholder text

export default function PrivacyPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [privacyContent, setPrivacyContent] = useState<{
    title?: string;
    content?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch privacy content
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

  // 🔹 Make links clickable + open in new tabs safely
  useEffect(() => {
    if (!privacyContent?.content) return;

    const container = document.querySelector(".prose");
    if (!container) return;

    const links = container.querySelectorAll("a");

    links.forEach((link) => {
      const el = link as HTMLAnchorElement;

      // Add missing href if text looks like a URL
      if (!el.getAttribute("href") && el.textContent?.startsWith("http")) {
        el.setAttribute("href", el.textContent.trim());
      }

      // Force open in a new tab safely
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");

      // Apply your theme color and underline style
      el.style.color = primary;
      el.style.textDecoration = "underline";
    });
  }, [privacyContent]);

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Content + Footer wrapper */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className={`flex-1 mx-auto lg:px-20 px-6 py-12 ${textMedium} leading-relaxed`}>
            {loading ? (
              <p className={textLight}>Loading content...</p>
            ) : privacyContent ? (
              <>
                <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${textDark}`}>
                  {privacyContent.title || "Privacy Policy"}
                </h1>
                <div
                  className={`prose max-w-none ${textMedium} space-y-6 dark:prose-invert`}
                  dangerouslySetInnerHTML={{
                    __html: privacyContent.content || "",
                  }}
                />
              </>
            ) : (
              // Empty State
              <div className={`flex flex-col items-center justify-center text-center ${textLight} space-y-4 px-4 sm:px-0`}>
                <FileText className={`w-15 h-15 sm:w-20 sm:h-20 mx-auto text-[${primary}]`} />
                <p className={`text-xl sm:text-1xl font-semibold ${textDark}`}>
                  Oops! No content available.
                </p>
                <p className={`max-w-sm sm:max-w-md ${textMedium}`}>
                  It looks like the Privacy Policy hasn’t been added yet. Please
                  check back later.
                </p>
              </div>
            )}
          </main>

          {/* Navigation */}
          <Nav />

          {/* Footer */}
          <LearnerFooter />
        </div>
      </div>
    </div>
  );
}
