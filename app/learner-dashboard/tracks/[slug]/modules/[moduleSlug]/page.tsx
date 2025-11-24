"use client";

import { useEffect, useState } from "react";
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
const borderLight = "border dark:border-gray-700";

interface Lesson {
  id: number;
  title: string;
  slug: string;
  description: string;
  estimated_time: string;
  order?: number;
}

interface Module {
  id: number;
  title: string;
  slug: string;
  description: string;
  lessons: Lesson[];
}

// Function to truncate HTML content to a word limit
function truncateHTMLContent(html: string, wordLimit: number) {
  if (!html) return '';
  // Remove HTML tags temporarily to count words
  const text = html.replace(/<[^>]+>/g, '');
  const words = text.split(/\s+/).filter(Boolean);

  if (words.length <= wordLimit) return html;

  // Take only the first `wordLimit` words
  const truncatedText = words.slice(0, wordLimit).join(' ') + '...';

  return truncatedText;
}

export default function ModuleDetailPage() {
  const { slug, moduleSlug } = useParams<{
    slug: string;
    moduleSlug: string;
  }>();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchModule() {
      try {
        const res = await fetch(
          `/api/tracks/${slug}/modules/${moduleSlug}/lessons`
        );
        const data = await res.json();
        setModule(data.module);
      } catch (err) {
        console.error("Error fetching module:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchModule();
  }, [slug, moduleSlug]);

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
                <BreadcrumbPage>Module</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <br />
          {loading ? (
            <p className={textLight}>Loading module...</p>
          ) : !module ? (
            <p className={textLight}>Module not found.</p>
          ) : (
            <div className="space-y-6">
              {/* Module Info */}
              <div className={`${cardBg} shadow rounded-lg p-6`}>
                <h1 className={`text-2xl font-bold ${textDark} mb-2`}>
                  {module.title}
                </h1>
                <div
                  className={`${textMedium} [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_ul>li]:mb-1 [&_ol>li]:mb-1 [&_a]:text-blue-500 [&_a]:hover:underline`}
                  dangerouslySetInnerHTML={{ __html: module.description }}
                />
              </div>


              {/* Lessons List */}
              <div className={`p-0 bg-transparent shadow-none lg:bg-white dark:lg:bg-gray-900 lg:shadow lg:rounded-lg lg:p-6`}>
                <h2 className={`text-xl font-semibold ${textDark} mb-2`}>
                  Lessons
                </h2>
                {module.lessons.length === 0 ? (
                  <p className={textLight}>No lessons yet.</p>
                ) : (
                  <div className="space-y-4">
                    {module.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className={`flex flex-col sm:flex-row items-center gap-4 p-4 ${borderLight} rounded-lg ${cardBg}`}
                      >
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 ${textMedium}`}>
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>

                        <div className="flex-1">
                          <h3 className={`font-semibold ${textDark} mb-2`}>
                            {lesson.title}
                          </h3>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: truncateHTMLContent(lesson.description, 50) }} />
                          </div>

                          <span className={`text-xs ${textLight}`}>
                            {lesson.estimated_time}
                          </span>
                        </div>

                        <Link
                            href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lesson.id}`}
                          className={`w-full sm:w-auto text-base px-5 py-2 rounded-lg bg-[${primary}] text-white hover:bg-[${primaryDarker}] text-center`}
                        >
                          Start Lesson
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
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
