"use client";

import { useState, useEffect } from "react";
import { getTechnicalIssues } from "@/lib/services/technicalIssueService";
import { logoutUser } from "@/lib/api/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  ToggleLeft,
  Activity,
  Bug,
  User,
  Siren,
  ListChecks,
  ShieldAlert,
  LogOut,
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
  const [countdown, setCountdown] = useState(10);
  const [pendingIssuesCount, setPendingIssuesCount] = useState(0);

  const basePath = "/admin-dashboard";

  useEffect(() => {
    const fetchPendingIssues = async () => {
      try {
        const issues = await getTechnicalIssues();
        const pendingCount = issues.filter(issue => issue.status === 'PENDING').length;
        setPendingIssuesCount(pendingCount);
      } catch (error) {
        console.error('Error fetching pending issues:', error);
      }
    };

    fetchPendingIssues();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingIssues, 30000);

    return () => clearInterval(interval);
  }, []);

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

  const sidebarItems = [
    { name: "Overview", icon: LayoutDashboard, href: `${basePath}/overview` },
    { name: "Audit Logs", icon: Activity, href: `${basePath}/audit` },
    { name: "Feature Flags", icon: ToggleLeft, href: `${basePath}/feature-flags` },
    { name: "Metrics & Reports", icon: BarChart3, href: `${basePath}/metrics` },
    { name: "User Management", icon: Users, href: `${basePath}/users` },
    { name: "Platform Security", icon: ShieldAlert, href: `${basePath}/security` },
    { name: "Review Management", icon: ListChecks, href: `${basePath}/reviews` },

    // Technical Issues with Badge
    {
      name: "Technical Issues",
      icon: Bug,
      href: `${basePath}/technical-issues`,
      count: pendingIssuesCount > 0 ? pendingIssuesCount : undefined,
    },

    {
      name: "Switch to Learner",
      icon: User,
      href: `/learner-dashboard/dashboard`,
    },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

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

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-67 border-r h-screen sticky top-0 bg-white dark:bg-gray-900 flex-col shadow-xl">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
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
        </div>

        {/* Nav Links */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-6 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {sidebarItems.map(({ name, icon: Icon, href, count }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center justify-between px-3 py-3 rounded-md transition-colors duration-200 ${
                isActive(href)
                  ? "text-[#72a210] dark:text-[#a3e635] font-medium bg-gray-100 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-200 hover:bg-[#72a210] hover:text-white"
              }`}
            >
              {/* Icon + Name */}
              <div className="flex items-center">
                <Icon className="w-5 h-5 mr-5" />
                <span className="text-sm font-normal font-semibold tracking-widest">{name}</span>
              </div>

              {/* Badge */}
              {count !== undefined && (
                <span className="ml-2 text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all rounded-md group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">
              Logout My Account
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed top-0 left-0 w-full h-full bg-white dark:bg-gray-900 z-100 flex flex-col shadow-xl lg:hidden">
            {/* Mobile Logo + Close Button */}
            <div className="flex-shrink-0 flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
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
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-6 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {sidebarItems.map(({ name, icon: Icon, href, count }) => (
                <Link
                  key={name}
                  href={href}
                  className={`flex items-center justify-between px-3 py-3 rounded-md transition-colors duration-200 ${
                    isActive(href)
                      ? "text-[#72a210] dark:text-[#a3e635] font-medium bg-gray-100 dark:bg-gray-800"
                      : "text-gray-700 dark:text-gray-200 hover:bg-[#72a210] hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {/* Icon + Name */}
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-5" />
                    <span className="text-sm font-normal font-semibold tracking-widest">{name}</span>
                  </div>

                  {/* Badge */}
                  {count !== undefined && (
                    <span className="ml-2 text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Mobile Logout */}
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all rounded-md group"
              >
                <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">
                  Logout My Account
                </span>
              </button>
            </div>
          </aside>
        </>
      )}

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
