"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api/auth";
import AdminSidebar from "@/components/ui/admin-sidebar";
import AdminHeader from "@/components/ui/admin-header";
import Nav from "@/components/ui/admin-nav";

// 🎨 Theme Colors
const primary = "#72a210";
const secondary = "#507800";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLight = "text-gray-500 dark:text-gray-300";

import {
  Activity,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Database,
  Loader2,
  type LucideIcon,
} from "lucide-react";

// Types
interface ModuleCompletion {
  module: string;
  rate: number;
}
interface SystemHealth {
  apiUptime: number;
  errorCount: number;
  status: "healthy" | "warning" | "error" | "loading";
}
interface Metrics {
  totalRegistrations: number;
  wau: number;
  mau: number;
  firstLessonCompletionRate: number;
  medianTimeToFirstContent: number;
  moduleCompletionRates: ModuleCompletion[];
  systemHealth: SystemHealth;
}

// 📊 StatCard (responsive layout)
interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
}
const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, subtitle }) => (
 <div
  className={`${bgCard} border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-6 hover:shadow-md transition-all duration-300 flex sm:flex-row sm:items-center sm:justify-between gap-4`}
>
  <div className="flex-1">
    <h3 className={`text-sm font-medium ${textLight}`}>{title}</h3>
    <p className={`mt-1 text-3xl font-bold ${textDark}`}>{value}</p>
    {subtitle && <p className={`mt-1 text-sm ${textMedium}`}>{subtitle}</p>}
  </div>

  <div
    className="p-3 bg-[#f4fce2] dark:bg-[#2b2e17] rounded-xl flex-shrink-0 flex items-center justify-center self-start sm:self-auto"
  >
    {/* Updated icon color to your brand green (#72a210) */}
    <Icon className="w-6 h-6" style={{ color: "#72a210" }} />
  </div>
</div>

);

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({
    totalRegistrations: 0,
    wau: 0,
    mau: 0,
    firstLessonCompletionRate: 0,
    medianTimeToFirstContent: 0,
    moduleCompletionRates: [],
    systemHealth: {
      apiUptime: 0,
      errorCount: 0,
      status: "loading",
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setMetrics({
        totalRegistrations: 12847,
        wau: 3456,
        mau: 8923,
        firstLessonCompletionRate: 78.5,
        medianTimeToFirstContent: 4.2,
        moduleCompletionRates: [
          { module: "Introduction to AI", rate: 89.2 },
          { module: "Python Basics", rate: 76.8 },
          { module: "Machine Learning", rate: 68.4 },
          { module: "Deep Learning", rate: 62.1 },
          { module: "Advanced Topics", rate: 54.7 },
        ],
        systemHealth: {
          apiUptime: 99.97,
          errorCount: 23,
          status: "healthy",
        },
      });
    }, 500);
  }, []);

  const getStatusColor = (status: SystemHealth["status"]) => {
    if (status === "healthy")
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/50";
    if (status === "warning")
      return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/50";
    if (status === "error")
      return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50";
    return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700";
  };

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-8 pb-30">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className={`text-3xl font-bold tracking-tight ${textDark}`}>
                Platform Overview
              </h2>
              <p className={`${textMedium} mt-1`}>
                Monitor key performance metrics and system health in real time.
              </p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard icon={Users} title="Total Registrations" value={metrics.totalRegistrations.toLocaleString()} />
            <StatCard icon={TrendingUp} title="Weekly Active Users" value={metrics.wau.toLocaleString()} subtitle={`MAU: ${metrics.mau.toLocaleString()}`} />
            <StatCard icon={CheckCircle} title="First Lesson Completion" value={`${metrics.firstLessonCompletionRate}%`} subtitle="Of new users" />
            <StatCard icon={Clock} title="Median Time to First Content" value={`${metrics.medianTimeToFirstContent}m`} subtitle="Minutes after signup" />
          </div>

          {/* Module Completion + System Health */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Module Completion */}
            <div className={`${bgCard} border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${textDark}`}>Module Completion Rates</h3>
                <Activity className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="space-y-5">
                {metrics.moduleCompletionRates.map((module, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${textMedium}`}>{module.module}</span>
                      <span className={`text-sm font-semibold ${textDark}`}>{module.rate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${module.rate}%`, backgroundColor: primary }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className={`${bgCard} border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${textDark}`}>System Health</h3>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    metrics.systemHealth.status
                  )}`}
                >
                  {metrics.systemHealth.status === "healthy" ? "Operational" : "Issues Detected"}
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 mr-3" style={{ color: primary }} />
                    <div>
                      <p className={`text-sm font-medium ${textDark}`}>API Uptime</p>
                      <p className={`text-xs ${textLight}`}>Last 30 days</p>
                    </div>
                  </div>
                  <span className={`text-2xl font-bold`} style={{ color: primary }}>
                    {metrics.systemHealth.apiUptime}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                    <div>
                      <p className={`text-sm font-medium ${textDark}`}>Sentry Errors</p>
                      <p className={`text-xs ${textLight}`}>Last 24 hours</p>
                    </div>
                  </div>
                  <span className={`text-2xl font-bold ${textDark}`}>
                    {metrics.systemHealth.errorCount}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center">
                    <Database className="w-5 h-5 mr-3" style={{ color: primary }} />
                    <div>
                      <p className={`text-sm font-medium ${textDark}`}>Database Status</p>
                      <p className={`text-xs ${textLight}`}>Primary & replicas</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold`} style={{ color: primary }}>
                    Healthy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Nav />
      </div>
    </div>
  );
}
