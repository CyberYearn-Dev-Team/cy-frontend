"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, ChevronDown, LogOut, User, Settings } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminHeader({ setSidebarOpen }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="sticky top-0 z-20 flex items-center h-16 px-6 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex w-full items-center justify-between">
        {/* Mobile sidebar toggle */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>

        {/* Admin Panel title */}
        <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">
          Admin Panel
        </h1>

        {/* User Profile aligned to end */}
        <div className="relative ml-auto" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center space-x-2 focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 bg-[#507800] rounded-full flex items-center justify-center text-white font-medium">
              A
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              Admin User
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">admin@email.com</p>
              </div>

              {/* Profile */}
              <Link href="/admin-dashboard/profile">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <User className="h-4 w-4 mr-2" />Admin Profile
                </button>
              </Link>

              {/* Account Settings */}
              <Link href="/admin-dashboard/account-settings">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" /> Platform Settings
                </button>
              </Link>

              {/* Logout */}
              <Link href="/auth/login">
                <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
