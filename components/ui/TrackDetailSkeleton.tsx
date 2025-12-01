import React from 'react';

const ModuleSkeleton = () => (
  <div className="animate-pulse flex flex-col sm:flex-row items-center gap-4 p-4 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800" />
    <div className="flex-1 space-y-3 w-full">
      <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
      <div className="flex gap-4 mt-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20" />
      </div>
    </div>
    <div className="w-full sm:w-auto h-10 bg-gray-200 dark:bg-gray-800 rounded-lg mt-2 sm:mt-0" />
  </div>
);

const SidebarSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 space-y-4">
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
      
      <div className="space-y-2 pt-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full">
          <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full w-1/2" />
        </div>
      </div>
      
      <div className="pt-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2" />
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-16" />
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-14" />
        </div>
      </div>
    </div>
    
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-4" />
      <ul className="space-y-2">
        {[1, 2, 3].map((i) => (
          <li key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        ))}
      </ul>
    </div>
  </div>
);

export const TrackDetailSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    {/* Left side */}
    <div className="lg:col-span-3 space-y-6">
      {/* Track header skeleton */}
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden">
        <div className="w-full aspect-[16/9] bg-gray-200 dark:bg-gray-800" />
        <div className="p-6 space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
          </div>
          <div className="flex gap-4 pt-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
          </div>
          <div className="pt-2">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full">
              <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full w-1/3" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Modules skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <ModuleSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
    
    {/* Right side */}
    <div className="lg:col-span-1">
      <SidebarSkeleton />
    </div>
  </div>
);

export default TrackDetailSkeleton;
