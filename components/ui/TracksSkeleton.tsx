import React from 'react';

const TrackCardSkeleton = () => (
  <div className="animate-pulse rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-900">
    {/* Image Skeleton */}
    <div className="h-48 w-full bg-gray-200 dark:bg-gray-800" />

    {/* Content Skeleton */}
    <div className="p-5 space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full" />
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>

      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
      </div>

      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-1">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="h-4 w-8 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
        <div className="bg-gray-300 dark:bg-gray-700 h-2 rounded-full w-1/2" />
      </div>
    </div>
  </div>
);

export const TracksSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <TrackCardSkeleton key={index} />
    ))}
  </div>
);

export default TracksSkeleton;
