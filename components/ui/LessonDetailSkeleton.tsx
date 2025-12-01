import React from 'react';

export const LessonDetailSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Breadcrumb Skeleton */}
    <div className="flex items-center space-x-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16" />
    </div>

    {/* Lesson Content Skeleton */}
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
      {/* Title Skeleton */}
      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4" />
      
      {/* Estimated Time Skeleton */}
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-6" />
      
      {/* Content Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
          </div>
        ))}
      </div>
      
      {/* Button Skeleton */}
      <div className="flex justify-end pt-6">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-40" />
      </div>
    </div>

    {/* Quiz Section Skeleton */}
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 flex flex-col sm:flex-row justify-between items-center">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-3 sm:mb-0" />
      <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-full sm:w-48" />
    </div>
  </div>
);

export default LessonDetailSkeleton;
