"use client";

import React, { useState } from "react";
import {
  Zap,
  Trophy,
  Target,
  Flame,
  Lock,
  Star,
  Medal,
} from "lucide-react";

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

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

export default function GamificationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Gamification aligns with PRD: XP, badges, strict streaks with freezes

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
          {/* XP & Level */}
          <Card>
            <CardHeader title="XP & Levels" icon={<Zap className="h-5 w-5 text-yellow-500" />} />
            <CardContent>
              <p className="text-sm text-gray-600">Total XP</p>
              <p className="text-2xl font-bold text-gray-900">1250</p>
              <div className="mt-3 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-[#72a210] rounded-full" style={{ width: "70%" }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">250 XP to reach Level 6</p>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader title="Achievements" icon={<Trophy className="h-5 w-5 text-[#72a210]" />} />
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Earned */}
              <div className="flex flex-col items-center">
                <Medal className="h-10 w-10 text-yellow-500" />
                <p className="text-sm font-medium mt-2">First Steps</p>
                <p className="text-xs text-gray-500">Completed first lesson</p>
              </div>

              {/* Locked */}
              <div className="flex flex-col items-center opacity-50">
                <Lock className="h-10 w-10 text-gray-400" />
                <p className="text-sm font-medium mt-2">Quiz Master</p>
                <p className="text-xs text-gray-500">Score 90%+ on 5 quizzes</p>
              </div>

              <div className="flex flex-col items-center opacity-50">
                <Lock className="h-10 w-10 text-gray-400" />
                <p className="text-sm font-medium mt-2">Lab Expert</p>
                <p className="text-xs text-gray-500">Complete 10 lab guides</p>
              </div>
            </CardContent>
          </Card>

          {/* Streaks */}
          <Card>
            <CardHeader title="Streaks" icon={<Flame className="h-5 w-5 text-orange-500" />} />
            <CardContent>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">7 days 🔥</p>
              <p className="text-xs text-gray-500 mt-1">You have 2 streak freezes left</p>
              {/* In a later iteration, freezes decrement only when used; strict rules per PRD */}
            </CardContent>
          </Card>

          {/* XP History */}
          <Card>
            <CardHeader title="XP History" icon={<Star className="h-5 w-5 text-[#507800]" />} />
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>+40 XP — Completed Phishing Quiz</span>
                <span className="text-gray-500">Today</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>+20 XP — Daily streak maintained</span>
                <span className="text-gray-500">Yesterday</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>+100 XP — Completed Cyber Hygiene Module</span>
                <span className="text-gray-500">2 days ago</span>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
