"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Layers,
  Loader,
  Inbox,
  BookCheck,
  CheckCircle,
  Clock,
  Circle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";

import Sidebar from "@/components/learner-sidebar";
import Header from "@/components/learner-header";
import Nav from "@/components/learner-nav";
import LearnerFooter from "@/components/learner-footer";
import { progressService } from "@/lib/api/progress";


// Theme Constants
const primary = "#72a210";
const primaryDarker = "#5a850d";
const primarySecondary = "#507800";

const bgLight = "bg-white dark:bg-gray-950";
const cardBg = "bg-gray-50 dark:bg-gray-900";

const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-700 dark:text-gray-300";
const textLight = "text-gray-500 dark:text-gray-400";

// Define the Directus URL constant
const DIRECTUS_URL = "https://cy-directus.onrender.com";

// Type definitions for clarity
interface LessonProgress {
  lessonId: string;
  title: string;
  status: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";
  thumbnail: string;
  // Add other lesson properties as needed
}

interface ModuleProgress {
  moduleId: string;
  title: string;
  status: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";
  lessons: LessonProgress[];
}

interface TrackProgress {
  trackId: string;
  title: string;
  description: string;
  thumbnail: string;
  status: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";
  progress: number;
  completedLessons: number;
  totalLessons: number;
  completedModules: number;
  totalModules: number;
  slug: string;
}

interface SummaryData {
  totalTracks: number;
  inProgressTracks: number;
  completedTracks: number;
  notStartedTracks: number;
  trackProgress: TrackProgress[];
}

// Helper component for rendering a single track
const TrackCard: React.FC<{
  track: TrackProgress;
  openTrack: string | null;
  toggleTrack: (id: string) => void;
}> = ({ track, openTrack, toggleTrack }) => {
  const isTrackOpen = openTrack === track.trackId;

  const router = useRouter();

  const handleStartTrack = async (e: React.MouseEvent, trackId: string) => {
    e?.stopPropagation?.();
    const toastId = toast.loading('Loading track...');
    const trackSlug = track.slug;

    try {
      const { data } = await apiClient.post(`/tracks/${trackId}/start`);
      toast.success(data.message || 'Track loaded successfully!', { id: toastId });
    } catch (error) {
      console.error('Error starting track:', error);
      toast.dismiss(toastId);
      toast.error('Failed to start track. Please try again.');
    } finally {
      if (trackSlug) {
        router.push(`/learner-dashboard/tracks/${trackSlug}`);
      }
    }
  };

  // Function to determine the icon based on lesson status
  const getLessonIcon = (status: LessonProgress["status"]) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-[#72a210]" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "NOT_STARTED":
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden hover:shadow-lg transition">
      {/* Thumbnail Section */}
      <div className="h-40 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          // FIX: Use DIRECTUS_URL for the thumbnail
          src={`${DIRECTUS_URL}/assets/${track.thumbnail}`}
          alt={track.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold line-clamp-2">{track.title}</h2>
          <span className="text-sm font-semibold text-[#507800]">
            {track.progress}%
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {track.description?.replace(/<[^>]+>/g, "")}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
          <div
            style={{ width: `${track.progress}%` }}
            className="h-full bg-[#72a210] transition-all"
          ></div>
        </div>

        <div className="mt-2 flex justify-between items-center text-sm text-gray-700 dark:text-gray-300">
          <p>
            {track.completedLessons}/{track.totalLessons} lessons
          </p>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {track.totalModules ?? 0} Modules
          </p>
        </div>

        {/* View Track Button */}
        <div className="mt-4">
          <button
            onClick={(e) => handleStartTrack(e, track.trackId)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{
              backgroundColor: primary,
              color: "white",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = primaryDarker)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = primary)
            }
          >
            View Track
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProgressPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Tracks");
  const [sort, setSort] = useState("Activity");

  const [filterDropdown, setFilterDropdown] = useState(false);
  const [sortDropdown, setSortDropdown] = useState(false);

  // The state and function for toggling modules are no longer used but kept for completeness in ProgressPage
  const [openTrack, setOpenTrack] = useState<string | null>(null);

  const toggleTrack = (trackId: string) => {
    setOpenTrack((prev) => (prev === trackId ? null : trackId));
  };

  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const filterOptions = ["All Tracks", "In Progress", "Completed"];
  const sortOptions = ["Activity", "Progress"];

  useEffect(() => {
    async function loadProgress() {
      try {
        const data = await progressService.getProgressSummary();
        setSummary(data.data);
      } catch (error) {
        console.error("Error loading progress:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, []);

  const tracks: TrackProgress[] = summary?.trackProgress || [];

  const filteredTracks = tracks
    .filter((track: TrackProgress) => {
      if (filter === "In Progress") return track.status === "IN_PROGRESS";
      if (filter === "Completed") return track.status === "COMPLETED";
      return true;
    })
    .filter((track: TrackProgress) =>
      track.title.toLowerCase().includes(search.toLowerCase())
    );

  const sortedTracks = [...filteredTracks].sort((a, b) => {
    if (sort === "Progress") return b.progress - a.progress;
    // Assuming "Activity" means sorting by title alphabetically if not explicitly defined
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
            {/* ----------- Stats ----------- */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white/80 dark:bg-gray-800/50 shadow rounded-xl p-4 h-24"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 flex flex-col items-center">
                  <Loader className="h-8 w-8 text-[#72a210]" />
                  <p className="mt-2 text-2xl font-bold">
                    {summary?.inProgressTracks ?? 0}
                  </p>
                  <p className="text-sm text-gray-500">In Progress</p>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 flex flex-col items-center">
                  <Layers className="h-8 w-8 text-[#72a210]" />
                  <p className="mt-2 text-2xl font-bold">
                    {summary?.totalTracks ?? 0}
                  </p>
                  <p className="text-sm text-gray-500">Total Tracks</p>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 flex flex-col items-center">
                  <BookCheck className="h-8 w-8 text-[#72a210]" />
                  <p className="mt-2 text-2xl font-bold">
                    {summary?.completedTracks ?? 0}
                  </p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 flex flex-col items-center">
                  <Inbox className="h-8 w-8 text-[#72a210]" />
                  <p className="mt-2 text-2xl font-bold">
                    {summary?.notStartedTracks ?? 0}
                  </p>
                  <p className="text-sm text-gray-500">Not Started</p>
                </div>
              </div>
            )}

            {/* ----------- Search + Filter Bar ----------- */}
            <div className="rounded-xl flex flex-col sm:flex-row sm:items-center gap-4 w-full p-0 bg-transparent shadow-none">
              <div className="relative w-full sm:basis-[50%]">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tracks..."
                  className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-800"
                />
              </div>

              {/* FILTER DROPDOWN */}
              <div className="flex w-full justify-between sm:basis-[50%] sm:justify-end gap-2">
                <div className="relative">
                  <button
                    onClick={() => setFilterDropdown((prev) => !prev)}
                    className="flex items-center justify-between w-40 border rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 cursor-pointer"
                  >
                    {filter}
                    <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
                  </button>

                  {filterDropdown && (
                    <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-10">
                      {filterOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setFilter(option);
                            setFilterDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            filter === option ? "text-[#72a210]" : ""
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* SORT DROPDOWN */}
                <div className="relative">
                  <button
                    onClick={() => setSortDropdown((prev) => !prev)}
                    className="flex items-center justify-between w-40 border rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 cursor-pointer"
                  >
                    {sort}
                    <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
                  </button>

                  {sortDropdown && (
                    <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-10">
                      {sortOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSort(option);
                            setSortDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            sort === option ? "text-[#72a210]" : ""
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ----------- TRACK LIST ----------- */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white/70 dark:bg-gray-800/50 h-40 rounded-xl shadow"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
                {sortedTracks.length > 0 ? (
                  sortedTracks.map((track) => (
                    <TrackCard
                      key={track.trackId}
                      track={track}
                      openTrack={openTrack}
                      toggleTrack={toggleTrack}
                    />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                    No tracks found matching your criteria.
                  </p>
                )}
              </div>
            )}
          </main>

          <Nav />
          <LearnerFooter />
        </div>
      </div>
    </div>
  );
}
