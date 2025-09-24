"use client";

import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import { useState, useEffect } from "react";
import { FileText } from "lucide-react";

export default function TermsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [termsContent, setTermsContent] = useState<{
    title?: string;
    content?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await fetch("/api/legal-pages?type=terms");
        const data = await res.json();

        if (data.data && data.data.length > 0) {
          // store the whole item so we can access title and content safely
          setTermsContent({
            title: data.data[0].title,
            content: data.data[0].content,
          });
        } else {
          setTermsContent(null);
        }
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {loading ? (
            <p className="text-gray-600">Loading content...</p>
          ) : termsContent ? (
            <>
              {/* Use the title from Directus */}
              <h1 className="text-2xl font-bold mb-8">
                {termsContent?.title || "Legal Page"}
              </h1>

              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <div
                  dangerouslySetInnerHTML={{
                    __html: termsContent?.content || "",
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center mt-20 text-gray-500 space-y-4 px-4 sm:px-0">
  <FileText className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-[#72a210]" />
  <p className="text-xl sm:text-2xl font-semibold">Oops! No content available.</p>
  <p className="max-w-sm sm:max-w-md text-gray-400">
    It looks like the Terms of Service hasn’t been added yet. Please check back later.
  </p>
</div>

          )}
        </main>
      </div>
    </div>
  );
}
