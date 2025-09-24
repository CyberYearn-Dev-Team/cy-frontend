"use client";

import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { useState, useEffect } from "react";
import { FileText } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Main content grows to fill space between header and footer */}
      <main className="flex-1 mx-auto lg:px-20 px-6 py-12 text-gray-800 leading-relaxed">
        {loading ? (
          <p className="text-gray-600">Loading content...</p>
        ) : privacyContent ? (
          <>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              {privacyContent.title || "Privacy Policy"}
            </h1>
            <div
              className="prose max-w-none text-gray-700 space-y-6"
              dangerouslySetInnerHTML={{ __html: privacyContent.content || "" }}
            />
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

      <Footer />
    </div>
  );
}
