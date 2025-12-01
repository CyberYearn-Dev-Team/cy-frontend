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
const textMedium = "text-gray-700 dark:text-gray-300"; // Body text
const textLight = "text-gray-500 dark:text-gray-400"; // Loading/placeholder text

export default function CookiesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cookiesContent, setCookiesContent] = useState<{
    title?: string;
    content?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch Cookies Policy content
  useEffect(() => {
    const fetchCookies = async () => {
      try {
        const res = await fetch("/api/legal-pages?type=cookies");
        const data = await res.json();

        if (data.data && data.data.length > 0) {
          setCookiesContent({
            title: data.data[0].title,
            content: data.data[0].content,
          });
        } else {
          setCookiesContent(null);
        }
      } catch (err) {
        console.error("Error fetching Cookies Policy:", err);
        setCookiesContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCookies();
  }, []);

  // 🔹 Make links clickable + styled automatically
  useEffect(() => {
    if (!cookiesContent?.content) return;

    const container = document.querySelector(".prose");
    if (!container) return;

    const links = container.querySelectorAll("a");

    links.forEach((link) => {
      const el = link as HTMLAnchorElement;

      // If there's no href, infer it from visible text if it looks like a URL
      if (!el.getAttribute("href") && el.textContent?.startsWith("http")) {
        el.setAttribute("href", el.textContent.trim());
      }

      // Always open in a new tab safely
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");

      // Apply your theme color and underline
      el.style.color = primary;
      el.style.textDecoration = "underline";
    });
  }, [cookiesContent]);

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
            ) : cookiesContent ? (
              <>
                <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${textDark}`}>
                  {cookiesContent.title || "Cookies Policy"}
                </h1>
                <div
                  className={`prose max-w-none space-y-6 ${textMedium} dark:prose-invert`}
                  dangerouslySetInnerHTML={{
                    __html: cookiesContent.content || "",
                  }}
                />
              </>
            ) : (
              // Empty State
              <div
                className={`flex flex-col items-center justify-center text-center ${textLight} space-y-4 px-4 sm:px-0`}
              >
                <FileText className={`w-15 h-15 sm:w-20 sm:h-20 mx-auto text-[${primary}]`} />
                <p className={`text-xl sm:text-1xl font-semibold ${textDark}`}>
                  Oops! No content available.
                </p>
                <p className={`max-w-sm sm:max-w-md ${textMedium}`}>
                  It looks like the Cookies Policy hasn’t been added yet. Please
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
