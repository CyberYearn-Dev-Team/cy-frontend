"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  BarChart3,
  ToggleLeft,
  Activity,
  Settings,
  Shield,
  LogOut,
  GraduationCap,
  X,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const basePath = "/admin-dashboard";

  const sidebarItems = [
    { name: "Overview", icon: Home, href: `${basePath}/overview` },
    { name: "User Management", icon: Users, href: `${basePath}/users` },
    { name: "Metrics & Reports", icon: BarChart3, href: `${basePath}/metrics` },
    { name: "Feature Flags", icon: ToggleLeft, href: `${basePath}/feature-flags` },
    { name: "Audit Logs", icon: Activity, href: `${basePath}/audit` },
    { name: "Platform Settings", icon: Settings, href: `${basePath}/settings` },
    { name: "Security", icon: Shield, href: `${basePath}/security` },
    {
      name: "Switch to Learner",
      icon: GraduationCap,
      href: `/learner-dashboard/dashboard`,
    },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    router.push("/auth/login");
  };

  return (
    <>
      {/* ✅ Blurred overlay for the rest of the screen */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-30 
        w-[85%] sm:w-[70%] md:w-[60%] lg:w-64
        transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0 shadow-xl`}
      >
        {/* Logo and Close */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {/* Light mode logo */}
            <img
              src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/dark%20logo.png"
              alt="Logo"
              className="h-10 w-auto block dark:hidden"
            />
            {/* Dark mode logo */}
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

        {/* Nav Items */}
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

          {/* Logout */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-[#72a210] hover:text-white transition-colors duration-200 rounded-md"
          >
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </button>
        </nav>
      </aside>

      {/* ✅ Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80 p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-[#72a210] hover:bg-[#507800] text-white transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
