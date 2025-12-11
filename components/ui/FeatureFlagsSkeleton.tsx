import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export function FeatureFlagsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Search and Filter Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Feature Flags List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full max-w-2xl" />
                <div className="flex flex-wrap gap-4 pt-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner Skeleton */}
      <div className="mt-12">
        <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-700">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
