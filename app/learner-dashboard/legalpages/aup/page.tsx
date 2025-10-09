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

  return (
    // Applied dark mode background
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />


      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Content + Footer wrapper */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          {/* Applied base text color for dark mode to the main tag */}
          <main className={`flex-1 mx-auto lg:px-20 px-6 py-12 ${textMedium} leading-relaxed`}>
            {loading ? (
              <p className={textLight}>Loading content...</p>
            ) : aupContent ? (
              <>
                {/* Applied dark mode heading color */}
                <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${textDark}`}>
                  {aupContent.title || "Acceptable Use Policy"}
                </h1>
                <div
                  // Applied dark mode prose styling and text color
                  className={`prose max-w-none space-y-6 dark:prose-invert prose-p:${textMedium} prose-headings:${textDark} dark:prose-strong:${textDark} dark:prose-ol:${textMedium} dark:prose-ul:${textMedium}`}
                  dangerouslySetInnerHTML={{ __html: aupContent.content || "" }}
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