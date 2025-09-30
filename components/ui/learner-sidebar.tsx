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
    { name: "Progress", icon: BarChart3, href: `${basePath}/progress` },
    { name: "Lab Guides", icon: FlaskConical, href: `${basePath}/labs` },
    { name: "Achievements", icon: Award, href: `${basePath}/achievements` },
    { name: "Leaderboard", icon: Trophy, href: `${basePath}/leaderboard` },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <aside
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-30 w-full lg:w-64 transform bg-white border-r border-gray-200 
      transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 bg-gray-50`}
    >
      {/* Logo and Close */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img
            src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/logo.png"
            alt="Logo"
            className="h-8 sm:h-10 md:h-12 w-auto" // 🔹 smaller on mobile
          />
        </div>
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Nav bar */}
      <nav className="px-4 py-10 space-y-2 overflow-y-auto h-[calc(100%-4rem)]">
        {sidebarItems.map(({ name, icon: Icon, href }) => (
          <Link
            key={name}
            href={href}
            className={`flex items-center px-3 py-2 transition-colors duration-200 ${
              isActive(href)
                ? "text-[#507800] border-r-4 border-[#72a210] font-medium"
                : "text-gray-700 hover:bg-[#72a210] hover:text-white"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon className="w-5 h-5 mr-2" /> {name}
          </Link>
        ))}

        {/* Logout */}
        <Link
          href="/auth/login"
          className="flex items-center px-3 py-2 text-gray-700 hover:bg-[#72a210] hover:text-white transition-colors duration-200"
          onClick={() => setSidebarOpen(false)}
        >
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </Link>
      </nav>
    </aside>
  );
}
