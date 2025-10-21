"use client";

import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import Nav from "@/components/ui/learner-nav";
import LearnerFooter from "@/components/ui/learner-footer";
import { useState, useEffect } from "react";
import { FileText } from "lucide-react";

// Theme Constants
const primary = "#72a210";
const bgLight = "bg-white dark:bg-gray-950"; // Main page background
const textDark = "text-gray-900 dark:text-gray-100"; // Headings
const textMedium = "text-gray-700 dark:text-gray-300"; // Body text
const textLight = "text-gray-500 dark:text-gray-400"; // Loading/placeholder text

export default function AupPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aupContent, setAupContent] = useState<{
    title?: string;
    content?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch Acceptable Use Policy content
  useEffect(() => {
    const fetchAup = async () => {
      try {
        const res = await fetch("/api/legal-pages?type=aup");
        const data = await res.json();

        if (data.data && data.data.length > 0) {
          setAupContent({
            title: data.data[0].title,
            content: data.data[0].content,
          });
        } else {
          setAupContent(null);
        }
      } catch (err) {
        console.error("Error fetching Acceptable Use Policy:", err);
        setAupContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAup();
  }, []);

  // 🔹 Make links clickable + styled (auto-enhancer)
  useEffect(() => {
    if (!aupContent?.content) return;

    const container = document.querySelector(".prose");
    if (!container) return;

    const links = container.querySelectorAll("a");

    links.forEach((link) => {
      const el = link as HTMLAnchorElement;

      // If there's no href, but text looks like a URL, infer it
      if (!el.getAttribute("href") && el.textContent?.startsWith("http")) {
        el.setAttribute("href", el.textContent.trim());
      }

      // Always open in a new tab safely
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");

      // Apply theme color and underline for clarity
      el.style.color = primary;
      el.style.textDecoration = "underline";
    });
  }, [aupContent]);

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
            ) : aupContent ? (
              <>
                <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${textDark}`}>
                  {aupContent.title || "Acceptable Use Policy"}
                </h1>
                <div
                  className={`prose max-w-none space-y-6 ${textMedium} dark:prose-invert`}
                  dangerouslySetInnerHTML={{ __html: aupContent.content || "" }}
                />
              </>
            ) : (
              // Empty state
              <div
                className={`flex flex-col items-center justify-center text-center ${textLight} space-y-4 px-4 sm:px-0`}
              >
                <FileText className={`w-15 h-15 sm:w-20 sm:h-20 mx-auto text-[${primary}]`} />
                <p className={`text-xl sm:text-1xl font-semibold ${textDark}`}>
                  Oops! No content available.
                </p>
                <p className={`max-w-sm sm:max-w-md ${textMedium}`}>
                  It looks like the Acceptable Use Policy hasn’t been added yet.
                  Please check back later.
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
