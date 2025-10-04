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

export default function TermsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [termsContent, setTermsContent] = useState<{
    title?: string;
    content?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      // Mock data for demonstration purposes
      await new Promise(resolve => setTimeout(resolve, 500)); 
      const mockTerms = {
        title: "Terms of Service and Usage Agreement",
        content: `
          <p><strong>1. Acceptance of Terms.</strong> By accessing and using this service, you accept and agree to be bound by the terms and provisions of this agreement. When using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
          
          <h3>2. Intellectual Property</h3>
          <p>All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of the company or its content suppliers and protected by international copyright laws. Unauthorized use is strictly prohibited.</p>

          <ol>
            <li>You may not reproduce, duplicate, copy, sell, resell or exploit any portion of the service, use of the service, or access to the service without express written permission by us.</li>
            <li>You agree not to use the service for any illegal or unauthorized purpose.</li>
          </ol>
          <p>Violation of any of the terms will result in the termination of your account.</p>
        `,
      };

      try {
        // Actual fetch logic would go here:
        const res = await fetch("/api/legal-pages?type=terms");
        const data = await res.json();

        if (data.data && data.data.length > 0) {
          setTermsContent({ title: data.data[0].title, content: data.data[0].content });
        } else {
          setTermsContent(null);
        }
        
        // setTermsContent(mockTerms); // Using mock data
      } catch (err) {
        console.error("Error fetching Terms of Service:", err);
        setTermsContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  return (
    // Applied dark mode background
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Content + Footer wrapper */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          {/* Applied base text color for dark mode to the main tag */}
          <main className={`flex-1 mx-auto lg:px-20 px-6 py-12 ${textMedium} leading-relaxed`}>
            {loading ? (
              <p className={textLight}>Loading content...</p>
            ) : termsContent ? (
              <>
                {/* Applied dark mode heading color */}
                <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${textDark}`}>
                  {termsContent.title || "Terms of Service"}
                </h1>
                {/* Apply dark mode to prose content and ensure text color consistency */}
                <div
                  className={`prose max-w-none space-y-6 dark:prose-invert prose-p:${textMedium} prose-headings:${textDark} dark:prose-strong:${textDark} dark:prose-ol:${textMedium} dark:prose-ul:${textMedium}`}
                  dangerouslySetInnerHTML={{
                    __html: termsContent.content || "",
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
                  It looks like the Terms of Service hasn’t been added yet.
                  Please check back later.
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