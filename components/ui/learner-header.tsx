"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, ChevronDown, LogOut, User, Settings, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/api/auth";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        console.log("🔍 [learner-header] Received user data:", userData);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle theme toggle
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

  // Close dropdown if clicking outside
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
    <header className="sticky top-0 z-20 flex items-center h-16 px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
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
        
          {/* User Profile aligned to end */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-2 focus:outline-none cursor-pointer"
            >
              <div className="w-8 h-8 bg-[#72a210] rounded-full flex items-center justify-center text-white font-medium">
                {loading ? "..." : (user?.data?.email || user?.email)?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
  {loading
    ? "Loading..."
    : user?.data?.username || user?.username || user?.data?.email || user?.email || "User"}
</span>

              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Dropdown Menu */}
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


                {/* Profile link */}
                <Link href="/learner-dashboard/profile">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <User className="h-4 w-4 mr-2" /> Profile
                  </button>
                </Link>

                {/* Settings */}
                <Link href="/learner-dashboard/account-setting">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" /> Account Settings
                  </button>
                </Link>

                {/* Logout */}
                <Link href="/auth/login">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </button>
                </Link>
              </div>
            )}
          </div>

          
        </div>
      </div>
    </header>
  );
}
