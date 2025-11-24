"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  startLesson,
  trackTime,
  completeLesson,
} from "@/lib/services/progressService";
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
  description: string;
  estimated_time: string;
  order?: number;
}

export default function LessonDetailPage() {
  const { slug, moduleSlug, lessonId } = useParams<{
    slug: string;
    moduleSlug: string;
    lessonId: string; // Changed from lessonSlug to lessonId to reflect UUID usage
  }>();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const totalTimeRef = useRef(0);

  // Track lesson start and fetch lesson data
  useEffect(() => {
    // Call startLesson when the component mounts
    startLesson(lessonId as string).catch(console.error);

    async function fetchLesson() {
      try {
        const res = await fetch(
          `/api/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonId}`
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
  }, [slug, moduleSlug, lessonId]);

  // Make in-content links clickable
  useEffect(() => {
    if (!lesson?.description) return;
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

  // Track time spent on lesson
  useEffect(() => {
    if (!lessonId) return;

    const TRACKING_INTERVAL = 15000; // 15 seconds

    const intervalId = setInterval(() => {
      totalTimeRef.current += 15; // Increment total time by 15 seconds
      trackTime(lessonId as string, 15).catch((error) => {
        console.error("Error tracking lesson time:", error);
      });
    }, TRACKING_INTERVAL);

    // Clean up interval on unmount
    return () => {
      clearInterval(intervalId);
      // Send final time update before unmounting
      trackTime(lessonId as string, 15).catch(console.error);
    };
  }, [lessonId]);

  const handleCompleteLesson = async () => {
    if (!lessonId) return;

    try {
      setIsCompleting(true);
      await completeLesson(lessonId as string, totalTimeRef.current);
      // Optional: Add any success feedback here
    } catch (error) {
      console.error("Error completing lesson:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const contentHtml = lesson?.description || "";

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
                <div className="prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                </div>

                {/* Completion Button */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleCompleteLesson}
                    disabled={isCompleting}
                    className={`w-full sm:w-auto text-base px-4 py-2 sm:px-5 sm:py-2 rounded-lg bg-[${primary}] text-white hover:bg-[${primaryDarker}] text-center cursor-pointer`}
                  >
                    {isCompleting ? "Completing..." : "Mark as Completed"}
                  </button>
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
                  href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonId}/quizzes`}
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
