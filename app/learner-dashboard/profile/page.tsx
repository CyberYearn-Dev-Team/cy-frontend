"use client";

import React from "react";
import {
  User,
  Mail,
  Edit3,
  Phone,
  CheckCircle,
  Clock,
  Play,
} from "lucide-react";

import Link from "next/link";
// Assuming Sidebar and Header components handle their own dark mode styling internally
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#507800";
const bgLight = "bg-gray-50 dark:bg-gray-950"; // Main page background
const cardBg = "bg-white dark:bg-gray-900"; // Card background
const textDark = "text-gray-900 dark:text-gray-100"; // Headings/Strong text
const textMedium = "text-gray-600 dark:text-gray-300"; // Body text
const textLabel = "text-gray-700 dark:text-gray-200"; // Label text
const textLight = "text-gray-500 dark:text-gray-400"; // Subtle/Icon text
const borderLight = "border-gray-200 dark:border-gray-700"; // Light border

// Reusable components
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    // Applied dark mode background and border
    className={`${cardBg} rounded-xl shadow-md border ${borderLight} ${className}`}
  >
    {children}
  </div>
);

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`px-4 py-4 ${className}`}>{children}</div>;

const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "success" | "outline";
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
  const variants = {
    // Applied theme colors
    primary: `bg-[${primary}] hover:bg-[${primaryDarker}] text-white focus:ring-[${primary}]`,
    success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500",
    // Applied dark mode colors for outline
    outline:
      `border ${borderLight} ${cardBg} hover:bg-gray-50 dark:hover:bg-gray-800 ${textMedium} focus:ring-[${primary}]`,
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    // Applied dark mode background to main container
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side (Profile + Courses) */}
            <div className="lg:col-span-2">
              {/* Profile Info */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    {/* Applied dark mode text color */}
                    <h2 className={`text-xl font-bold ${textDark}`}>
                      Shillmonger
                    </h2>

                    <Link href="/learner-dashboard/account-setting" passHref>
                      <Button variant="outline" className={`p-2 ${textMedium} dark:text-gray-300`}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:space-x-6 space-y-6 sm:space-y-0">
                    {/* Avatar */}
                    <div className="relative flex justify-center sm:justify-start">
                      {/* Applied theme color to avatar background */}
                      <div className={`h-30 w-30 rounded-full bg-[${primary}] flex items-center justify-center overflow-hidden`}>
                        <img
                          src="/api/placeholder/120/120"
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.nextElementSibling?.classList.remove("hidden");
                          }}
                        />
                        <User className="h-14 w-14 text-white hidden" />
                      </div>
                    </div>


                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex flex-col gap-3">
                        <div>
                          {/* Applied dark mode text color */}
                          <p className={`text-sm ${textLight} mb-1`}>
                            Fullname:
                          </p>
                          {/* Applied dark mode text color */}
                          <p className={`font-medium ${textDark}`}>
                            Shillmonger Agu
                          </p>
                        </div>
                        <div>
                          {/* Applied dark mode text color */}
                          <p className={`text-sm ${textLight} mb-1`}>
                            Email:
                          </p>
                          {/* Applied dark mode text color */}
                          <p className={`font-medium ${textDark}`}>
                            shillmonger0@gmail.com
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* My Courses */}
              <Card className="mt-6">
                <CardContent className="p-8">
                  {/* Applied dark mode text color */}
                  <h3 className={`text-lg font-bold ${textDark} mb-6`}>
                    My Cybersecurity Tracks
                  </h3>

                  <div className="space-y-4">
                    {/* Beginner */}
                    {/* Applied dark mode border */}
                    <div className={`flex items-center justify-between p-4 border ${borderLight} rounded-lg`}>
                      <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-green-600 dark:bg-green-400"></div>
                        </div>

                        <div>
                          {/* Applied dark mode text color */}
                          <h4 className={`font-medium ${textDark}`}>
                            Cybersecurity Fundamentals
                          </h4>
                          {/* Applied dark mode text color */}
                          <p className={`text-sm ${textMedium}`}>0 lessons</p>
                        </div>
                      </div>
                      {/* Level Badge */}
                      <span className="text-xs font-semibold bg-green-600 text-white px-3 py-1 rounded-full">
                        Beginner
                      </span>
                    </div>

                    {/* Intermediate */}
                    {/* Applied dark mode border */}
                    <div className={`flex items-center justify-between p-4 border ${borderLight} rounded-lg`}>
                      <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/50 items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 dark:bg-yellow-400"></div>
                        </div>
                        <div>
                          {/* Applied dark mode text color */}
                          <h4 className={`font-medium ${textDark}`}>
                            Network Security & Ethical Hacking
                          </h4>
                          {/* Applied dark mode text color */}
                          <p className={`text-sm ${textMedium}`}>0 lessons</p>
                        </div>
                      </div>
                      {/* Level Badge */}
                      <span className="text-xs font-semibold bg-yellow-500 text-white px-3 py-1 rounded-full">
                        Intermediate
                      </span>
                    </div>

                    {/* Advanced */}
                    {/* Applied dark mode border */}
                    <div className={`flex items-center justify-between p-4 border ${borderLight} rounded-lg`}>
                      <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 dark:bg-red-400"></div>
                        </div>
                        <div>
                          {/* Applied dark mode text color */}
                          <h4 className={`font-medium ${textDark}`}>
                            Advanced Penetration Testing
                          </h4>
                          {/* Applied dark mode text color */}
                          <p className={`text-sm ${textMedium}`}>0 lessons</p>
                        </div>
                      </div>
                      {/* Level Badge */}
                      <span className="text-xs font-semibold bg-red-500 text-white px-3 py-1 rounded-full">
                        Advanced
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side (Learning Progress) */}
            <div className="space-y-6">
              {/* Applied theme gradient to progress card */}
              <Card className={`bg-gradient-to-br from-[${primary}] to-[${primaryDarker}] text-white`}>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-bold mb-4">Your Learning Path</h3>
                  <ul className="text-sm space-y-4 mb-6">
                    <li className="flex items-center justify-between">
                      <span>Beginner</span>
                      {/* Applied theme color to percentage badge text */}
                      <span className={`text-xs bg-white text-[${primaryDarker}] px-2 py-1 rounded-full`}>
                        0%
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Intermediate</span>
                      {/* Applied theme color to percentage badge text */}
                      <span className={`text-xs bg-white text-[${primaryDarker}] px-2 py-1 rounded-full`}>
                        0%
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Advanced</span>
                      {/* Applied theme color to percentage badge text */}
                      <span className={`text-xs bg-white text-[${primaryDarker}] px-2 py-1 rounded-full`}>
                        0%
                      </span>
                    </li>
                  </ul>

                  <Link href="/learner-dashboard/tracks" passHref>
                    <Button
                      variant="outline"
                      // Applied theme color to outline button inside the gradient card
                      className={`w-full bg-white text-[${primaryDarker}] border-white hover:bg-gray-50 dark:hover:bg-gray-100 cursor-pointer`}
                    >
                      Continue Learning
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}