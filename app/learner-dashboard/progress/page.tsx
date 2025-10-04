"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import LearnerFooter from "@/components/ui/learner-footer";

import { Search, BarChart3, BookOpen, Award } from "lucide-react";

const tracks = [
  {
    id: 1,
    title: "Cyber Hygiene Essentials",
    progress: 75,
    modules: [
      { name: "Password Security & Management", progress: 100 },
      { name: "Multi-Factor Authentication", progress: 80 },
      { name: "Safe Browsing Practices", progress: 50 },
      { name: "Software Updates & Patches", progress: 30 },
    ],
  },
  {
    id: 2,
    title: "Network Security Fundamentals",
    progress: 40,
    modules: [
      { name: "Network Security Basics", progress: 60 },
      { name: "Firewalls & Intrusion Detection", progress: 40 },
      { name: "Network Monitoring & Analysis", progress: 20 },
    ],
  },
  {
    id: 3,
    title: "Phishing Detection & Prevention",
    progress: 100,
    modules: [
      { name: "Phishing Fundamentals", progress: 100 },
      { name: "Email Security Analysis", progress: 100 },
    ],
  },
];

export default function ProgressPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Tracks");
  const [sort, setSort] = useState("Activity");
  const [filterDropdown, setFilterDropdown] = useState<boolean>(false);
  const [sortDropdown, setSortDropdown] = useState<boolean>(false);
  const [openTrack, setOpenTrack] = useState<number | null>(null); // for collapsible tracks

  const filterOptions: string[] = ["All Tracks", "In Progress", "Completed"];
  const sortOptions: string[] = ["Activity", "Progress"];

  // Filtering logic
  const filteredTracks = tracks
    .filter((track) => {
      if (filter === "In Progress")
        return track.progress < 100 && track.progress > 0;
      if (filter === "Completed") return track.progress === 100;
      return true; // "All Tracks"
    })
    .filter((track) =>
      track.title.toLowerCase().includes(search.toLowerCase())
    );

  // Sorting logic
  const sortedTracks = [...filteredTracks].sort((a, b) => {
    if (sort === "Progress") return b.progress - a.progress;
    return b.id - a.id; // default: latest activity (higher id)
  });

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Content + Footer Wrapper */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Stats Section */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 flex flex-col items-center">
                <BarChart3 className="h-8 w-8 text-[#72a210]" />
                <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">0</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</p>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 flex flex-col items-center">
                <BookOpen className="h-8 w-8 text-[#72a210]" />
                <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">0</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Modules Tracks</p>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 flex flex-col items-center">
                <Award className="h-8 w-8 text-[#72a210]" />
                <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">0</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tracks Completed</p>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 flex flex-col items-center">
                <BarChart3 className="h-8 w-8 text-[#72a210]" />
                <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">0</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Tracks</p>
              </div>
            </div>

            {/* Search + Filter Bar */}
            <div className="rounded-xl flex flex-col sm:flex-row sm:items-center gap-4 w-full p-0 bg-transparent shadow-none">
              {/* Search */}
              <div className="relative w-full sm:basis-[70%] sm:flex-grow">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tracks and modules..."
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#72a210]"
                />
              </div>

              {/* Filters */}
              <div className="flex w-full sm:basis-[30%] sm:justify-end gap-2">
                {/* Filter Dropdown */}
                <div className="relative flex-1 sm:flex-none">
                  <button
                    onClick={() => setFilterDropdown((prev) => !prev)}
                    className="flex items-center justify-between w-full sm:w-40 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#72a210] cursor-pointer"
                  >
                    {filter}
                    <ChevronDown className="h-4 w-4 ml-2 text-gray-500 dark:text-gray-400" />
                  </button>
                  {filterDropdown && (
                    <div className="absolute mt-1 w-full sm:w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                      {filterOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setFilter(option);
                            setFilterDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            filter === option
                              ? "bg-gray-50 dark:bg-gray-700 text-[#72a210]"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative flex-1 sm:flex-none">
                  <button
                    onClick={() => setSortDropdown((prev) => !prev)}
                    className="flex items-center justify-between w-full sm:w-40 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#72a210]"
                  >
                    {sort}
                    <ChevronDown className="h-4 w-4 ml-2 text-gray-500 dark:text-gray-400" />
                  </button>

                  {sortDropdown && (
                    <div className="absolute mt-1 w-full sm:w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                      {sortOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSort(option);
                            setSortDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            sort === option
                              ? "bg-gray-50 dark:bg-gray-700 text-[#72a210]"
                              : "text-gray-700 dark:text-gray-200"
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

            {/* Collapsible Tracks */}
            <div className="space-y-4">
              {sortedTracks.length > 0 ? (
                sortedTracks.map((track) => (
                  <div
                    key={track.id}
                    className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden transition"
                  >
                    {/* Track Header */}
                   <button
  onClick={() =>
    setOpenTrack(openTrack === track.id ? null : track.id)
  }
  className="w-full flex flex-col gap-2 p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
>
  {/* Top row: Title + Progress */}
  <div className="flex w-full items-center justify-between">
  <h2 className="flex-1 text-left text-lg font-semibold text-gray-800 dark:text-gray-100">
    {track.title}
  </h2>
  <div className="flex items-center gap-2 flex-shrink-0">
    <span className="text-sm font-semibold text-[#507800]">
      {track.progress}%
    </span>
    {openTrack === track.id ? (
      <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
    ) : (
      <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
    )}
  </div>
</div>


  {/* Progress Bar always full width under title */}
  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
    <div
      className="h-2 rounded-full bg-[#72a210]"
      style={{ width: `${track.progress}%` }}
    />
  </div>
</button>


                    {/* Track Modules (collapsible body) */}
                    {openTrack === track.id && (
                      <div className="p-5 border-t border-gray-200 dark:border-gray-700 space-y-3 animate-fadeIn">
                        {track.modules.map((mod, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                {mod.name}
                              </p>
                              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
                                <div
                                  className="h-1.5 rounded-full bg-[#72a210]"
                                  style={{ width: `${mod.progress}%` }}
                                />
                              </div>
                            </div>
                            <button className="text-xs bg-[#72a210] text-white px-3 py-1 rounded-md hover:bg-[#507800] transition">
                              {mod.progress === 100 ? "Review" : "Continue"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No tracks found.
                </p>
              )}
            </div>
          </main>
          {/* Footer */}
          <LearnerFooter />
        </div>
      </div>
    </div>
  );
}
