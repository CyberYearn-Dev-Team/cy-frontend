"use client";

import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
// import Breadcrumb from "@/components/ui/breadcrumb";
// import { Breadcrumb } from "@/components/ui/breadcrumb";
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

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#5c880d";
const bgLight = "bg-gray-100 dark:bg-gray-950"; // Main page background
const cardBg = "bg-white dark:bg-gray-900"; // Card background
const textDark = "text-gray-900 dark:text-gray-100"; // Headings/Strong text
const textMedium = "text-gray-600 dark:text-gray-300"; // Body text
const textLight = "text-gray-500 dark:text-gray-400"; // Placeholder/Subtle text
// const borderLight = "border dark:border-gray-700"; // Not explicitly needed in this file but defined for reference

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
        setLab(data.lab || null);
      } catch (err) {
        console.error("Error fetching lab:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLab();
  }, [slug, moduleSlug, lessonSlug, labSlug]);

  return (
    // Applied dark mode background
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Breadcrumb */}
          <Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/learner-dashboard/tracks">Tracks</BreadcrumbLink>
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
            // Applied card background
            <div className={`${cardBg} shadow rounded-lg p-6 space-y-4`}>
              <h1 className={`text-2xl font-bold ${textDark}`}>{lab.title}</h1>
              <p className={textMedium}>{lab.description}</p>
              <p className={`text-sm ${textLight}`}>
                XP: {lab.xp} - Time: {lab.time}
              </p>

              {lab.video_url && (
                <video controls className="w-full rounded-lg">
                  <source src={lab.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              {lab.pdf_url && (
                <a
                  href={lab.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  // Applied theme color to button
                  className={`inline-block text-base px-5 py-2 rounded-lg bg-[${primary}] text-white hover:bg-[${primaryDarker}]`}
                >
                  View Lab Guide (PDF)
                </a>
              )}
            </div>
          )}{" "}
          <br />
          {/* Quizzes Button */}
          {/* Applied card background */}
          <div className={`${cardBg} shadow rounded-lg p-3 sm:p-6 flex flex-col sm:flex-row justify-between items-center`}>
            <p className={`${textMedium} mb-3 sm:mb-0 sm:p-[10px]`}>
              Test your knowledge so far.
            </p>
            <Link
              href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonSlug}/labs/${labSlug}/quizzes`}
              // Applied theme color to button
              className={`w-full sm:w-auto text-base px-4 py-2 sm:px-5 sm:py-2 rounded-lg bg-[${primary}] text-white hover:bg-[${primaryDarker}] text-center`}
            >
              Take Lesson Quiz
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}