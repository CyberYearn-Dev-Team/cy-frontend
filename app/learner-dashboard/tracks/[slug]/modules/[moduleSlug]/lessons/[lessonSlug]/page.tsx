"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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



// Theme Constants
const primary = "#72a210";
const primaryDarker = "#5c880d";
const bgLight = "bg-gray-100 dark:bg-gray-950"; // Main page background
const cardBg = "bg-white dark:bg-gray-900"; // Card background
const textDark = "text-gray-900 dark:text-gray-100"; // Headings/Strong text
const textMedium = "text-gray-600 dark:text-gray-300"; // Body text
const textLight = "text-gray-500 dark:text-gray-400"; // Placeholder/Subtle text
const borderLight = "border dark:border-gray-700";

// Interfaces
interface Lab {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  xp: number;
  time: string;
}

interface Lesson {
  id: number;
  title: string;
  slug: string;
  content: string;
  estimated_time: string;
  order?: number;
  labs?: Lab[];
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

  return (
    // Applied dark mode background
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
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
                {/* Applied dark mode styles to the prose for content */}
                <div className="prose max-w-none dark:prose-invert">
                  {/* Assuming lesson.content is HTML or markdown */}
                  <div
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  />
                </div>
              </div>

              {/* Labs Section */}
              {lesson.labs && lesson.labs.length > 0 && (
                // Applied card background and padding for consistency
                <div className={`p-0 bg-transparent shadow-none lg:bg-white dark:lg:bg-gray-900 lg:shadow lg:rounded-lg lg:p-6`}>
                  <h2 className={`text-xl font-semibold ${textDark} mb-2`}>
                    Labs
                  </h2>
                  <div className="space-y-4">
                    {lesson.labs.map((lab) => (
                      <div
                        key={lab.id}
                        // Applied dark mode background/border for each lab card
                        className={`flex flex-col sm:flex-row items-start gap-4 p-4 ${borderLight} rounded-lg ${cardBg}`}
                      >
                        <div className="flex-1">
                          <h3 className={`font-semibold ${textDark}`}>
                            {lab.title}
                          </h3>
                          <p className={`text-sm ${textMedium}`}>
                            {lab.description}
                          </p>
                          <span className={`text-xs ${textLight} block mt-1`}>
                            {lab.difficulty} • {lab.time} • {lab.xp} XP
                          </span>
                        </div>

                        <Link
                          href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonSlug}/labs/${lab.slug}`}
                          // Applied theme color to button
                          className={`w-full sm:w-auto text-base px-5 py-2 rounded-lg bg-[${primary}] text-white hover:bg-[${primaryDarker}] text-center`}
                        >
                          Start Lab
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}