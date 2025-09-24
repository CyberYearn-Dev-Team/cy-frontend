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
  Trophy,
  FileText,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

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
    { name: "Gamification", icon: Gamepad2, href: `${basePath}/gamification` },
    { name: "Lab Guides", icon: FlaskConical, href: `${basePath}/labs` },
    { name: "Achievements", icon: Award, href: `${basePath}/achievements` },
    { name: "Leaderboard", icon: Trophy, href: `${basePath}/leaderboard` },
  ];

  const legalPages = [
    { name: "Terms of Service", href: `${basePath}/legalpages/terms` },
    { name: "Privacy Policy", href: `${basePath}/legalpages/privacy` },
    { name: "Cookie Policy", href: `${basePath}/legalpages/cookies` },
    { name: "Acceptable Use Policy", href: `${basePath}/legalpages/aup` },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  // Determine if any legal page is active
  const isLegalActive = legalPages.some((page) => isActive(page.href));

  // Automatically open legal dropdown if on a legal page
  const [legalOpen, setLegalOpen] = useState(isLegalActive);

  useEffect(() => {
    if (isLegalActive) setLegalOpen(true);
  }, [pathname, isLegalActive]);

  return (
    <aside
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-30 w-full lg:w-64 transform bg-white border-r border-gray-200 
      transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 bg-gray-50`}>
      {/* Logo and Close */}
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
          onClick={() => setSidebarOpen(false)}>
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
            onClick={() => setSidebarOpen(false)}>
            <Icon className="w-5 h-5 mr-2" /> {name}
          </Link>
        ))}

        {/* Legal Pages */}
        <div>
          <button
            className={`flex items-center justify-between w-full px-3 py-2 transition-colors duration-200 ${
              isLegalActive
                ? "text-[#507800] border-r-4 border-[#72a210] font-medium"
                : "text-gray-700 hover:bg-[#72a210] hover:text-white"
            }`}
            onClick={() => setLegalOpen(!legalOpen)}>
            <span className="flex items-center">
              <FileText className="w-5 h-5 mr-2" /> Legal Pages
            </span>
            {legalOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {legalOpen && (
            <div className="ml-6 mt-1 space-y-1">
              {legalPages.map(({ name, href }) => (
                <Link
                  key={name}
                  href={href}
                  className={`block px-3 py-2 text-sm rounded transition-colors duration-200 ${
                    isActive(href)
                      ? "text-[#507800] font-medium"
                      : "text-gray-600 hover:bg-[#72a210] hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}>
                  {name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <Link
          href="/auth/login"
          className="flex items-center px-3 py-2 text-gray-700 hover:bg-[#72a210] hover:text-white transition-colors duration-200"
          onClick={() => setSidebarOpen(false)}>
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </Link>
      </nav>
    </aside>
  );
}
