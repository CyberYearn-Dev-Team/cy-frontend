"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import Nav from "@/components/ui/learner-nav";

import { BookOpen } from "lucide-react";
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

interface Module {
  id: number;
  title: string;
  slug: string;
  description: string;
  lessons?: number;
  estimated_time: string;
  xpReward?: number;
  progress?: number; // 0–100
  status?: "Not Started" | "In Progress" | "Completed";
  order?: number;
}

interface Track {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string | { id: string };
  level: string;
  topic: string;
  duration: string;
  totalXp?: number;
  badges?: string[];
  prerequisites?: string[];
  modules: Module[];
}

export default function TrackDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Derived safe module list and progress values (handles null entries)
  const validModules = (track?.modules || []).filter(
    (m) => m != null
  ) as Module[];
  const moduleCount = validModules.length;
  const totalProgressSum = validModules.reduce(
    (sum, m) => sum + (m?.progress ?? 0),
    0
  );
  const overallPercent =
    moduleCount > 0 ? Math.round(totalProgressSum / moduleCount) : 0;

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await fetch(`/api/tracks/${slug}`);
        const data = await res.json();
        setTrack(data.track);
      } catch (err) {
        console.error("Error fetching track:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrack();
  }, [slug]);

  return (
    // Applied dark mode background
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
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
            <p className={textLight}>Loading track...</p>
          ) : !track ? (
            <p className={textLight}>Track not found.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left: Track info + modules */}
              <div className="lg:col-span-3 space-y-6">
                {/* Track Header */}
                <div
                  className={`${cardBg} shadow-lg rounded-2xl overflow-hidden`}
                >
                  {/* Thumbnail */}
                  {track.thumbnail && (
                    <div className="relative w-full aspect-[16/9] overflow-hidden">
                      <img
                        src={`${
                          process.env.DIRECTUS_URL ||
                          "https://cy-directus.onrender.com"
                        }/assets/${
                          typeof track.thumbnail === "string"
                            ? track.thumbnail
                            : track.thumbnail?.id
                        }`}
                        alt={track.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Optional overlay gradient for contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  )}

                  {/* Text content */}
<div className="p-4 sm:px-[20px] space-y-5">
                    <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${textDark}`}>
  {track.title}
</h1>

                    <p className={`${textMedium}`}>{track.description}</p>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 ${textMedium} text-sm capitalize`}
                      >
                        {track.level}
                      </span>
                      <div
                        className={`flex items-center gap-1 text-sm ${textLight}`}
                      >
                        <BookOpen className={`h-4 w-4 text-[${primary}]`} />
                        <span>{moduleCount} modules</span>
                      </div>
                      <span className={`text-sm ${textLight}`}>
                        {track.duration}
                      </span>
                    </div>

                    {/* Progress */}
                    {moduleCount > 0 && (
                      <div className="pt-2">
                        <div
                          className={`flex items-center justify-between text-sm ${textMedium} mb-1`}
                        >
                          <span>Overall Progress</span>
                          <span>{overallPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`bg-[${primary}] h-2 rounded-full`}
                            style={{ width: `${overallPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>



                {/* Modules */}
                {/* Applied card background and padding for consistency */}
                <div
                  className={`p-0 bg-transparent shadow-none lg:bg-white dark:lg:bg-gray-900 lg:shadow lg:rounded-lg lg:p-6`}
                >
                  <h2 className={`text-xl font-semibold ${textDark} mb-2`}>
                    Modules
                  </h2>
                  <p className={`${textLight} mb-4`}>
                    Complete each module to master the essential skills.
                  </p>
                  {moduleCount === 0 ? (
                    <p className={textLight}>
                      No modules published yet for this track.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {validModules.map((module, index) => (
                        <div
                          key={module.id}
                          // Applied dark mode background/border for each module card
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
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-semibold ${textDark}`}>
                                {module.title}
                              </h3>
                              {module.status && (
                                <span
                                  className={`text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 ${textLight}`}
                                >
                                  {module.status}
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-sm ${textMedium} mb-2 line-clamp-3`}
                            >
                              {module.description}
                            </p>

                            <div
                              className={`flex items-center gap-4 text-xs ${textLight}`}
                            >
                              {Array.isArray(module.lessons) && (
                                <span>{module.lessons.length} lessons</span>
                              )}

                              <span>{module.estimated_time}</span>
                              {module.xpReward && (
                                <span>{module.xpReward} XP</span>
                              )}
                            </div>

                            {module.progress && module.progress > 0 && (
                              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full">
                                <div
                                  className={`bg-[${primary}] h-1 rounded-full`}
                                  style={{ width: `${module.progress}%` }}
                                />
                              </div>
                            )}
                          </div>

                          <Link
                            href={`/learner-dashboard/tracks/${track.slug}/modules/${module.slug}`}
                            className={`w-full sm:w-auto text-base px-5 py-2 rounded-lg bg-[${primary}] text-white hover:bg-[${primaryDarker}] text-center`}
                          >
                            {module.status === "Completed"
                              ? "Review"
                              : module.status === "In Progress"
                              ? "Continue"
                              : "Start Module"}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Progress & extras */}
              <div className="space-y-6">
                <div className={`${cardBg} shadow rounded-lg p-6`}>
                  <h2 className={`text-lg font-semibold ${textDark}`}>
                    Your Progress
                  </h2>
                  <p className={`text-sm ${textLight} mb-4`}>
                    Track your achievements
                  </p>

                  <div className="text-center mb-4">
                    <div className={`text-2xl font-bold text-[${primary}]`}>
                      {moduleCount > 0 ? overallPercent : 0}%
                    </div>
                    <div className={`text-sm ${textLight}`}>Complete</div>
                  </div>

                  {track.totalXp && (
                    <div
                      className={`flex justify-between text-sm ${textMedium} mb-2`}
                    >
                      <span>XP Earned</span>
                      <span className="font-medium">
                        {Math.round(
                          track.totalXp *
                            (totalProgressSum / (100 * (moduleCount || 1))) || 0
                        )}
                        /{track.totalXp}
                      </span>
                    </div>
                  )}

                  {track.badges && track.badges.length > 0 && (
                    <div>
                      <div className={`text-sm font-medium ${textDark} mb-1`}>
                        Badges
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {track.badges.map((badge) => (
                          <span
                            key={badge}
                            className={`px-2 py-1 rounded ${borderLight} text-xs ${textMedium}`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {track.prerequisites && track.prerequisites.length > 0 && (
                  <div className={`${cardBg} shadow rounded-lg p-6`}>
                    <h2 className={`text-lg font-semibold ${textDark} mb-2`}>
                      Prerequisites
                    </h2>
                    <ul
                      className={`list-disc list-inside text-sm ${textMedium}`}
                    >
                      {track.prerequisites.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
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
