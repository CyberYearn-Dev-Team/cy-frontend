"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/ui/admin-sidebar";
import AdminHeader from "@/components/ui/admin-header";
import {
  Activity,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Database,
  LucideIcon,
} from "lucide-react";

// ✅ Define types for metrics
interface ModuleCompletion {
  module: string;
  rate: number;
}

interface AuditLog {
  id: number;
  action: string;
  user: string;
  timestamp: string;
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
  auditLogs: AuditLog[];
}

// ✅ StatCard props
interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  trendUp,
}) => (
  // Updated StatCard: uses white/gray-800 for card background, and primary colors for icon/trend
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      {/* Icon */}
      <div className="p-3 bg-green-50 dark:bg-green-900/50 rounded-lg">
        {/* Primary Color for Icon */}
        <Icon className="w-6 h-6 text-[#72a210] dark:text-[#507800]" />
      </div>
      {trend && (
        <span
          className={`text-sm font-medium ${
            trendUp
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {trendUp ? "↑" : "↓"} {trend}
        </span>
      )}
    </div>
    {/* Text colors adjusted for light/dark mode */}
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
    {subtitle && <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>}
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
    auditLogs: [],
  });

  // Fetch mock metrics (kept as is)
  useEffect(() => {
    const fetchMetrics = async () => {
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
          auditLogs: [
            { id: 1, action: "User role updated", user: "admin@example.com", timestamp: "2 mins ago" },
            { id: 2, action: "Module published", user: "content@example.com", timestamp: "15 mins ago" },
            { id: 3, action: "Feature flag toggled", user: "admin@example.com", timestamp: "1 hour ago" },
            { id: 4, action: "Bulk user import", user: "admin@example.com", timestamp: "2 hours ago" },
            { id: 5, action: "Settings updated", user: "superadmin@example.com", timestamp: "3 hours ago" },
          ],
        });
      }, 500);
    };
    fetchMetrics();
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
    // 1. Updated main container background
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            {/* 2. Updated text colors */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Platform Overview</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor key metrics and system health</p>
          </div>

          {/* Metrics Grid (StatCard component already updated) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              icon={Users}
              title="Total Registrations"
              value={metrics.totalRegistrations.toLocaleString()}
              trend="12.5%"
              trendUp
            />
            <StatCard
              icon={TrendingUp}
              title="Weekly Active Users"
              value={metrics.wau.toLocaleString()}
              subtitle={`MAU: ${metrics.mau.toLocaleString()}`}
              trend="8.3%"
              trendUp
            />
            <StatCard
              icon={CheckCircle}
              title="First Lesson Completion"
              value={`${metrics.firstLessonCompletionRate}%`}
              subtitle="Of new users"
              trend="5.2%"
              trendUp
            />
            <StatCard
              icon={Clock}
              title="Median Time to First Content"
              value={`${metrics.medianTimeToFirstContent}m`}
              subtitle="Minutes after signup"
              trend="1.8m"
              trendUp={false}
            />
          </div>

          {/* Module Completion & System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Module Completion */}
            {/* 3. Updated block background and header text color */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Module Completion Rates
                </h3>
                <Activity className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="space-y-4">
                {metrics.moduleCompletionRates.map((module, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      {/* Text colors updated */}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{module.module}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{module.rate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      {/* Retained primary color for progress bar */}
                      <div
                        className="bg-[#72a210] h-2 rounded-full transition-all"
                        style={{ width: `${module.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            {/* 4. Updated block background and header text color */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">System Health</h3>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    metrics.systemHealth.status
                  )}`}
                >
                  {metrics.systemHealth.status === "healthy"
                    ? "All Systems Operational"
                    : "Issues Detected"}
                </div>
              </div>
              <div className="space-y-4">
                {/* Background color and text colors updated for health items */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">API Uptime</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Last 30 days</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">{metrics.systemHealth.apiUptime}%</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Sentry Errors</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Last 24 hours</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.systemHealth.errorCount}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <Database className="w-5 h-5 text-[#72a210] dark:text-[#507800] mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Database Status</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Primary & replicas</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">Healthy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Audit Logs */}
          {/* 5. Updated block background and header text color */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Audit Logs</h3>
              {/* Retained primary color for 'View all' link */}
              <a
                href="/admin-dashboard/audit"
                className="text-sm text-[#72a210] hover:text-[#507800] font-medium"
              >
                View all
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table border updated */}
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {/* Header text colors updated */}
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Action</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">User</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.auditLogs.map((log) => (
                    // Row border and hover background updated
                    <tr key={log.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700">
                      {/* Cell text colors updated */}
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">{log.action}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{log.user}</td>
                      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}