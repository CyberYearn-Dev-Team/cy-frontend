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
  Trophy,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const basePath = "/learner-dashboard";

  const sidebarItems = [
    { name: "Dashboard", icon: Home, href: `${basePath}/dashboard` },
    { name: "Learning Tracks", icon: BookOpen, href: `${basePath}/tracks` },
    { name: "Lab Guides", icon: FlaskConical, href: `${basePath}/labs` },
    { name: "Progress", icon: BarChart3, href: `${basePath}/progress` },
    { name: "Achievements", icon: Award, href: `${basePath}/achievements` },
    { name: "Leaderboard", icon: Trophy, href: `${basePath}/leaderboard` },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 backdrop-blur-md bg-transparent lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-30 
        w-[85%] sm:w-[70%] md:w-[60%] lg:w-64
        transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        transition-transform duration-200 ease-in-out 
        lg:translate-x-0 lg:static lg:inset-0 shadow-xl`}
      >
        {/* Logo + Close */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <img
              src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/dark%20logo.png"
              alt="Logo"
              className="h-10 w-auto block dark:hidden"
            />
            <img
              src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/light%20logo.png"
              alt="Logo"
              className="h-10 w-auto hidden dark:block"
            />
          </div>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-6 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {sidebarItems.map(({ name, icon: Icon, href }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                isActive(href)
                  ? "text-[#72a210] dark:text-[#a3e635] font-medium bg-gray-100 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-200 hover:bg-[#72a210] hover:text-white"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="w-5 h-5 mr-2" /> {name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
