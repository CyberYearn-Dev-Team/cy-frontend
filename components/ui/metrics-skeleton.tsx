import { Skeleton } from "./skeleton";

export function MetricsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
            <Skeleton className="mt-2 h-8 w-16 bg-gray-200 dark:bg-gray-700" />
            <div className="mt-4 flex items-center space-x-2">
              <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-12 bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Line Chart Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <Skeleton className="mb-4 h-6 w-48 bg-gray-200 dark:bg-gray-700" />
          <div className="h-64 w-full">
            <Skeleton className="h-full w-full rounded-md bg-gray-100 dark:bg-gray-700" />
          </div>
        </div>

        {/* Bar Chart Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <Skeleton className="mb-4 h-6 w-48 bg-gray-200 dark:bg-gray-700" />
          <div className="h-64 w-full">
            <Skeleton className="h-full w-full rounded-md bg-gray-100 dark:bg-gray-700" />
          </div>
        </div>

        {/* Completion Chart Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <Skeleton className="mb-4 h-6 w-48 bg-gray-200 dark:bg-gray-700" />
          <div className="h-64 w-full">
            <Skeleton className="h-full w-full rounded-md bg-gray-100 dark:bg-gray-700" />
          </div>
        </div>

        {/* Retention Chart Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <Skeleton className="mb-4 h-6 w-48 bg-gray-200 dark:bg-gray-700" />
          <div className="h-64 w-full">
            <Skeleton className="h-full w-full rounded-md bg-gray-100 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
