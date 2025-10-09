"use client"

import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="flex h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-[#72a210]">404</h1>
        <h2 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Page Not Found
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium"
          >
            Go back Home
          </Link>
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-lg bg-[#72a210] text-white font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
