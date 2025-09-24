"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
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

  const filterOptions: string[] = ["All Tracks", "In Progress", "Completed"];
  const sortOptions: string[] = ["Activity", "Progress"];

  // Filtering logic
  const filteredTracks = tracks
    .filter((track) => {
      if (filter === "In Progress") return track.progress < 100 && track.progress > 0;
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
    <div className="flex h-screen overflow-hidden bg-gray-50">
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

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 space-y-8">
         {/* Stats Section */}
<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <div className="bg-white shadow rounded-xl p-4 flex flex-col items-center">
    <BarChart3 className="h-6 w-6 text-[#72a210]" />
    <p className="mt-2 text-2xl font-bold text-gray-800">44%</p>
    <p className="text-sm text-gray-500">Overall Progress</p>
  </div>
  <div className="bg-white shadow rounded-xl p-4 flex flex-col items-center">
    <BookOpen className="h-6 w-6 text-[#72a210]" />
    <p className="mt-2 text-2xl font-bold text-gray-800">4/9</p>
    <p className="text-sm text-gray-500">Modules Completed</p>
  </div>
  <div className="bg-white shadow rounded-xl p-4 flex flex-col items-center">
    <Award className="h-6 w-6 text-[#72a210]" />
    <p className="mt-2 text-2xl font-bold text-gray-800">2</p>
    <p className="text-sm text-gray-500">Tracks Completed</p>
  </div>
  <div className="bg-white shadow rounded-xl p-4 flex flex-col items-center">
    <BarChart3 className="h-6 w-6 text-[#72a210]" />
    <p className="mt-2 text-2xl font-bold text-gray-800">2</p>
    <p className="text-sm text-gray-500">Active Tracks</p>
  </div>
</div>


      {/* Search + Filter Bar */}
<div className="bg-white shadow rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
  {/* Search */}
  <div className="relative w-full sm:max-w-md">
    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search tracks and modules..."
      className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#72a210]"
    />
  </div>

  {/* Filters */}
  <div className="flex w-full sm:w-auto gap-2 justify-between sm:justify-end">
      {/* Filter Dropdown */}
      <div className="relative">
        <button
          onClick={() =>
            setFilterDropdown((prev) => !prev)
          }
          className="flex items-center justify-between w-40 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#72a210] cursor-pointer"
        >
          {filter}
          <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
        </button>
        {filterDropdown && (
          <div className="absolute mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setFilter(option);
                  setFilterDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                  filter === option ? "bg-gray-50 text-[#72a210]" : "text-gray-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sort Dropdown */}
<div className="relative">
  <button
    onClick={() => setSortDropdown((prev) => !prev)}
    className="flex items-center justify-between w-32 sm:w-40 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#72a210]"
  >
    Sort: {sort}
    <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
  </button>

  {sortDropdown && (
    <div className="absolute mt-1 w-32 sm:w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
      {sortOptions.map((option) => (
        <button
          key={option}
          onClick={() => {
            setSort(option);
            setSortDropdown(false);
          }}
          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
            sort === option ? "bg-gray-50 text-[#72a210]" : "text-gray-700"
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



          {/* Tracks List */}
          <div className="space-y-6">
            {sortedTracks.length > 0 ? (
              sortedTracks.map((track) => (
                <div key={track.id} className="bg-white shadow rounded-xl p-6">
                  {/* Track Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {track.title}
                    </h2>
                    <span className="text-sm font-semibold text-[#507800]">
                      {track.progress}%
                    </span>
                  </div>
                  {/* Track Progress */}
                  <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                    <div
                      className="h-2 rounded-full bg-[#72a210]"
                      style={{ width: `${track.progress}%` }}
                    />
                  </div>

                  {/* Modules */}
                  <div className="space-y-3">
                    {track.modules.map((mod, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center border rounded-lg p-3 cursor-pointer"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {mod.name}
                          </p>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2">
                            <div
                              className="h-1.5 rounded-full bg-[#72a210]"
                              style={{ width: `${mod.progress}%` }}
                            />
                          </div>
                        </div>
                        <button className="text-xs bg-[#72a210] text-white px-3 py-1 rounded-md hover:bg-[#507800]">
                          {mod.progress === 100 ? "Review" : "Continue"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No tracks found.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
