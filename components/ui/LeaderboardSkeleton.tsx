// LeaderboardSkeleton.jsx (or whatever file holds this component)

import React from 'react';

const LeaderboardSkeleton = () => {
  // Skeleton for top 3 learners
  const TopThreeSkeleton = () => (
    // Added snap-x and w-max for mobile scrolling effect
    <div className="flex justify-start items-end gap-6 mb-10 max-w-6xl mx-auto sm:justify-between sm:flex-nowrap sm:gap-6 w-max px-4 snap-x snap-mandatory">
      
      {/* 2nd Place Skeleton */}
      {/* Added snap-center for mobile scrolling */}
      <div className="relative rounded-2xl shadow-md flex flex-col items-center transform flex-shrink-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 w-56 md:w-72 translate-y-8 snap-center">
        <div className="absolute -top-5 -right-2 w-20 h-16 md:w-25 md:h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 dark:bg-gray-700 mt-3 animate-pulse"></div>
      </div>

      {/* 1st Place Skeleton */}
      {/* Added snap-center and fixed the background gradient to use skeleton colors */}
      <div className="relative rounded-2xl shadow-md flex flex-col items-center transform flex-shrink-0 bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-700 dark:to-gray-800 p-8 w-64 md:w-80 snap-center">
        <div className="absolute -top-5 -right-2 w-20 h-16 md:w-25 md:h-20 bg-gray-500 dark:bg-gray-600 rounded-lg animate-pulse"></div>
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/40 dark:bg-gray-600/40 mb-4 animate-pulse"></div>
        <div className="h-6 w-36 bg-gray-500 dark:bg-gray-600 rounded animate-pulse"></div>
        <div className="h-6 w-24 bg-gray-500 dark:bg-gray-600 rounded mt-2 animate-pulse"></div>
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gray-500 dark:bg-gray-600 mt-3 animate-pulse"></div>
      </div>

      {/* 3rd Place Skeleton */}
      {/* Added snap-center */}
      <div className="relative rounded-2xl shadow-md flex flex-col items-center transform flex-shrink-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 w-56 md:w-72 translate-y-8 snap-center">
        <div className="absolute -top-5 -right-2 w-20 h-16 md:w-25 md:h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 dark:bg-gray-700 mt-3 animate-pulse"></div>
      </div>
    </div>
  );

  // Skeleton for table rows
  const TableRowSkeleton = () => (
    <tr className="border-b border-gray-100 dark:border-gray-700">
      <td className="py-4 px-6 whitespace-nowrap">
        <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </td>
    </tr>
  );

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto mb-10 animate-pulse"></div>
      
      {/* Top 3 Skeleton */}
      <div className="w-full overflow-x-auto overflow-y-visible py-6">
        <TopThreeSkeleton />
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
      </div>

      {/* Filter buttons Skeleton */}
      <div className="max-w-6xl mx-auto mb-6 flex gap-3 justify-end">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-20 md:w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="max-w-6xl mx-auto overflow-x-auto overflow-y-hidden rounded-xl">
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar"> {/* Added custom-scrollbar class for consistency */}
          <table className="min-w-max w-full bg-white dark:bg-gray-900 shadow rounded-xl">
            <thead>
              <tr className="text-gray-600 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-gray-700">
                {['Rank', 'Learner', 'XP Earned', 'Joined'].map((header) => (
                  <th key={header} className="text-left py-4 px-6 font-medium whitespace-nowrap">
                    {/* Display header text faintly or use a skeleton block */}
                    {/* Using a skeleton block here is redundant, let's keep the text for clarity */}
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default LeaderboardSkeleton;