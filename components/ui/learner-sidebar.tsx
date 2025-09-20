"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  FlaskConical,
  BarChart3,
  Award,
  LogOut,
  X,
  Gamepad2,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <aside
  className={`${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  } fixed inset-y-0 left-0 z-30 w-full lg:w-64 transform bg-white border-r border-gray-200 
  transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 bg-gray-50`}
>

      {/* Logo + Close */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img
            src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/logo.png"
            alt="Logo"
            className="h-12 sm:h-16 md:h-10 w-auto"
          />
        </div>
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Nav */}
      <nav className="px-4 py-10 space-y-2 overflow-y-auto h-[calc(100%-4rem)]">
        <Link
          href="/learner-dashboard/dashboard"
          className={`flex items-center px-3 py-2 transition-colors duration-200 ${
            isActive("/dashboard")
              ? "text-[#507800] border-r-4 border-[#72a210] font-medium"
              : "text-gray-700 hover:bg-[#72a210] hover:text-white"
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          <Home className="w-5 h-5 mr-2" /> Dashboard
        </Link>

        <Link
          href="/learner-dashboard/tracks"
          className={`flex items-center px-3 py-2 transition-colors duration-200 ${
            isActive("/tracks")
              ? "text-[#507800] border-r-4 border-[#72a210] font-medium"
              : "text-gray-700 hover:bg-[#72a210] hover:text-white"
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          <BookOpen className="w-5 h-5 mr-2" /> Learning Tracks
        </Link>

        <Link
          href="/learner-dashboard/progress"
          className={`flex items-center px-3 py-2 transition-colors duration-200 ${
            isActive("/progress")
              ? "text-[#507800] border-r-4 border-[#72a210] font-medium"
              : "text-gray-700 hover:bg-[#72a210] hover:text-white"
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          <BarChart3 className="w-5 h-5 mr-2" /> Progress
        </Link>

        <Link
          href="/learner-dashboard/gamification"
          className={`flex items-center px-3 py-2 transition-colors duration-200 ${
            isActive("/gamification")
              ? "text-[#507800] border-r-4 border-[#72a210] font-medium"
              : "text-gray-700 hover:bg-[#72a210] hover:text-white"
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          <Gamepad2 className="w-5 h-5 mr-2" /> Gamification
        </Link>

        <Link
          href="/learner-dashboard/labs"
          className={`flex items-center px-3 py-2 transition-colors duration-200 ${
            isActive("/labs")
              ? "text-[#507800] border-r-4 border-[#72a210] font-medium"
              : "text-gray-700 hover:bg-[#72a210] hover:text-white"
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          <FlaskConical className="w-5 h-5 mr-2" /> Lab Guides
        </Link>

        <Link
          href="/learner-dashboard/achievements"
          className={`flex items-center px-3 py-2 transition-colors duration-200 ${
            isActive("/achievements")
              ? "text-[#507800] border-r-4 border-[#72a210] font-medium"
              : "text-gray-700 hover:bg-[#72a210] hover:text-white"
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          <Award className="w-5 h-5 mr-2" /> Achievements
        </Link>

        <Link
          href="/auth/login"
          className={`flex items-center px-3 py-2 transition-colors duration-200 ${
            isActive("/auth/login")
              ? "text-[#507800] border-r-4 border-[#72a210] font-medium"
              : "text-gray-700 hover:bg-[#72a210] hover:text-white"
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </Link>
      </nav>
    </aside>
  );
}
