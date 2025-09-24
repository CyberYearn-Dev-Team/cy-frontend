"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import { BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/breadcrumb";

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
  thumbnail?: string;
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
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Breadcrumb */}
          <Breadcrumb /> <br />

          {loading ? (
            <p className="text-gray-500">Loading track...</p>
          ) : !track ? (
            <p className="text-gray-500">Track not found.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left: Track info + modules */}
              <div className="lg:col-span-3 space-y-6">
                {/* Track Header */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-start gap-6">
                    {track.thumbnail && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || 'http://localhost:8055'}/assets/${track.thumbnail}`}
                        alt={track.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">{track.title}</h1>
                      <p className="text-gray-600 mb-4">{track.description}</p>

                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-2 py-1 rounded bg-gray-100 text-sm capitalize">
                          {track.level}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <BookOpen className="h-4 w-4" />
                          <span>{track.modules.length} modules</span>
                        </div>
                        <span className="text-sm text-gray-500">{track.duration}</span>
                      </div>

                      {/* Progress */}
                      {track.modules.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Overall Progress</span>
                            <span>
                              {Math.round(
                                track.modules.reduce(
                                  (sum, m) => sum + (m.progress || 0),
                                  0
                                ) / track.modules.length
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${Math.round(
                                  track.modules.reduce(
                                    (sum, m) => sum + (m.progress || 0),
                                    0
                                  ) / track.modules.length
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>



                {/* Modules */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-2">Modules</h2>
                  <p className="text-gray-500 mb-4">
                    Complete each module to master the essential skills.
                  </p>
                  {track.modules.length === 0 ? (
                    <p className="text-gray-500">
                      No modules published yet for this track.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {track.modules.map((module, index) => (
                        <div
                          key={module.id}
                          className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                            <span className="text-sm font-medium">{index + 1}</span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{module.title}</h3>
                              {module.status && (
                                <span className="text-xs px-2 py-1 rounded bg-gray-100">
                                  {module.status}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{module.description}</p>

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              {module.lessons && <span>{module.lessons} lessons</span>}
                              <span>{module.estimated_time}</span>
                              {module.xpReward && <span>{module.xpReward} XP</span>}
                            </div>

                            {module.progress && module.progress > 0 && (
                              <div className="mt-2 w-full bg-gray-200 h-1 rounded-full">
                                <div
                                  className="bg-blue-500 h-1 rounded-full"
                                  style={{ width: `${module.progress}%` }}
                                />
                              </div>
                            )}
                          </div>

                          <Link
                            href={`/learner-dashboard/tracks/${track.slug}/modules/${module.slug}`}
                            className="text-sm px-3 py-1 rounded bg-[#72a210] text-white hover:bg-[#5c880d]">
                            {module.status === "Completed"
                              ? "Review"
                              : module.status === "In Progress"
                              ? "Continue"
                              : "Start"}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>



              {/* Right: Progress & extras */}
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-semibold">Your Progress</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Track your achievements
                  </p>

                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-[#72a210]">
                      {track.modules.length > 0
                        ? Math.round(
                            track.modules.reduce(
                              (sum, m) => sum + (m.progress || 0),
                              0
                            ) / track.modules.length
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-gray-500">Complete</div>
                  </div>

                  {track.totalXp && (
                    <div className="flex justify-between text-sm mb-2">
                      <span>XP Earned</span>
                      <span className="font-medium">
                        {Math.round(
                          (track.totalXp *
                            (track.modules.reduce(
                              (sum, m) => sum + (m.progress || 0),
                              0
                            ) /
                              (100 * (track.modules.length || 1)))) || 0
                        )}
                        /{track.totalXp}
                      </span>
                    </div>
                  )}

                  {track.badges && track.badges.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1">Badges</div>
                      <div className="flex flex-wrap gap-2">
                        {track.badges.map((badge) => (
                          <span
                            key={badge}
                            className="px-2 py-1 rounded border text-xs text-gray-600"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {track.prerequisites && track.prerequisites.length > 0 && (
                  <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-2">Prerequisites</h2>
                    <ul className="list-disc list-inside text-sm text-gray-600">
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
      </div>
    </div>
  );
}
