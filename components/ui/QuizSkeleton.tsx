import React from 'react';

const QuizSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      {/* Quiz Header Skeleton */}
      <div className="p-4 rounded-lg shadow-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>

        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 mb-1"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-6"></div>

        {/* Progress Bar Skeleton */}
        <div className="flex justify-between items-center mb-2">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full w-1/3"></div>
        </div>
      </div>

      {/* Question Card Skeleton */}
      <div className="bg-white dark:bg-gray-900 shadow-md p-6 rounded-lg border border-gray-200 dark:border-gray-800">
        {/* Question Header Skeleton */}
        <div className="flex items-center border-b pb-4 mb-6 border-gray-200 dark:border-gray-800">
          <div className="h-7 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="ml-3 h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>

        {/* Question Text Skeleton */}
        <div className="space-y-3 mb-8">
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
        </div>

        {/* Options Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="w-full flex items-center p-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 flex-shrink-0"></div>
              <div className="ml-4 h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons Skeleton */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default QuizSkeleton;
