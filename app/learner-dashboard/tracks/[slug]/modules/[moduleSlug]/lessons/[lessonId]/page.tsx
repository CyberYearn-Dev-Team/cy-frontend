"use client";

import { useEffect, useState, useRef } from "react";
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
import { LessonDetailSkeleton } from "@/components/ui/LessonDetailSkeleton";
import { toast } from "sonner";
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
const bgLight = "bg-gray-100 dark:bg-gray-950";
const cardBg = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-300";
const textLight = "text-gray-500 dark:text-gray-400";

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
    lessonId: string;
  }>();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const totalTimeRef = useRef(0);

  // Check lesson progress on load
  useEffect(() => {
    async function checkLessonProgress() {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL.endsWith("/")
      ? process.env.NEXT_PUBLIC_API_URL.slice(0, -1)
      : process.env.NEXT_PUBLIC_API_URL;

    const url = `${apiUrl}/me/progress`;
    console.log("Fetching from URL:", url);

    const res = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to fetch progress:", {
        status: res.status,
        statusText: res.statusText,
        error: errorText,
      });
      return;
    }

    const data = await res.json();
    console.log("Progress response:", data);

    const progressList = data?.data || [];

    const progressForLesson = progressList.find(
      (p: any) => p.lessonId === lessonId
    );

    if (progressForLesson?.status === "COMPLETED") {
      console.log("Lesson is completed");
      setIsCompleted(true);
    } else {
      console.log("Lesson is not completed");
      setIsCompleted(false);
    }
  } catch (error) {
    console.error("Error checking lesson progress:", error);
  }
}


    startLesson(lessonId as string).catch(console.error);
    checkLessonProgress();

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

  // Make links clickable inside lesson content
  useEffect(() => {
    if (!lesson?.description) return;
    const container = document.querySelector(".prose");
    if (!container) return;

    const links = container.querySelectorAll("a.decorated-link");
    links.forEach((link) => {
      const el = link as HTMLAnchorElement;
      if (!el.getAttribute("href") && el.textContent?.startsWith("http")) {
        el.setAttribute("href", el.textContent.trim());
      }
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }, [lesson]);

  // Track time on lesson
  useEffect(() => {
    if (!lessonId) return;

    const TRACKING_INTERVAL = 15000;

    const intervalId = setInterval(() => {
      totalTimeRef.current += 15;
      trackTime(lessonId as string, 15).catch(console.error);
    }, TRACKING_INTERVAL);

    return () => {
      clearInterval(intervalId);
      trackTime(lessonId as string, 15).catch(console.error);
    };
  }, [lessonId]);

  const handleComplete = async () => {
    try {
      const response = await completeLesson(lessonId as string);
      console.log('Complete lesson response:', response);

      // Check for success in different possible response structures
      const isSuccess = 
        response?.status === 200 || 
        response?.satus === 200 ||
        response?.data?.status?.toUpperCase() === "COMPLETED" ||
        response?.status?.toUpperCase() === "COMPLETED";

      if (isSuccess) {
        setIsCompleted(true);
        toast.success("Lesson completed! Now take the quiz.");
      } else {
        console.error('Unexpected response format:', response);
        toast.error("Failed to complete lesson: Unexpected response format");
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast.error("Failed to complete lesson. Please try again.");
    }
  };

  const contentHtml = lesson?.description || "";

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-30">
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
            <LessonDetailSkeleton />
          ) : !lesson ? (
            <p className={textLight}>Lesson not found.</p>
          ) : (
            <div className="space-y-6">
              {/* Lesson Content */}
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
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleComplete}
                    disabled={isCompleted}
                    className={`px-4 py-2 rounded-lg w-full sm:w-auto text-white transition-all ${
                      isCompleted
                        ? "opacity-50 cursor-not-allowed bg-green-600"
                        : "bg-[#72a210] hover:bg-[#5c880d] cursor-pointer"
                    }`}
                  >
                    {isCompleted ? "Completed ✓" : "Mark as Complete"}
                  </button>
                </div>
              </div>

              {/* QUIZ SECTION */}
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

        <Nav />
      </div>
    </div>
  );
}
