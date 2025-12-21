import { Skeleton } from "@/components/ui/skeleton";

export function AuditLogsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-t-lg">
        {['Action', 'User', 'Role', 'Entity', 'Date', 'Severity'].map((header) => (
          <div key={header} className="col-span-2">
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>

      {/* Skeleton Rows */}
      <div className="space-y-2">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="grid grid-cols-2 md:grid-cols-12 gap-4 items-center">
              <div className="col-span-2">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="col-span-2 hidden md:block">
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="col-span-2 hidden md:block">
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="col-span-2 hidden md:block">
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-6 w-16 rounded-full ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
