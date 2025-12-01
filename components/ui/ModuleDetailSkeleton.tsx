import React from 'react';

const LessonSkeleton = () => (
  <div className="animate-pulse flex flex-col sm:flex-row items-center gap-4 p-4 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800" />
    <div className="flex-1 w-full space-y-2">
      <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
    </div>
    <div className="w-full sm:w-32 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg mt-2 sm:mt-0" />
  </div>
);

export const ModuleDetailSkeleton = () => (
  <div className="space-y-6">
    {/* Module Header Skeleton */}
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
      </div>
    </div>

    {/* Lessons List Skeleton */}
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-6" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <LessonSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export default ModuleDetailSkeleton;
