"use client";

import { useEffect, useState, useRef } from "react";
import { startLesson, trackTime } from "@/lib/services/progressService";
import { useParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/learner-sidebar";
import Header from "@/components/learner-header";
import Nav from "@/components/learner-nav";
import { LessonDetailSkeleton } from "@/components/ui/LessonDetailSkeleton";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const primary = "#72a210";
const primaryDarker = "#5c880d";
const bgLight = "bg-gray-100 dark:bg-gray-950";
const cardBg = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-300";
const textLight = "text-gray-500 dark:text-gray-400";
const borderLight = "border dark:border-gray-700";

interface Lesson {
  id: number;
  title: string;
  slug: string;
  description: string;
  estimated_time: string;
  lab_guides?: any[];
}

// Function to truncate HTML content to a word limit
function truncateHTMLContent(html: string, wordLimit: number) {
  if (!html) return "";
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.split(/\s+/).filter(Boolean);

  if (words.length <= wordLimit) return html;

  return words.slice(0, wordLimit).join(" ") + "...";
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
  const totalTimeRef = useRef(0);

  useEffect(() => {
    startLesson(lessonId).catch(console.error);

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

  useEffect(() => {
    if (!lessonId) return;

    const intervalId = setInterval(() => {
      totalTimeRef.current += 15;
      trackTime(lessonId as string, 15).catch(console.error);
    }, 15000);

    return () => {
      clearInterval(intervalId);
      trackTime(lessonId as string, 15).catch(console.error);
    };
  }, [lessonId]);

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
              </div>

              {/* LAB GUIDE SECTION (Updated Design) */}
              {lesson.lab_guides && lesson.lab_guides.length > 0 && (
                <div className="space-y-4">
                  {lesson.lab_guides.map((guide: any) => (
                    <div
                      key={guide.id}
                      className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg ${cardBg}`}
                    >
                      <div className="flex-1">
                        <h3 className={`font-semibold ${textDark} mb-2`}>
                          {guide.title}
                        </h3>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: truncateHTMLContent(
                                guide.description,
                                50
                              ),
                            }}
                          />
                        </div>
                      </div>

                      <Link
                        href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonId}/lab-guide`}
                        className="w-full sm:w-auto text-base px-5 py-2 rounded-lg text-white text-center"
                        style={{ backgroundColor: primary }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            primaryDarker)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = primary)
                        }
                      >
                        Start Lab Guide
                      </Link>
                    </div>
                  ))}
                </div>
              )}

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
