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
  <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      {trend && (
        <span
          className={`text-sm font-medium ${
            trendUp ? "text-green-600" : "text-red-600"
          }`}
        >
          {trendUp ? "↑" : "↓"} {trend}
        </span>
      )}
    </div>
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
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

  // ✅ Fetch mock data
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
            {
              id: 1,
              action: "User role updated",
              user: "admin@example.com",
              timestamp: "2 mins ago",
            },
            {
              id: 2,
              action: "Module published",
              user: "content@example.com",
              timestamp: "15 mins ago",
            },
            {
              id: 3,
              action: "Feature flag toggled",
              user: "admin@example.com",
              timestamp: "1 hour ago",
            },
            {
              id: 4,
              action: "Bulk user import",
              user: "admin@example.com",
              timestamp: "2 hours ago",
            },
            {
              id: 5,
              action: "Settings updated",
              user: "superadmin@example.com",
              timestamp: "3 hours ago",
            },
          ],
        });
      }, 500);
    };

    fetchMetrics();
  }, []);

  const getStatusColor = (status: SystemHealth["status"]) => {
    if (status === "healthy") return "text-green-600 bg-green-50";
    if (status === "warning") return "text-yellow-600 bg-yellow-50";
    if (status === "error") return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Platform Overview</h2>
            <p className="text-gray-600 mt-1">Monitor key metrics and system health</p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              icon={Users}
              title="Total Registrations"
              value={metrics.totalRegistrations.toLocaleString()}
              trend="12.5%"
              trendUp={true}
            />

            <StatCard
              icon={TrendingUp}
              title="Weekly Active Users"
              value={metrics.wau.toLocaleString()}
              subtitle={`MAU: ${metrics.mau.toLocaleString()}`}
              trend="8.3%"
              trendUp={true}
            />

            <StatCard
              icon={CheckCircle}
              title="First Lesson Completion"
              value={`${metrics.firstLessonCompletionRate}%`}
              subtitle="Of new users"
              trend="5.2%"
              trendUp={true}
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

          {/* Module Completion Rates & System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Module Completion Rates */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Module Completion Rates</h3>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {metrics.moduleCompletionRates.map((module, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{module.module}</span>
                      <span className="text-sm font-semibold text-gray-900">{module.rate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${module.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    metrics.systemHealth.status
                  )}`}
                >
                  {metrics.systemHealth.status === "healthy" ? "All Systems Operational" : "Issues Detected"}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">API Uptime</p>
                      <p className="text-xs text-gray-500">Last 30 days</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{metrics.systemHealth.apiUptime}%</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Sentry Errors</p>
                      <p className="text-xs text-gray-500">Last 24 hours</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{metrics.systemHealth.errorCount}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Database className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Database Status</p>
                      <p className="text-xs text-gray-500">Primary & replicas</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">Healthy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Audit Logs */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Audit Logs</h3>
              <a href="/admin-dashboard/audit" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.auditLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{log.action}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{log.user}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{log.timestamp}</td>
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
