import { Skeleton } from "@/components/ui/skeleton";

export function LabDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Title Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Description Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Video Section Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <div className="aspect-video w-full bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center">
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
      </div>

      {/* PDF Section Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <div className="flex items-center p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-md" />
          <div className="ml-4 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>

      {/* Steps Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start">
              <Skeleton className="h-6 w-6 rounded-full mt-1 mr-3" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
