"use client";

import React, { useState } from "react";
import { Trophy, Lock, Medal, Flame, BookOpen, FlaskConical } from "lucide-react";

import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";

// Reusable Card
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white rounded-xl shadow-md border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
    {icon}
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
  </div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4">{children}</div>
);

export default function AchievementsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Leaderboard visibility is controlled via feature flag. Keep OFF by default.
  // Set NEXT_PUBLIC_FEATURE_LEADERBOARD="true" to enable related navigation.

  // Example achievements (later → fetch dynamically)
  const achievements = [
    {
      id: 1,
      name: "First Steps",
      description: "Completed your first lesson",
      unlocked: true,
      icon: <BookOpen className="h-10 w-10 text-green-600" />,
    },
    {
      id: 2,
      name: "Quiz Master",
      description: "Scored 90%+ on 5 quizzes",
      unlocked: false,
      icon: <Trophy className="h-10 w-10 text-gray-400" />,
    },
    {
      id: 3,
      name: "Lab Explorer",
      description: "Completed 5 lab guides",
      unlocked: false,
      icon: <FlaskConical className="h-10 w-10 text-gray-400" />,
    },
    {
      id: 4,
      name: "Streak Keeper",
      description: "Maintained a 7-day streak",
      unlocked: true,
      icon: <Flame className="h-10 w-10 text-orange-500" />,
    },
    {
      id: 5,
      name: "XP Collector",
      description: "Earned 1000 XP",
      unlocked: true,
      icon: <Medal className="h-10 w-10 text-yellow-500" />,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Achievements Grid */}
          <Card>
            <CardHeader title="Your Achievements" icon={<Trophy className="h-5 w-5 text-[#72a210]" />} />
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    className={`flex flex-col items-center text-center p-4 rounded-lg border ${
                      a.unlocked ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-100 opacity-60"
                    } cursor-pointer`}
                  >
                    {a.icon}
                    <p className="font-medium text-gray-900 mt-2">{a.name}</p>
                    <p className="text-xs text-gray-600">{a.description}</p>
                    {!a.unlocked && (
                      <Lock className="h-4 w-4 text-gray-400 mt-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
