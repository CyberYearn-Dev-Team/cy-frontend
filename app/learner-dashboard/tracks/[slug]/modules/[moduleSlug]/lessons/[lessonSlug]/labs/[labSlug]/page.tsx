"use client";

import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import Nav from "@/components/ui/learner-nav";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#5c880d";
const bgLight = "bg-gray-100 dark:bg-gray-950";
const cardBg = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-300";
const textLight = "text-gray-500 dark:text-gray-400";

// ✅ Your Directus instance URL
const DIRECTUS_URL = "https://cy-directus.onrender.com"; // <-- replace this

interface LabGuide {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  xp: number;
  time: string;
  video_url?: string;
  pdf_url?: string;
}

export default function LabPage() {
  const { slug, moduleSlug, lessonSlug, labSlug } = useParams<{
    slug: string;
    moduleSlug: string;
    lessonSlug: string;
    labSlug: string;
  }>();

  const [lab, setLab] = useState<LabGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchLab() {
      try {
        const res = await fetch(
          `/api/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonSlug}/labs/${labSlug}`
        );
        const data = await res.json();
        console.log("Fetched lab data:", data.lab); // 👀 see pdf_url shape
        setLab(data.lab || null);
      } catch (err) {
        console.error("Error fetching lab:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLab();
  }, [slug, moduleSlug, lessonSlug, labSlug]);

  // ✅ Utility to get full Directus file URL
const getPdfUrl = (url?: string): string | undefined => {
  if (!url) return undefined;

  // Base URL for your Directus instance
  const base = DIRECTUS_URL.endsWith("/")
    ? DIRECTUS_URL.slice(0, -1)
    : DIRECTUS_URL;

  // ✅ Handle three possible shapes:
  // 1. "http..." → already full
  // 2. "/assets/..." → already full path
  // 3. "62ef256e-..." → just an ID (need to prefix /assets/)
  if (url.startsWith("http")) {
    return url;
  } else if (url.startsWith("/assets/")) {
    return `${base}${url}`;
  } else {
    return `${base}/assets/${url}`;
  }
};


// ✅ Utility to get full Directus video file URL
const getVideoUrl = (url?: string): string | undefined => {
  if (!url) return undefined;

  // Base URL for your Directus instance
  const base = DIRECTUS_URL.endsWith("/")
    ? DIRECTUS_URL.slice(0, -1)
    : DIRECTUS_URL;

  // ✅ Handle possible shapes
  if (url.startsWith("http")) {
    return url;
  } else if (url.startsWith("/assets/")) {
    return `${base}${url}`;
  } else {
    return `${base}/assets/${url}`;
  }
};



  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-30">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/learner-dashboard/tracks">
                  Tracks
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Result</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <br />

          {loading ? (
            <p className={textLight}>Loading lab...</p>
          ) : !lab ? (
            <p className={textLight}>Lab not found.</p>
          ) : (
            <div className={`${cardBg} shadow rounded-lg p-6 space-y-4`}>
              <h1 className={`text-2xl font-bold ${textDark}`}>{lab.title}</h1>
              <p className={textMedium}>{lab.description}</p>
              <p className={`text-sm ${textLight}`}>
                XP: {lab.xp} - Time: {lab.time}
              </p>

              {/* ✅ Video player */}
              {lab.video_url && (
                <video
  controls
  className="w-full rounded-lg"
  preload="metadata"
>
  <source src={getVideoUrl(lab.video_url)} type="video/mp4" />
  Your browser does not support the video tag.
</video>

              )}

              {/* ✅ PDF Button (fixed) */}
{/* ✅ PDF Buttons (View + Download) */}
{lab.pdf_url && (
  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
    {/* View PDF Button */}
    <a
      href={getPdfUrl(lab.pdf_url)}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex-1 sm:flex-none text-base px-5 py-2 rounded-lg bg-[${primary}] text-white hover:bg-[${primaryDarker}] text-center transition`}
    >
      View Lab Guide (PDF)
    </a>

    {/* Download PDF Button */}
<button
  onClick={async () => {
    try {
      const pdfUrl = getPdfUrl(lab.pdf_url);
      if (!pdfUrl) return;

      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${lab.title || "lab-guide"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download PDF:", err);
      alert("Failed to download PDF. Please try again.");
    }
  }}
  className={`flex items-center justify-center cursor-pointer gap-2 px-5 py-2 rounded-lg bg-[${primary}] text-white hover:bg-[${primaryDarker}] transition`}
>
  {/* 👇 Icon only on small screens */}
  <Download className="w-5 h-5 sm:mr-2" />
  <span className="hidden sm:inline">Download PDF</span>
</button>

  </div>
)}

            </div>
          )}

          <br />

          {/* Quizzes Button */}
          <div
            className={`${cardBg} shadow rounded-lg p-3 sm:p-6 flex flex-col sm:flex-row justify-between items-center`}
          >
            <p className={`${textMedium} mb-3 sm:mb-0 sm:p-[10px]`}>
              Test your knowledge so far.
            </p>
            <Link
              href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonSlug}/labs/${labSlug}/quizzes`}
              className={`w-full sm:w-auto text-base px-4 py-2 sm:px-5 sm:py-2 rounded-lg bg-[${primary}] text-white hover:bg-[${primaryDarker}] text-center`}
            >
              Take quiz for this Track
             </Link>
          </div>
        </main>

        {/* Bottom Navigation */}
        <Nav />
      </div>
    </div>
  );
}
