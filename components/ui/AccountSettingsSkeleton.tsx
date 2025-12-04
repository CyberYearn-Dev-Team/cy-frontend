import { Skeleton } from "@/components/ui/skeleton"

export function AccountSettingsSkeleton() {
  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
      {/* Page Title Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Profile Info Skeleton */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Picture Skeleton */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48 mb-6" />
            <div className="flex flex-col items-center">
              <Skeleton className="w-32 h-32 rounded-full mb-4" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          {/* Account Status Skeleton */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <Skeleton className="h-6 w-32 mb-6" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between pt-4 first:pt-0 border-t border-gray-200 dark:border-gray-700 first:border-t-0"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column — Editable Info Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-6 w-36 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>

            <div className="space-y-6">
              {/* Username Skeleton */}
              <div>
                <Skeleton className="h-5 w-20 mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-24" />
                </div>
              </div>

              {/* Email Skeleton */}
              <div>
                <Skeleton className="h-5 w-16 mb-2" />
                <Skeleton className="h-12 w-full" />
              </div>

              {/* Password Section Skeleton */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <Skeleton className="h-6 w-48 mb-6" />

                <div className="mb-4">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>

                <div className="mb-4">
                  <Skeleton className="h-5 w-36 mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>

                <div>
                  <Skeleton className="h-5 w-44 mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>

                <div className="pt-6">
                  <Skeleton className="h-12 w-48" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
