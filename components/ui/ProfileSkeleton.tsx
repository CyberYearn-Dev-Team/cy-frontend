import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
      {/* Page Title Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Profile Picture and Account Status */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Picture Skeleton */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48 mb-6" />
            <div className="flex flex-col items-center">
              <Skeleton className="w-32 h-32 rounded-full mb-4" />
            </div>
          </div>

          {/* Account Status Skeleton */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <Skeleton className="h-6 w-32 mb-6" />
            
            {/* Email Status */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>

            {/* Account Type */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>

            {/* Member Since */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>

        {/* Right Column — Basic Info & Danger Zone */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Skeleton */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-6 w-36 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>

            <div className="space-y-6">
              {/* Username Field */}
              <div>
                <Skeleton className="h-5 w-20 mb-2" />
                <div className="relative">
                  <Skeleton className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full" />
                  <Skeleton className="w-full h-12 pl-10" />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <div className="relative">
                  <Skeleton className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full" />
                  <Skeleton className="w-full h-12 pl-10" />
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone Skeleton */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-900/50 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-80 mb-6" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
      </div>
    </main>
  )
}