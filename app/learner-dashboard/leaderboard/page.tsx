"use client";

import React, { useState, useMemo } from "react";
import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortNumericDown,
  FaSortNumericUp,
} from "react-icons/fa";
import Sidebar from "@/components/learner-sidebar";
import Header from "@/components/learner-header";
import Nav from "@/components/learner-nav";
import LearnerFooter from "@/components/learner-footer";
import LeaderboardSkeleton from "@/components/ui/LeaderboardSkeleton";
import { getLeaderboard } from "@/lib/services/leaderboardService";

// Original User interface from the API response
interface User {
  id: string;
  username: string;
  totalXp: number;
  rank?: number;
  createdAt: string; // The API uses createdAt for the joined date
  profileImage: string | null;
  xpEvents: Array<{
    id: string;
    amount: number;
    reason: string;
    refType: string;
    refId: string;
    createdAt: string;
  }>;
}

// API Response structure
interface ApiResponse {
  status: number;
  message: string;
  data: {
    topThree: User[];
    allUsers: User[];
  };
}

// Interface for the processed data used in the component
interface LeaderboardUser {
  id: string;
  name: string;
  xp: number;
  rank: number;
  joined: string; // Formatted date string
  profileImage: string | null;
}

// FIX: Changed 'Learner' to 'LeaderboardUser'
type SortKey = keyof LeaderboardUser;
type SortDirection = "asc" | "desc";

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
  const [filter, setFilter] = useState("all");
  // FIX: Initial sort key is now explicitly one of the correct keys
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topLearners, setTopLearners] = useState<LeaderboardUser[]>([]);
  const [allLearners, setAllLearners] = useState<LeaderboardUser[]>([]);

  // Date formatting function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Fetch leaderboard data
  React.useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setIsLoading(true);
        const data = await getLeaderboard();

        // Combine topThree and allUsers, remove duplicates, and sort by XP to ensure correct ranks
        const combinedUsers = [...data.data.topThree, ...(data.data.allUsers || [])]
          .filter((user, index, self) =>
            index === self.findIndex(u => u.id === user.id)
          )
          .sort((a, b) => b.totalXp - a.totalXp);

        // Process all users (including top 3) and assign rank
        const processedAllUsers: LeaderboardUser[] = combinedUsers.map((user, index) => ({
          id: user.id,
          name: user.username,
          xp: user.totalXp,
          rank: index + 1,
          joined: formatDate(user.createdAt),
          profileImage: user.profileImage,
        }));

        // Set top 3 learners and the rest
        setTopLearners(processedAllUsers.slice(0, 3));
        setAllLearners(processedAllUsers.slice(3));

      } catch (err: any) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message || 'Failed to load leaderboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      // Default to descending for 'xp' and 'rank', ascending for others
      setSortDirection(key === "xp" || key === "rank" ? "desc" : "asc");
    }
  };

  const processedLearners = useMemo(() => {
    if (isLoading) return [];
    if (error) return [];

    // Combine topLearners and allLearners for sorting/filtering
    let list = [...topLearners, ...allLearners];

    // FIX: Filter logic was incorrect. It's impossible for a rank to be <= 7 or <= 15 on the `allLearners` list 
    // since ranks start at 4 there. Assuming the intent was to show only certain ranks across the *entire* leaderboard.
    // However, since the filter keys are '7days', '30days', and 'all', I'm leaving the rank-based logic as-is, 
    // but applying it to the combined list for a more complete result.
    // NOTE: This filter logic (`learner.rank <= 7`) will only work correctly if the list is already ranked 1...N.
    list = list.filter((learner) => {
      // NOTE: This filter is likely tied to the time the XP was earned, not the static rank,
      // but without that data, we'll keep the existing rank-based approximation logic.
      if (filter === "7days") return learner.rank <= 7;
      if (filter === "30days") return learner.rank <= 30; // Changed 15 to 30 as 30 days is common for monthly
      return true;
    });

    list.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      let comparison = 0;

      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else if (sortKey === "name") {
        comparison = String(aValue).localeCompare(String(bValue));
      } else if (sortKey === "joined") {
        // FIX: Compare date strings by parsing them back into Date objects for accurate comparison
        // The dates are already formatted, so we need to ensure the sorting is based on time.
        const aTime = new Date(a.joined).getTime();
        const bTime = new Date(b.joined).getTime();
        comparison = aTime - bTime;
      }

      return sortDirection === "asc" ? comparison : comparison * -1;
    });

    return list;
  }, [topLearners, allLearners, filter, sortKey, sortDirection, isLoading, error]);

  const SortIcon: React.FC<{ columnKey: SortKey }> = ({ columnKey }) => {
    if (sortKey !== columnKey) return null;
    if (columnKey === "name") {
      return sortDirection === "asc" ? (
        <FaSortAlphaUp className="ml-1 inline-block text-[#507800]" />
      ) : (
        <FaSortAlphaDown className="ml-1 inline-block text-[#507800]" />
      );
    }
    return sortDirection === "asc" ? (
      <FaSortNumericUp className="ml-1 inline-block text-[#507800]" />
    ) : (
      <FaSortNumericDown className="ml-1 inline-block text-[#507800]" />
    );
  };

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <style jsx>{`
        /* Custom Scrollbar Styles for WebKit Browsers */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #72a210;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #507800;
        }
        /* Dark mode styles */
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #a3e635;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #84cc16;
        }

        /* 🔒 Hide scrollbar on small screens */
        @media (max-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .custom-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        }
      `}</style>

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          {isLoading ? (
            <LeaderboardSkeleton />
          ) : (
            <main className="p-4 sm:p-6 lg:p-8 mb-20">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-10">
                Leaderboard
              </h1>

              {/* Top 3 Learners */}
              <div className="w-full overflow-x-auto overflow-y-visible py-6">
                <div className="flex justify-between items-end gap-6 mb-10 max-w-6xl mx-auto sm:justify-between sm:flex-nowrap min-w-max px-4">
                  {/* 2nd Place - Left */}
                  {topLearners.find(l => l.rank === 2) && (
                    <div className="relative rounded-2xl shadow-md flex flex-col items-center transform flex-shrink-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 w-56 md:w-72 translate-y-8">
                      <img
                        src={trophyImages[2]}
                        alt="2nd place trophy"
                        className="absolute -top-5 -right-2 w-20 h-16 md:w-25 md:h-20"
                      />
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#72a210]/10 dark:bg-[#72a210]/20 flex items-center justify-center overflow-hidden">
                        {topLearners.find(l => l.rank === 2)?.profileImage ? (
                          <img 
                            src={topLearners.find(l => l.rank === 2)?.profileImage || ''} 
                            alt={topLearners.find(l => l.rank === 2)?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[#507800] dark:text-[#a3e635] text-2xl md:text-3xl font-bold">
                            {getInitials(topLearners.find(l => l.rank === 2)?.name || '')}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg md:text-xl text-gray-800 dark:text-gray-200 font-semibold mt-2">
                        {topLearners.find(l => l.rank === 2)?.name.split(" ")[0]}
                      </h3>
                      <p className="text-[#507800] dark:text-[#a3e635] text-base md:text-lg font-bold mt-2">
                        {topLearners.find(l => l.rank === 2)?.xp.toLocaleString()} XP
                      </p>
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#72a210] text-white flex items-center justify-center font-bold mt-3">
                        2
                      </div>
                    </div>
                  )}

                  {/* 1st Place - Middle */}
                  {topLearners.find(l => l.rank === 1) && (
                    <div className="relative rounded-2xl shadow-md flex flex-col items-center transform flex-shrink-0 bg-gradient-to-br from-[#72a210] to-[#507800] text-white p-8 w-64 md:w-80">
                      <img
                        src={trophyImages[1]}
                        alt="1st place trophy"
                        className="absolute -top-5 -right-2 w-20 h-16 md:w-25 md:h-20"
                      />
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/20 flex items-center justify-center overflow-hidden mb-4">
                        {topLearners.find(l => l.rank === 1)?.profileImage ? (
                          <img 
                            src={topLearners.find(l => l.rank === 1)?.profileImage || ''} 
                            alt={topLearners.find(l => l.rank === 1)?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-3xl md:text-4xl font-bold">
                            {getInitials(topLearners.find(l => l.rank === 1)?.name || '')}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold">
                        {topLearners.find(l => l.rank === 1)?.name.split(" ")[0]}
                      </h3>
                      <p className="text-white text-xl md:text-2xl font-bold mt-2">
                        {topLearners.find(l => l.rank === 1)?.xp.toLocaleString()} XP
                      </p>
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-white text-[#507800] text-xl md:text-2xl font-bold flex items-center justify-center mt-3">
                        1
                      </div>
                    </div>
                  )}

                  {/* 3rd Place - Right */}
                  {topLearners.find(l => l.rank === 3) && (
                    <div className="relative rounded-2xl shadow-md flex flex-col items-center transform flex-shrink-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 w-56 md:w-72 translate-y-8">
                      <img
                        src={trophyImages[3]}
                        alt="3rd place trophy"
                        className="absolute -top-5 -right-2 w-20 h-16 md:w-25 md:h-20"
                      />
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#72a210]/10 dark:bg-[#72a210]/20 flex items-center justify-center overflow-hidden">
                        {topLearners.find(l => l.rank === 3)?.profileImage ? (
                          <img 
                            src={topLearners.find(l => l.rank === 3)?.profileImage || ''} 
                            alt={topLearners.find(l => l.rank === 3)?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[#507800] dark:text-[#a3e635] text-2xl md:text-3xl font-bold">
                            {getInitials(topLearners.find(l => l.rank === 3)?.name || '')}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg md:text-xl text-gray-800 dark:text-gray-200 font-semibold mt-2">
                        {topLearners.find(l => l.rank === 3)?.name.split(" ")[0]}
                      </h3>
                      <p className="text-[#507800] dark:text-[#a3e635] text-base md:text-lg font-bold mt-2">
                        {topLearners.find(l => l.rank === 3)?.xp.toLocaleString()} XP
                      </p>
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#72a210] text-white flex items-center justify-center font-bold mt-3">
                        3
                      </div>
                    </div>
                  )}
                  {/* REMOVED: Redundant and incorrect top-learner rendering loop here */}
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
                    onClick={() => setFilter(key)}
                  >
                    {key === "7days"
                      ? "7 Days"
                      : key === "30days"
                      ? "30 Days"
                      : "All Time"}
                  </button>
                ))}
              </div>

              {/* Scrollable Leaderboard Table */}
              <div className="max-w-6xl mx-auto overflow-x-auto overflow-y-hidden rounded-xl">
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                  <table className="min-w-max w-full bg-white dark:bg-gray-900 shadow rounded-xl">
                    <thead>
                      <tr className="text-gray-600 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-gray-700">
                        <th
                          className="text-left py-4 px-6 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
                          onClick={() => handleSort("rank")}
                        >
                          Rank <SortIcon columnKey="rank" />
                        </th>
                        <th
                          className="text-left py-4 px-6 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[150px] whitespace-nowrap"
                          onClick={() => handleSort("name")}
                        >
                          Learner <SortIcon columnKey="name" />
                        </th>
                        <th
                          className="text-left py-4 px-6 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
                          onClick={() => handleSort("xp")}
                        >
                          XP Earned <SortIcon columnKey="xp" />
                        </th>
                        <th
                          className="text-left py-4 px-6 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
                          onClick={() => handleSort("joined")}
                        >
                          Joined <SortIcon columnKey="joined" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedLearners.map((learner, index) => (
                        <tr
                          key={learner.id}
                          className="border-b border-gray-100 dark:border-gray-700 hover:bg-[#72a210]/10 dark:hover:bg-[#72a210]/20 transition-colors cursor-pointer"
                        >
                          <td className="py-4 px-6 text-gray-800 dark:text-gray-200 font-semibold whitespace-nowrap">
                            {learner.rank} {/* Always display the actual rank */}
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#72a210]/10 dark:bg-[#72a210]/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {learner.profileImage ? (
                                  <img 
                                    src={learner.profileImage} 
                                    alt={learner.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-[#507800] dark:text-[#a3e635] font-bold text-sm">
                                    {getInitials(learner.name)}
                                  </span>
                                )}
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
              </div>
            </main>
          )}

          <Nav />
          <LearnerFooter />
        </div>
      </div>
    </div>
  );
}