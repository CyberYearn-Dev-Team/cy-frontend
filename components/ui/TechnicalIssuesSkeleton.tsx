import { Skeleton } from "./skeleton";

export function TechnicalIssuesSkeleton() {
  return (
    <div className="flex h-full">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex flex-col w-80 border-r border-gray-200 dark:border-gray-800 p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-3 space-y-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3/4 p-4 rounded-lg ${i % 2 === 0 ? 'bg-primary/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-64" />
                  <Skeleton className="h-3 w-48 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <Skeleton className="flex-1 h-10" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
