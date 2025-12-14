"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Server } from "lucide-react";
import { getCurrentUser } from "@/lib/api/auth";
import { getOverviewData } from "@/lib/services/overviewService";
import AdminSidebar from "@/components/admin-sidebar";
import AdminHeader from "@/components/admin-header";
import Nav from "@/components/admin-nav";
import { DashboardSkeleton } from "@/components/ui/dashboard-skeleton";

// 🎨 Theme Colors
const primary = "#72a210";
const secondary = "#507800";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLight = "text-gray-500 dark:text-gray-300";

import {
  Users,
  TrendingUp,
  CheckCircle,
  Loader2,
  ShieldCheck,
  Database,
  type LucideIcon,
  BookOpen,
  UserCheck,
  BarChart2,
  RefreshCw,
  AlertCircle,
  CheckSquare,
  Layers,
  Target,
} from "lucide-react";

// Types
interface Metrics {
  totalRgistrations: number;
  usersThatHaveCompletedFirstLesson: number;
  weeklyActiveUsers: number;
  firstLessonCompletionRate: number;
  totalModules: number;
  completedModules: number;
  moduleConpletionRate: number;
}

// 📊 StatCard
interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
}
const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  subtitle,
}) => (
  <div
    className={`${bgCard} border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-6 hover:shadow-md transition-all duration-300 flex sm:flex-row sm:items-center sm:justify-between gap-4`}
  >
    <div className="flex-1">
      <h3 className={`text-sm font-medium ${textLight}`}>{title}</h3>
      <p className={`mt-1 text-3xl font-bold ${textDark}`}>{value}</p>
      {subtitle && <p className={`mt-1 text-sm ${textMedium}`}>{subtitle}</p>}
    </div>

    <div className="p-3 bg-[#f4fce2] dark:bg-[#2b2e17] rounded-xl flex-shrink-0 flex items-center justify-center self-start sm:self-auto">
      <Icon className="w-6 h-6" style={{ color: "#72a210" }} />
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<Metrics>({
    totalRgistrations: 0,
    usersThatHaveCompletedFirstLesson: 0,
    weeklyActiveUsers: 0,
    firstLessonCompletionRate: 0,
    totalModules: 0,
    completedModules: 0,
    moduleConpletionRate: 0,
  });

  // Fetch metrics data
  const fetchMetrics = async () => {
    try {
      const data = await getOverviewData();
      setMetrics(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching overview data:", err);
      setError("Failed to load dashboard data. Please try again later.");
      setLoading(false);
    }
  };

  // Check auth and fetch data on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push("/login");
        } else {
          await fetchMetrics();
        }
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  // The loading state is now handled within the main content area

  if (error) {
    return (
      <div className={`flex h-screen overflow-hidden ${bgLight}`}>
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-8 pb-30 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-gray-100">
                Error loading dashboard
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {error}
              </p>
              <div className="mt-6">
                <button
                  onClick={fetchMetrics}
                  className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </button>
              </div>
            </div>
          </main>
          <Nav />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-8 pb-30">
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2
                    className={`text-3xl font-bold tracking-tight ${textDark}`}
                  >
                    Platform Overview
                  </h2>
                  <p className={`${textMedium} mt-1`}>
                    Monitor key performance metrics and system health in real
                    time.
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                  icon={Users}
                  title="Total Registrations"
                  value={metrics.totalRgistrations.toLocaleString()}
                />
                <StatCard
                  icon={TrendingUp}
                  title="Weekly Active Users"
                  value={metrics.weeklyActiveUsers.toLocaleString()}
                />
                <StatCard
                  icon={UserCheck}
                  title="First Lesson Completed"
                  value={metrics.usersThatHaveCompletedFirstLesson.toLocaleString()}
                  subtitle={`${metrics.firstLessonCompletionRate}% completion rate`}
                />
                <StatCard
                  icon={CheckSquare}
                  title="Module Progress"
                  value={`${metrics.completedModules}/${metrics.totalModules}`}
                  subtitle={`${metrics.moduleConpletionRate}% completed`}
                />
              </div>

              {/* Module Completion + System Health */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Module Completion */}
                <div
                  className={`${bgCard} border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-semibold ${textDark}`}>
                      Module Completion
                    </h3>
                  </div>

                  <div className="space-y-10">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${textDark}`}>
                          Overall Progress
                        </span>
                        <span className="text-sm font-medium">
                          {metrics.moduleConpletionRate}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-[#72a210] h-2.5 rounded-full"
                          style={{ width: `${metrics.moduleConpletionRate}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${textDark}`}>
                          Total Modules
                        </span>
                        <span className="text-sm font-medium">
                          {metrics.totalModules}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-[#72a210] h-2.5 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${textDark}`}>
                          Completed Modules
                        </span>
                        <span className="text-sm font-medium">
                          {metrics.completedModules} of {metrics.totalModules}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-[#72a210] h-2.5 rounded-full"
                          style={{
                            width: `${
                              (metrics.completedModules /
                                metrics.totalModules) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${textDark}`}>
                          First Lesson Completion
                        </span>
                        <span className="text-sm font-medium">
                          {metrics.firstLessonCompletionRate}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-[#72a210] h-2.5 rounded-full"
                          style={{
                            width: `${metrics.firstLessonCompletionRate}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Status */}
                <div
                  className={`${bgCard} border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-semibold ${textDark}`}>
                      System Status
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Authentication */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="flex items-center">
                        <ShieldCheck
                          className="w-5 h-5 mr-3"
                          style={{ color: primary }}
                        />
                        <div>
                          <p className={`text-sm font-medium ${textDark}`}>
                            Authentication
                          </p>
                          <p className={`text-xs ${textLight}`}>
                            User login & security
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        Stable
                      </span>
                    </div>

                    {/* Database */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="flex items-center">
                        <Server
                          className="w-5 h-5 mr-3"
                          style={{ color: primary }}
                        />
                        <div>
                          <p className={`text-sm font-medium ${textDark}`}>
                            Database
                          </p>
                          <p className={`text-xs ${textLight}`}>
                            Primary & replicas
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        Healthy
                      </span>
                    </div>

                    {/* API */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="flex items-center">
                        <Database
                          className="w-5 h-5 mr-3"
                          style={{ color: primary }}
                        />
                        <div>
                          <p className={`text-sm font-medium ${textDark}`}>
                            API Status
                          </p>
                          <p className={`text-xs ${textLight}`}>
                            Backend connection
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        Operational
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        <Nav />
      </div>
    </div>
  );
}
