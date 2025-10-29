"use client";

import React, { useState, useEffect } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { getCurrentUser } from "@/lib/api/auth";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminHeader({ setSidebarOpen }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Theme toggle handler
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

  return (
    <header className="sticky top-0 z-20 flex items-center h-16 px-3 lg:px-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="flex w-full items-center justify-between">
        {/* Mobile sidebar toggle */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Admin Panel title */}
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 hidden sm:block">
          Admin Panel
        </h1>

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

          {/* User Avatar & Name */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#72a210] rounded-full flex items-center justify-center text-white font-semibold text-[18px]">
              {loading
                ? "..."
                : (user?.data?.email || user?.email)?.charAt(0).toUpperCase() || "A"}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
              {loading
                ? "Loading..."
                : user?.data?.username ||
                  user?.username ||
                  user?.data?.email ||
                  user?.email ||
                  "Admin"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
