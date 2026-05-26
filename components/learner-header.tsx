"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  LogOut,
  User,
  Moon,
  Sun,
  Bell,
  Zap,
  ChevronDown,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { getCurrentUser, logoutUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getTechnicalIssues, TechnicalIssue } from "@/lib/services/technicalIssueService";
import { getGamificationData } from "@/lib/services/gamificationService";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [xp, setXp] = useState(0);

  // 🔔 Badge Number
  const [notificationCount, setNotificationCount] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Fetch user and notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);

        // Fetch technical issues and count pending ones for the current user
        const issues = await getTechnicalIssues();
        const pendingCount = issues.filter(
          (issue: TechnicalIssue) =>
            issue.userId === userData?.id &&
            issue.status === 'PENDING' &&
            !issue.adminReply
        ).length;

        setNotificationCount(pendingCount);

        // Fetch XP
        const gamificationResponse = await getGamificationData();
        if (gamificationResponse?.data) {
          setXp(gamificationResponse.data.totalXp || 0);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  // Logout countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showLogoutConfirm && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setShowLogoutConfirm(false);
      setCountdown(10);
    }
    return () => clearTimeout(timer);
  }, [showLogoutConfirm, countdown]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await logoutUser();

      const theme = localStorage.getItem("theme");
      localStorage.clear();
      sessionStorage.clear();
      if (theme) localStorage.setItem("theme", theme);

      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });

      toast.success("Successfully signed out");

      setShowLogoutConfirm(false);
      setCountdown(10);
      router.replace("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.data?.username || user?.username || "User";
  const displayEmail = user?.data?.email || user?.email || "";

  return (
    <>
      <header className="h-15 border-b border-border flex items-center justify-between gap-4 px-4 sm:px-6 bg-white dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        {/* Left — mobile menu toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-white" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Notification Bell */}
          <Link href="/learner-dashboard/technical-issues-answers">
            <div className="relative cursor-pointer">
              <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-colors" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-gray-900">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </div>
          </Link>

          {/* Combined User dropdown wrapper for tracking clicks on both desktop and mobile layouts */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-3 pl-0 lg:pl-4 lg:border-l border-gray-200 dark:border-gray-700">
              
              {/* User info + avatar — desktop only */}
              <div className="hidden lg:flex items-center gap-2">
                <div className="text-right mr-1">
                  <p className="text-[8px] text-[#72a210] dark:text-[#a3e635] font-bold uppercase tracking-widest mt-0.5">
                    Total XP
                  </p>
                  <p className="text-xs font-black text-gray-900 dark:text-gray-100 leading-none">
                    {loading ? "..." : `${xp || 0} XP`}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black uppercase tracking-tight leading-none text-gray-900 dark:text-gray-100">
                    {loading ? "Loading..." : displayName}
                  </p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tighter mt-1 truncate max-w-[140px]">
                    {loading ? "" : displayEmail}
                  </p>
                </div>

                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 focus:outline-none cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#72a210] dark:hover:border-[#a3e635] transition-colors overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    {user?.data?.profileImage || user?.profileImage ? (
                      <img
                        src={user?.data?.profileImage || user?.profileImage}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="https://github.com/shadcn.png"
                        alt="Default Profile"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* User avatar — mobile only */}
              <div className="flex lg:hidden items-center">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="w-10 h-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#72a210] dark:hover:border-[#a3e635] transition-colors overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800"
                  title="Toggle Dropdown Menu"
                >
                  {user?.data?.profileImage || user?.profileImage ? (
                    <img
                      src={user?.data?.profileImage || user?.profileImage}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="https://github.com/shadcn.png"
                      alt="Default Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              </div>
              
            </div>

            {/* Shares the same dropdown element across desktop and mobile screens */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-70 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-30">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-black tracking-widest text-gray-800 dark:text-gray-100">
                    {loading ? "Loading..." : displayName}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-tighter">
                    {loading ? "Loading..." : displayEmail}
                  </p>
                </div>

                <Link href="/learner-dashboard/profile">
                  <button className="flex items-center w-full px-4 py-3 text-xs font-black   tracking-widest text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <User className="h-5 w-5 mr-2" /> My Profile
                  </button>
                </Link>

                <Link href="/learner-dashboard/account-setting">
                  <button className="flex items-center w-full px-4 py-3 text-xs font-black   tracking-widest text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <Settings className="h-5 w-5 mr-2" /> Account Settings
                  </button>
                </Link>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="flex items-center w-full px-4 py-3 text-xs font-black tracking-widest text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <LogOut className="h-5 w-5 mr-2" /> Logout My Account
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-[1.5rem] shadow-2xl w-full max-w-sm p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-gray-100 mb-2">
              Logout
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to sign out? You'll need to log in again to
              access your account.
            </p>

            {/* Countdown Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                <span>Auto-closing in...</span>
                <span>{countdown}s</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[#72a210] dark:bg-[#a3e635] h-2 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex sm:flex-row gap-3 mt-6">
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  setCountdown(10);
                }}
                className="flex-1 px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-800 cursor-pointer text-gray-900 dark:text-gray-100 font-bold text-xs uppercase tracking-widest"
              >
                Stay
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 rounded-lg bg-[#72a210] dark:bg-[#a3e635] cursor-pointer text-white font-bold text-xs uppercase tracking-widest hover:bg-[#5a8c0d] dark:hover:bg-[#72a210] transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}