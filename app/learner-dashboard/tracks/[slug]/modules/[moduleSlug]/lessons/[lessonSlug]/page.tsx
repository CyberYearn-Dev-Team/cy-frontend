"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#5c880d";
const bgLight = "bg-gray-100 dark:bg-gray-950"; // Main page background
const cardBg = "bg-white dark:bg-gray-900"; // Card background
const textDark = "text-gray-900 dark:text-gray-100"; // Headings/Strong text
const textMedium = "text-gray-600 dark:text-gray-300"; // Body text
const textLight = "text-gray-500 dark:text-gray-400"; // Placeholder/Subtle text

// Interfaces
interface Lesson {
  id: number;
  title: string;
  slug: string;
  content: string;
  estimated_time: string;
  order?: number;
}

export default function LessonDetailPage() {
  const { slug, moduleSlug, lessonSlug } = useParams<{
    slug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function decodeHtml(input: string) {
    if (typeof window === "undefined") return input;
    const textarea = document.createElement("textarea");
    textarea.innerHTML = input;
    return textarea.value;
  }

  // Fetch Lesson
  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await fetch(
          `/api/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonSlug}`
        );
        const data = await res.json();
        setLesson(data.lesson);
      } catch (err) {
        console.error("Error fetching lesson:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [slug, moduleSlug, lessonSlug]);

  // Make in-content links clickable
  useEffect(() => {
    if (!lesson?.content) return;
    const container = document.querySelector(".prose");
    if (!container) return;

    const links = container.querySelectorAll("a.decorated-link");
    links.forEach((link) => {
      const el = link as HTMLAnchorElement;
      if (!el.getAttribute("href") && el.textContent?.startsWith("http")) {
        el.setAttribute("href", el.textContent.trim());
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }, [lesson]);

  const contentHtml = useMemo(
    () => decodeHtml(lesson?.content || ""),
    [lesson?.content]
  );

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-30">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/learner-dashboard/tracks">
                  Learning Tracks
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/learner-dashboard/tracks/${slug}`}>
                  Track
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}`}
                >
                  Module
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Lesson</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <br />

          {loading ? (
            <p className={textLight}>Loading lesson...</p>
          ) : !lesson ? (
            <p className={textLight}>Lesson not found.</p>
          ) : (
            <div className="space-y-6">
              {/* Lesson Info */}
              <div className={`${cardBg} shadow rounded-lg p-6`}>
                <h1 className={`text-2xl font-bold ${textDark} mb-2`}>
                  {lesson.title}
                </h1>
                <p className={`text-sm ${textLight} mb-4`}>
                  Estimated time: {lesson.estimated_time}
                </p>
                <div className="prose prose-slate lg:prose-lg max-w-none dark:prose-invert">
                  <div
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                  />
                </div>
              </div>

              {/* --- QUIZ SECTION --- */}
              <div
                className={`${cardBg} shadow rounded-lg p-3 sm:p-6 flex flex-col sm:flex-row justify-between items-center`}
              >
                <p className={`${textMedium} mb-3 sm:mb-0 sm:p-[10px]`}>
                  Test your knowledge before proceeding to labs.
                </p>
                <Link
                  href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonSlug}/quizzes`}
                  className={`w-full sm:w-auto text-base px-4 py-2 sm:px-5 sm:py-2 rounded-lg bg-[${primary}] text-white hover:bg-[${primaryDarker}] text-center`}
                >
                  Take Quiz for this Lesson
                </Link>
              </div>
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <Nav />
      </div>
    </div>
  );
}
