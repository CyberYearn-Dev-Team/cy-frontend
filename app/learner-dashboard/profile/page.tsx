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
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";

// Reusable components
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-xl shadow-md border border-gray-200 ${className}`}
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
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-[#72a210] hover:bg-[#507800] text-white focus:ring-[#72a210]",
    success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500",
    outline:
      "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-[#72a210]",
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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side (Profile + Courses) */}
            <div className="lg:col-span-2">
              {/* Profile Info */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Shillmonger
                    </h2>

                    <Link href="/learner-dashboard/account-setting" passHref>
                      <Button variant="outline" className="p-2">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

<div className="flex flex-col sm:flex-row items-start sm:space-x-6 space-y-6 sm:space-y-0">
                    {/* Avatar */}
                    <div className="relative flex justify-center sm:justify-start">
  <div className="h-30 w-30 rounded-full bg-[#72a210] flex items-center justify-center overflow-hidden">
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
                          <p className="text-sm text-gray-500 mb-1">
                            Fullname:
                          </p>
                          <p className="font-medium text-gray-900">
                            Shillmonger Agu
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Email:
                          </p>
                          <p className="font-medium text-gray-900">
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
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    My Cybersecurity Tracks
                  </h3>

                  <div className="space-y-4">
                    {/* Beginner */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-green-600"></div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900">
                            Cybersecurity Fundamentals
                          </h4>
                          <p className="text-sm text-gray-600">0 lessons</p>
                        </div>
                      </div>
                      {/* Level Badge */}
                      <span className="text-xs font-semibold bg-green-600 text-white px-3 py-1 rounded-full">
                        Beginner
                      </span>
                    </div>

                    {/* Intermediate */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex w-10 h-10 rounded-full bg-yellow-100 items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Network Security & Ethical Hacking
                          </h4>
                          <p className="text-sm text-gray-600">0 lessons</p>
                        </div>
                      </div>
                      {/* Level Badge */}
                      <span className="text-xs font-semibold bg-yellow-500 text-white px-3 py-1 rounded-full">
                        Intermediate
                      </span>
                    </div>

                    {/* Advanced */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex w-10 h-10 rounded-full bg-red-100 items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Advanced Penetration Testing
                          </h4>
                          <p className="text-sm text-gray-600">0 lessons</p>
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
              <Card className="bg-gradient-to-br from-[#72a210] to-[#507800] text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-bold mb-4">Your Learning Path</h3>
                  <ul className="text-sm space-y-4 mb-6">
                    <li className="flex items-center justify-between">
                      <span>Beginner</span>
                      <span className="text-xs bg-white text-[#507800] px-2 py-1 rounded-full">
                        0%
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Intermediate</span>
                      <span className="text-xs bg-white text-[#507800] px-2 py-1 rounded-full">
                        0%
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Advanced</span>
                      <span className="text-xs bg-white text-[#507800] px-2 py-1 rounded-full">
                        0%
                      </span>
                    </li>
                  </ul>

                  <Link href="/learner-dashboard/tracks" passHref>
                    <Button
                      variant="outline"
                      className="w-full bg-white text-[#507800] border-white hover:bg-gray-50 cursor-pointer"
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
