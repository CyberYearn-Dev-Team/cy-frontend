"use client";

import React, { useState } from "react";
import { Trophy } from "lucide-react";

import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import LearnerFooter from "@/components/ui/learner-footer";

// Reusable Card Wrapper
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) => (
  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
    {icon}
    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
      {title}
    </h2>
  </div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4">{children}</div>
);

export default function AchievementsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Example achievements
  const achievements = [
    {
      id: 1,
      name: "First Steps",
      description: "Completed your first lesson",
      image:
        "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%201.png",
    },
    {
      id: 2,
      name: "Quiz Master",
      description: "Scored 90%+ on 5 quizzes",
      image:
        "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%202.png",
    },
    {
      id: 3,
      name: "Lab Explorer",
      description: "Completed 5 lab guides",
      image:
        "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%203.png",
    },
    {
      id: 4,
      name: "Streak Keeper",
      description: "Maintained a 7-day streak",
      image:
        "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%204.png",
    },
    {
      id: 5,
      name: "XP Collector",
      description: "Earned 1000 XP",
      image:
        "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%205.png",
    },
    {
      id: 6,
      name: "Champion",
      description: "Top 1 in leaderboard",
      image:
        "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%206.png",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />


      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Page Content + Footer Wrapper */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
<main className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 space-y-8">
            {/* Achievements Grid */}
            <Card>
              <CardHeader
                title="Your Achievements"
                icon={<Trophy className="h-5 w-5 text-[#72a210]" />}
              />
              <CardContent>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {achievements.map((a) => (
                    <div
                      key={a.id}
                      className="relative flex flex-col items-center text-center p-6 rounded-xl border border-[#72a210] 
                      bg-[#72a210]/10 dark:bg-[#72a210]/20 transition-all duration-300 
                      hover:scale-105 hover:shadow-lg cursor-pointer"
                    >
                      <img src={a.image} alt={a.name} className="w-22 h-20" />
                      <p className="font-semibold text-gray-900 dark:text-gray-100 mt-3 text-base">
                        {a.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {a.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>

          {/* Footer */}
          <LearnerFooter />
        </div>
      </div>
    </div>
  );
}
