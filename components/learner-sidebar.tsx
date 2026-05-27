"use client";

import Link from "next/link";
import { getCurrentUser } from "@/lib/services/authService";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Home,
  BookOpen,
  FlaskConical,
  BarChart3,
  Award,
  ThumbsUp,
  BadgeCheck,
  Gem,
  LogOut,
  Settings,
  LayoutGrid,
  Lock,
  Shield,
  User,
  UserCog,
  X,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { isFeatureEnabled } from "@/lib/utils/featureFlags";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const basePath = "/learner-dashboard";
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // Fetch role on mount

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await getCurrentUser();
        // The response structure is { message: string, data: { roles: string[] } }
        const roles = response?.data?.roles || [];
        // console.log('User roles:', roles); // Debug log
        
        if (Array.isArray(roles) && roles.length > 0) {
          setUserRoles(roles.map((r: string) => r.toUpperCase()));
        } else {
          setUserRoles([]);
        }
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        setUserRoles([]);
      }
    }

    fetchUserRole();
  }, []);

  const [leaderboardEnabled, setLeaderboardEnabled] = useState(false);

  // Check if leaderboard is enabled
  useEffect(() => {
    const checkLeaderboardStatus = async () => {
      try {
        const isEnabled = await isFeatureEnabled("Leaderboard");
        setLeaderboardEnabled(isEnabled);
      } catch (error) {
        console.error("Error checking leaderboard status:", error);
        setLeaderboardEnabled(false);
      }
    };

    checkLeaderboardStatus();
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
    { name: "Dashboard", icon: LayoutGrid, href: `${basePath}/dashboard` },
    { name: "Learning Tracks", icon: BookOpen, href: `${basePath}/tracks` },
    { name: "Lab Guides", icon: FlaskConical, href: `${basePath}/labs` },
    { name: "Achievements", icon: Gem, href: `${basePath}/achievements` },
    ...(leaderboardEnabled ? [{ name: "Leaderboard", icon: Trophy, href: `${basePath}/leaderboard` }] : []),
    { name: "Overall Progress", icon: BarChart3, href: `${basePath}/progress` },
    // { name: "Account Profile", icon: User, href: `${basePath}/profile` },
    { name: "Share Feedback", icon: ThumbsUp, href: `${basePath}/feedback` },
    { name: "Community Reviews", icon: BadgeCheck, href: `${basePath}/reviews` },
    // { name: "Account Settings", icon: Settings, href: `${basePath}/account-setting` },
  ];

  // Only show "Switch to Admin" if user has ADMIN role
if (userRoles.includes("ADMIN")) {
    sidebarItems.push({
      name: "Switch to Admin",
      icon: Lock,
      href: "/admin-dashboard/overview",
    });
  }

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-67 border-r h-screen sticky top-0 bg-white dark:bg-gray-900 flex-col shadow-xl">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center h-15 px-4 border-b border-gray-200 dark:border-gray-700">
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

        {/* Navigation Links */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-6 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {sidebarItems.map(({ name, icon: Icon, href }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center px-3 py-3 rounded-md transition-colors duration-200 ${
                isActive(href)
                  ? "text-[#72a210] dark:text-[#a3e635] font-medium bg-gray-100 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-200 hover:bg-[#72a210] hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="text-sm font-normal font-semibold">{name}</span>
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
            <span className="text-sm font-normal">
              Logout My Account
            </span>
          </button>
        </div>
      </aside>




      

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-20 backdrop-blur-md bg-black/60 lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed top-0 left-0 w-full h-full bg-white dark:bg-gray-900 z-100 flex flex-col shadow-xl lg:hidden">
            {/* Mobile Logo + Close */}
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

            {/* Mobile Navigation Links */}
            <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-6 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {sidebarItems.map(({ name, icon: Icon, href }) => (
                <Link
                  key={name}
                  href={href}
                  className={`flex items-center px-3 py-2.5 rounded-md transition-colors duration-200 ${
                    isActive(href)
                      ? "text-[#72a210] dark:text-[#a3e635] font-medium bg-gray-100 dark:bg-gray-800"
                      : "text-gray-700 dark:text-gray-200 hover:bg-[#72a210] hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="text-sm font-normal font-semibold tracking-widest">{name}</span>
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
                <span className="text-sm font-normal">
                  Logout My Account
                </span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-[1.5rem] shadow-2xl w-full max-w-sm p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-black tracking-tighter text-gray-900 dark:text-gray-100 mb-2">
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
                onClick={() => {
                  router.push("/auth/login");
                  toast.success("Successfully signed out");
                  setShowLogoutConfirm(false);
                  setCountdown(10);
                }}
                className="flex-1 px-6 py-3 rounded-lg bg-[#72a210] dark:bg-[#8bc928 ] cursor-pointer text-white font-bold text-xs uppercase tracking-widest hover:bg-[#5a8c0d] dark:hover:bg-[#72a210] transition-colors"
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
