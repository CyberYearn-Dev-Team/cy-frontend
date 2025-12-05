"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Moon,
  Sun,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getTechnicalIssues, TechnicalIssue } from "@/lib/services/technicalIssueService";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const theme = localStorage.getItem("theme");
      localStorage.clear();
      sessionStorage.clear();
      if (theme) localStorage.setItem("theme", theme);

      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });

      toast.info("You have been logged out securely.", {
        description: "Please log in again to continue.",
      });

      setShowLogoutConfirm(false);
      setTimeout(() => {
        router.replace("/auth/login");
      }, 1000);
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

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center h-16 px-3 lg:px-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <div className="flex w-full items-center justify-between">
          {/* Mobile sidebar toggle */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Right side controls */}
          <div className="flex items-center gap-4 ml-auto">
            {/* 🔔 Bell icon wrapped with Link */}
            <Link href="/learner-dashboard/technical-issues-answers">
              <div className="relative cursor-pointer">
                <div className="relative">
                  <Bell className="h-6 w-6 text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </div>
              </div>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-400 cursor-pointer" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 cursor-pointer" />
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center space-x-2 focus:outline-none cursor-pointer"
              >
                <div className="w-9 h-9 bg-[#72a210] rounded-full flex items-center justify-center text-white font-semibold text-[20px] overflow-hidden">
                  {loading ? (
                    "..."
                  ) : user?.data?.profileImage || user?.profileImage ? (
                    <img
                      src={user?.data?.profileImage || user?.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (user?.data?.email || user?.email)
                      ?.charAt(0)
                      .toUpperCase() || "U"
                  )}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {loading
                    ? "Loading..."
                    : user?.data?.username ||
                      user?.username ||
                      user?.data?.email ||
                      user?.email ||
                      "User"}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-30">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {loading
                        ? "Loading..."
                        : user?.data?.username || user?.username || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {loading
                        ? "Loading..."
                        : user?.data?.email || user?.email || "user@email.com"}
                    </p>
                  </div>

                  <Link href="/learner-dashboard/profile">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <User className="h-4 w-4 mr-2" /> Profile
                    </button>
                  </Link>

                  <Link href="/learner-dashboard/account-setting">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" /> Account Settings
                    </button>
                  </Link>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-80 p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowLogoutConfirm(false)}
                className="w-28 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-28 bg-destructive hover:bg-destructive/90 dark:bg-destructive dark:hover:bg-destructive/90 text-white cursor-pointer"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
