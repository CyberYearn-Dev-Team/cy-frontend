import React from 'react';

const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
      </div>
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
    </div>
  </div>
);

const DashboardStatsSkeleton = () => {
  return (
    <div className="w-full lg:flex-[0.3] grid grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default DashboardStatsSkeleton;
