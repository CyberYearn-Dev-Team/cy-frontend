"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Sidebar from "@/components/learner-sidebar";
import Header from "@/components/learner-header";
import Nav from "@/components/learner-nav";
import { ModuleDetailSkeleton } from "@/components/ui/ModuleDetailSkeleton";
import { startLabGuide } from "@/lib/services/labGuideService";

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
  lab_guides?: any[];
}

// Function to truncate HTML content to a word limit
function truncateHTMLContent(html: string, wordLimit: number) {
  if (!html) return "";
  // Remove HTML tags temporarily to count words
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.split(/\s+/).filter(Boolean);

  if (words.length <= wordLimit) return html;

  // Take only the first `wordLimit` words
  const truncatedText = words.slice(0, wordLimit).join(" ") + "...";

  return truncatedText;
}

export default function ModuleDetailPage() {
  const router = useRouter();
  const { slug, moduleSlug } = useParams<{
    slug: string;
    moduleSlug: string;
  }>();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [startingLab, setStartingLab] = useState<string | null>(null);

  useEffect(() => {
    async function fetchModule() {
      try {
        const [moduleRes, labGuidesRes] = await Promise.all([
          fetch(`/api/tracks/${slug}/modules/${moduleSlug}/lessons`),
          fetch(`/api/tracks/${slug}/modules/${moduleSlug}/lab-guides`)
        ]);
        
        const moduleData = await moduleRes.json();
        const labGuidesData = await labGuidesRes.json();
        
        setModule({
          ...moduleData.module,
          lab_guides: labGuidesData.lab_guides || []
        });
      } catch (err) {
        console.error("Error fetching module:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchModule();
  }, [slug, moduleSlug]);

  // For backend api to call start lesson
  async function startLesson(lessonId: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cy_token') : null;
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `https://cy-backend.onrender.com/api/v1/lessons/${lessonId}/start`,
      {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized (e.g., redirect to login)
        window.location.href = '/auth/login';
        return;
      }
      throw new Error('Failed to start lesson');
    }

    return response.json();
  }

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
            <ModuleDetailSkeleton />
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




              {/* Lessons section */}
              <div
                className={`p-0 bg-transparent shadow-none lg:bg-white dark:lg:bg-gray-900 lg:shadow lg:rounded-lg lg:p-6`}
              >
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
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 ${textMedium}`}
                        >
                          <span className="text-sm font-medium">
                            {index + 1}
                          </span>
                        </div>

                        <div className="flex-1">
                          <h3 className={`font-semibold ${textDark} mb-2`}>
                            {lesson.title}
                          </h3>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: truncateHTMLContent(
                                  lesson.description,
                                  50
                                ),
                              }}
                            />
                          </div>

                          <span className={`text-xs ${textLight}`}>
                            {lesson.estimated_time}
                          </span>
                        </div>

                        <button
                          className="w-full sm:w-auto text-base px-5 py-2 rounded-lg text-white text-center cursor-pointer"
                          style={{ backgroundColor: primary }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              primaryDarker)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = primary)
                          }
                          onClick={async () => {
                            try {
                              await startLesson(lesson.id.toString());
                              toast.success("Lesson started!", {
                                description: "You can now begin your lesson.",
                              });
                            } catch (error) {
                              console.error("Lesson start error:", error);
                              toast.error("Failed to start lesson", {
                                description:
                                  "Please try again or contact support if the issue persists.",
                              });
                              return; // Don't redirect if there was an error
                            }

                            router.push(
                              `/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lesson.id}`
                            );
                          }}
                        >
                          Start Lesson
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>



              {/* LAB GUIDE SECTION*/}
              <div
                className={`p-0 bg-transparent shadow-none lg:bg-white dark:lg:bg-gray-900 lg:shadow lg:rounded-lg lg:p-6`}
              >
                <h2 className={`text-xl font-semibold ${textDark} mb-2`}>
                  Lab Guide
                </h2>

                {/* Safety Notice */}
                {/* Safety & Ethics Warning */}
                <div className="bg-yellow-50 dark:bg-yellow-900/30 mb-5 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Labs must be performed on your{" "}
                    <strong>own local virtual machine</strong>. Do not target
                    external systems. Use these guides responsibly and
                    ethically.
                  </p>
                </div>

                {module.lab_guides && module.lab_guides.length > 0 && (
                  <div className="space-y-4">
                    {[...module.lab_guides].reverse().map((guide: any) => (
                      <div
                        key={guide.id}
                        className={`flex flex-col sm:flex-row items-center gap-4 p-4 ${borderLight} rounded-lg ${cardBg}`}
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
                                  50,
                                ),
                              }}
                            />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            •
                            <span className="ml-1 font-semibold uppercase">
                              {guide.levels || "ALL LEVELS"}
                            </span>{" "}
                            •
                            <span className="ml-1 font-semibold uppercase">
                              {guide.steps?.length || 0} steps
                            </span>
                          </p>
                        </div>

                        <button
                          onClick={async (e) => {
                            e.preventDefault();
                            try {
                              setStartingLab(guide.id);
                              await startLabGuide(guide.id);
                              toast.success("Lab guide started successfully!");
                              // Navigate after a short delay to show the success message
                              setTimeout(() => {
                                router.push(
                                  `/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lab-guide?labGuideId=${guide.id}`,
                                );
                              }, 1000);
                            } catch (error: any) {
                              console.error(
                                "Failed to start lab guide:",
                                error,
                              );
                              toast.error(
                                error.message ||
                                  "Failed to start lab guide. Please try again.",
                              );
                            } finally {
                              setStartingLab(null);
                            }
                          }}
                          disabled={!!startingLab}
                          className={`w-full sm:w-auto text-base px-5 py-2 rounded-lg text-white text-center ${
                            startingLab === guide.id
                              ? "opacity-70 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          style={{ backgroundColor: primary }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              primaryDarker)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = primary)
                          }
                        >
                          {startingLab === guide.id
                            ? "Starting..."
                            : "Start Lab Guide"}
                        </button>
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
