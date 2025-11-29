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
} from "lucide-react";

import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import Nav from "@/components/ui/learner-nav";
import LearnerFooter from "@/components/ui/learner-footer";

export default function ProgressPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Tracks");
  const [sort, setSort] = useState("Activity");

  const [filterDropdown, setFilterDropdown] = useState(false);
  const [sortDropdown, setSortDropdown] = useState(false);

  const [openTrack, setOpenTrack] = useState<string | null>(null);
  
  const toggleTrack = (trackId: string) => {
    setOpenTrack(prev => prev === trackId ? null : trackId);
  };

  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const filterOptions = ["All Tracks", "In Progress", "Completed"];
  const sortOptions = ["Activity", "Progress"];

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch(
          "https://cy-backend.onrender.com/api/v1/me/progress/summary",
          { credentials: "include" }
        );

        const json = await res.json();
        setSummary(json.data);
      } catch (error) {
        console.error("Error loading progress:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, []);

  const tracks = summary?.trackProgress || [];

  const filteredTracks = tracks
    .filter((track: any) => {
      if (filter === "In Progress") return track.status === "IN_PROGRESS";
      if (filter === "Completed") return track.status === "COMPLETED";
      return true;
    })
    .filter((track: any) =>
      track.title.toLowerCase().includes(search.toLowerCase())
    );

  const sortedTracks = [...filteredTracks].sort((a, b) => {
    if (sort === "Progress") return b.progress - a.progress;
    return b.title.localeCompare(a.title);
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
                  <Layers className="h-8 w-8 text-[#72a210]" />
                  <p className="mt-2 text-2xl font-bold">{summary.totalTracks}</p>
                  <p className="text-sm text-gray-500">Total Tracks</p>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 flex flex-col items-center">
                  <Loader className="h-8 w-8 text-[#72a210] animate-spin" />
                  <p className="mt-2 text-2xl font-bold">
                    {summary.inProgressTracks}
                  </p>
                  <p className="text-sm text-gray-500">In Progress</p>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 flex flex-col items-center">
                  <BookCheck className="h-8 w-8 text-[#72a210]" />
                  <p className="mt-2 text-2xl font-bold">
                    {summary.completedTracks}
                  </p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 flex flex-col items-center">
                  <Inbox className="h-8 w-8 text-[#72a210]" />
                  <p className="mt-2 text-2xl font-bold">
                    {summary.notStartedTracks}
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
                            <div className="flex w-full sm:basis-[50%] sm:justify-end gap-2">

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse ">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white/70 dark:bg-gray-800/50 h-32 rounded-xl shadow"
                  ></div>
                ))}
              </div>
            ) : (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start auto-rows-auto">
                {sortedTracks.length > 0 ? (
                  sortedTracks.map((track: any) => (
                    <div
                      key={track.trackId}
                      className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleTrack(track.trackId)}
                        className="w-full p-5 flex flex-col gap-2"
                      >
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold">
                            {track.title}
                          </h2>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#507800]">
                              {track.progress}%
                            </span>

                            {openTrack === track.trackId ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>

                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-[#72a210] rounded-full"
                            style={{ width: `${track.progress}%` }}
                          />
                        </div>
                      </button>

                      <div
  className={`transition-all duration-300 ease-in-out overflow-hidden cursor-pointer ${
    openTrack === track.trackId
      ? "max-h-[1000px] opacity-100"
      : "max-h-0 opacity-0"
  }`}
>
  <div className="p-5 border-t border-gray-200 dark:border-gray-700 grid gap-3">
    <p className="text-sm text-gray-500">
      Total Lessons: {track.totalLessons}
    </p>

    <p className="text-sm text-gray-500">
      Completed Lessons: {track.completedLessons}
    </p>

    {track.modules?.map((module: any, index: number) => (
      <div
        key={index}
        className="flex justify-between items-center border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        <div className="flex-1 pr-4">
          <p className="text-sm font-medium">{module.name}</p>

          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full mt-2">
            <div
              className="h-1.5 bg-[#72a210] rounded-full"
              style={{ width: `${module.progress || 0}%` }}
            />
          </div>

          <p className="text-xs text-gray-500 mt-1">
            {module.progress || 0}% complete
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500">
                    No tracks found.
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
