"use client";

import React, { useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight, FaSortAlphaDown, FaSortAlphaUp, FaSortNumericDown, FaSortNumericUp } from "react-icons/fa"; // Added sort icons
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import Nav from "@/components/ui/learner-nav";
import LearnerFooter from "@/components/ui/learner-footer";

interface Learner {
  id: number;
  name: string;
  xp: number;
  rank: number;
  joined: string;
}

// Define types for sort state
type SortKey = keyof Learner;
type SortDirection = 'asc' | 'desc';

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[1][0]).toUpperCase();
}

const trophyImages: Record<number, string> = {
  1: "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/Leaderboard%201.png",
  2: "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/Leaderboard%202.png",
  3: "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/Leaderboard%203.png",
};

export default function LeaderboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const pageSize = 7;

  // Filtering state
  const [filter, setFilter] = useState("all");

  // --- NEW SORTING STATE ---
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const topLearners: Learner[] = [
    { id: 2, name: "Jolie", xp: 9500, rank: 2, joined: "Apr 15, 2025" },
    { id: 1, name: "Mike Johnson", xp: 15000, rank: 1, joined: "Mar 10, 2025" },
    { id: 3, name: "Jake", xp: 7200, rank: 3, joined: "May 02, 2025" },
  ];

  const allLearners: Learner[] = [
    { id: 4, name: "Elizabeth Stone", xp: 6000, rank: 4, joined: "Apr 20, 2025" },
    { id: 5, name: "Kyle", xp: 5200, rank: 5, joined: "Jan 21, 2025" },
    { id: 6, name: "Sophia Grace", xp: 4800, rank: 6, joined: "Feb 18, 2025" },
    { id: 7, name: "Daniel", xp: 4200, rank: 7, joined: "Mar 05, 2025" },
    { id: 8, name: "Maya Lee", xp: 3900, rank: 8, joined: "May 01, 2025" },
    { id: 9, name: "Kingsley Smith", xp: 3500, rank: 9, joined: "Jun 12, 2025" },
    { id: 10, name: "Chris Brown", xp: 3200, rank: 10, joined: "Jun 18, 2025" },
    { id: 11, name: "Angela", xp: 3100, rank: 11, joined: "Jul 01, 2025" },
    { id: 12, name: "Robert", xp: 3000, rank: 12, joined: "Jul 05, 2025" },
    { id: 13, name: "Alice", xp: 2900, rank: 13, joined: "Jul 10, 2025" },
    { id: 14, name: "Brian", xp: 2800, rank: 14, joined: "Jul 15, 2025" },
    { id: 15, name: "Henry", xp: 2700, rank: 15, joined: "Jul 20, 2025" },
    { id: 16, name: "Fiona", xp: 2600, rank: 16, joined: "Jul 22, 2025" },
    { id: 17, name: "Lucy", xp: 2500, rank: 17, joined: "Jul 24, 2025" },
    { id: 18, name: "George", xp: 2400, rank: 18, joined: "Jul 26, 2025" },
    { id: 19, name: "Tom", xp: 2300, rank: 19, joined: "Jul 28, 2025" },
    { id: 20, name: "Victor", xp: 2200, rank: 20, joined: "Jul 30, 2025" },
  ];

  /**
   * Universal function to handle sorting when a column header is clicked.
   */
  const handleSort = (key: SortKey) => {
    setPage(0); // Reset to first page on new sort

    if (sortKey === key) {
      // Toggle direction if the same column is clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column is clicked: set new key and default to descending (for ranks/scores)
      setSortKey(key);
      // Default to descending for 'xp' and 'rank', and ascending for 'name' and 'joined'
      setSortDirection(key === 'xp' || key === 'rank' ? 'desc' : 'asc');
    }
  };

  /**
   * Memoized array for filtering AND sorting. This runs only when
   * allLearners, filter, sortKey, or sortDirection changes.
   */
  const processedLearners = useMemo(() => {
    let list = [...allLearners];

    // 1. FILTERING
    list = list.filter((learner) => {
      // Note: This filter is based on the *original* rank, which is fine for "top X learners" filters.
      if (filter === "7days") return learner.rank <= 7;
      if (filter === "30days") return learner.rank <= 15;
      return true;
    });

    // 2. SORTING
    list.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      let comparison = 0;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (sortKey === 'name') {
        comparison = String(aValue).localeCompare(String(bValue));
      } else if (sortKey === 'joined') {
        // Date comparison
        const aTime = new Date(String(aValue)).getTime();
        const bTime = new Date(String(bValue)).getTime();
        comparison = aTime - bTime;
      }

      // Apply descending order if needed
      return sortDirection === 'asc' ? comparison : comparison * -1;
    });

    return list;
  }, [allLearners, filter, sortKey, sortDirection]);

  // 3. PAGINATION
  const filteredAndSortedLearners = processedLearners;
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageLearners = filteredAndSortedLearners.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredAndSortedLearners.length / pageSize);


  // Component to render the sort icon based on key and direction
  const SortIcon: React.FC<{ columnKey: SortKey }> = ({ columnKey }) => {
    if (sortKey !== columnKey) return null;

    if (columnKey === 'name') {
        return sortDirection === 'asc' 
            ? <FaSortAlphaUp className="ml-1 inline-block text-[#507800]" /> 
            : <FaSortAlphaDown className="ml-1 inline-block text-[#507800]" />;
    }
    
    // Default for numbers (rank, xp) and dates (joined)
    return sortDirection === 'asc'
        ? <FaSortNumericUp className="ml-1 inline-block text-[#507800]" /> 
        : <FaSortNumericDown className="ml-1 inline-block text-[#507800]" />;
  };


  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-10">
              Leaderboard
            </h1>

           {/* Top 3 Learners (Responsive + Scrollable on Small Screens, no cutting off) */}
<div className="w-full overflow-x-auto overflow-y-visible py-6">
  <div className="flex justify-center items-end gap-6 mb-10 max-w-6xl mx-auto sm:justify-center sm:flex-nowrap min-w-max px-4">
    {topLearners.map((learner) => (
      <div
        key={learner.id}
        className={`relative rounded-2xl shadow-md flex flex-col items-center transform flex-shrink-0 ${
          learner.rank === 1
            ? "bg-gradient-to-br from-[#72a210] to-[#507800] text-white p-8 w-64 md:w-80"
            : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 w-56 md:w-72"
        } ${learner.rank === 2 || learner.rank === 3 ? "translate-y-8" : ""}`}
      >
        {trophyImages[learner.rank] && (
          <img
            src={trophyImages[learner.rank]}
            alt={`Rank ${learner.rank} trophy`}
            className="absolute -top-5 -right-2 w-20 h-16 md:w-25 md:h-20"
          />
        )}

        <div
          className={`rounded-full flex items-center justify-center shadow mb-4 ${
            learner.rank === 1
              ? "w-24 h-24 md:w-28 md:h-28 bg-white/20 text-white text-3xl md:text-4xl font-bold"
              : "w-20 h-20 md:w-24 md:h-24 bg-[#72a210]/10 dark:bg-[#72a210]/20 text-[#507800] dark:text-[#a3e635] text-2xl md:text-3xl font-bold"
          }`}
        >
          {getInitials(learner.name)}
        </div>

        <h3
          className={`font-semibold ${
            learner.rank === 1
              ? "text-lg"
              : "text-lg md:text-xl text-gray-800 dark:text-gray-200"
          }`}
        >
          {learner.name.split(" ")[0]}
        </h3>

        <p
          className={`mt-2 font-bold ${
            learner.rank === 1
              ? "text-white text-xl md:text-2xl"
              : "text-[#507800] dark:text-[#a3e635] text-base md:text-lg"
          }`}
        >
          {learner.xp.toLocaleString()} XP
        </p>

        <div
          className={`mt-3 flex items-center justify-center font-bold ${
            learner.rank === 1
              ? "w-12 h-12 md:w-14 md:h-14 rounded-lg bg-white text-[#507800] text-xl md:text-2xl"
              : "w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#72a210] text-white"
          }`}
        >
          {learner.rank}
        </div>
      </div>
    ))}
  </div>
</div>


            {/* Divider */}
            <div className="max-w-6xl mx-auto mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
            </div>

            {/* Filter buttons */}
            <div className="max-w-6xl mx-auto mb-6 flex gap-3 justify-end">
              {["7days", "30days", "all"].map((key) => (
                <button
                  key={key}
                  className={`px-3 py-1 text-sm md:px-4 md:py-2 rounded-lg border cursor-pointer ${
                    filter === key
                      ? "bg-[#72a210] text-white border-[#72a210]"
                      : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() => {
                    setFilter(key);
                    setPage(0);
                  }}
                >
                  {key === "7days"
                    ? "7 Days"
                    : key === "30days"
                    ? "30 Days"
                    : "All Time"}
                </button>
              ))}
            </div>



            {/* ✅ Responsive Scrollable Leaderboard Table */}
<div className="max-w-6xl mx-auto overflow-x-auto overflow-y-hidden rounded-xl scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
  <table className="min-w-max w-full bg-white dark:bg-gray-900 shadow rounded-xl overflow-hidden">
    <thead>
      <tr className="text-gray-600 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-gray-700">
        {/* --- SORTABLE HEADER: RANK --- */}
        <th
          className="text-left py-4 px-6 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
          onClick={() => handleSort('rank')}
        >
          Rank<SortIcon columnKey="rank" />
        </th>

        {/* --- SORTABLE HEADER: LEARNER --- */}
        <th
          className="text-left py-4 px-6 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[150px] whitespace-nowrap"
          onClick={() => handleSort('name')}
        >
          Learner<SortIcon columnKey="name" />
        </th>

        {/* --- SORTABLE HEADER: XP EARNED --- */}
        <th
          className="text-left py-4 px-6 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
          onClick={() => handleSort('xp')}
        >
          XP Earned<SortIcon columnKey="xp" />
        </th>

        {/* --- SORTABLE HEADER: JOINED --- */}
        <th
          className="text-left py-4 px-6 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
          onClick={() => handleSort('joined')}
        >
          Joined<SortIcon columnKey="joined" />
        </th>
      </tr>
    </thead>

    <tbody>
      {currentPageLearners.map((learner) => (
        <tr
          key={learner.id}
          className="border-b border-gray-100 dark:border-gray-700 hover:bg-[#72a210]/10 dark:hover:bg-[#72a210]/20 transition-colors cursor-pointer"
        >
          <td className="py-4 px-6 text-gray-800 dark:text-gray-200 font-semibold whitespace-nowrap">
            {sortKey === 'rank'
              ? learner.rank
              : startIndex + processedLearners.indexOf(learner) + 1}
          </td>

          <td className="py-4 px-6 whitespace-nowrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#72a210]/10 dark:bg-[#72a210]/20 flex items-center justify-center text-[#507800] dark:text-[#a3e635] font-bold flex-shrink-0">
                {getInitials(learner.name)}
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {learner.name}
              </span>
            </div>
          </td>

          <td className="py-4 px-6 font-semibold text-[#507800] dark:text-[#a3e635] whitespace-nowrap">
            {learner.xp.toLocaleString()} XP
          </td>

          <td className="py-4 px-6 text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {learner.joined}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>




            {/* Pagination controls */}
            <div className="max-w-6xl mx-auto mt-6 flex justify-center gap-4 items-center">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className={`p-3 rounded-full border cursor-pointer ${
                  page === 0
                    ? "bg-gray-200 dark:bg-gray-800 cursor-not-allowed"
                    : "bg-[#72a210] text-white hover:bg-[#507800]"
                }`}
              >
                <FaChevronLeft />
              </button>

              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Page {page + 1} of {totalPages || 1}
              </span>

              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className={`p-3 rounded-full border cursor-pointer ${
                  page + 1 >= totalPages
                    ? "bg-gray-200 dark:bg-gray-800 cursor-not-allowed"
                    : "bg-[#72a210] text-white hover:bg-[#507800]"
                }`}
              >
                <FaChevronRight />
              </button>
            </div>
          </main>

          <Nav />

          <LearnerFooter />
        </div>
      </div>
    </div>
  );
}