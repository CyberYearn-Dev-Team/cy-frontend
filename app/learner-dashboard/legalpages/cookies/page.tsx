"use client";

import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import LearnerFooter from "@/components/ui/learner-footer";
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

  return (
    // Applied dark mode background
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Content + Footer wrapper */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          {/* Applied base text color for dark mode to the main tag */}
          <main className={`flex-1 mx-auto lg:px-20 px-6 py-12 ${textMedium} leading-relaxed`}>
            {loading ? (
              <p className={textLight}>Loading content...</p>
            ) : cookiesContent ? (
              <>
                {/* Applied dark mode heading color */}
                <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${textDark}`}>
                  {cookiesContent.title || "Cookies Policy"}
                </h1>
                <div
                  // Applied dark mode prose styling and text color
                  className={`prose max-w-none space-y-6 dark:prose-invert prose-p:${textMedium} prose-headings:${textDark} dark:prose-strong:${textDark} dark:prose-ol:${textMedium} dark:prose-ul:${textMedium}`}
                  dangerouslySetInnerHTML={{
                    __html: cookiesContent.content || "",
                  }}
                />
              </>
            ) : (
              // Empty State Updated for dark mode and theme
              <div className={`flex flex-col items-center justify-center text-center ${textLight} space-y-4 px-4 sm:px-0`}>
                {/* Theme Color on Icon */}
                <FileText className={`w-15 h-15 sm:w-20 sm:h-20 mx-auto text-[${primary}]`} />
                {/* Applied dark mode text color */}
                <p className={`text-xl sm:text-1xl font-semibold ${textDark}`}>
                  Oops! No content available.
                </p>
                {/* Applied dark mode text color */}
                <p className={`max-w-sm sm:max-w-md ${textMedium}`}>
                  It looks like the Cookies Policy hasn’t been added yet. Please
                  check back later.
                </p>
              </div>
            )}
          </main>

          {/* Footer */}
          <LearnerFooter />
        </div>
      </div>
    </div>
  );
}