"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin-sidebar";
import AdminHeader from "@/components/admin-header";
import Nav from "@/components/admin-nav";
import { Users, Activity, TrendingUp, BarChart3, AlertCircle } from "lucide-react";
import {
  LineChart as RLineChart,
  Line,
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchMetrics } from "@/lib/services/metricsService";
import { toast } from "sonner";
import { MetricsSkeleton } from "@/components/ui/metrics-skeleton";

// 🎨 Theme Colors
const colors = {
  primary: "#84cc16",
  secondary: "#4d7c0f",
  grid: "#374151",
  text: {
    dark: "text-gray-900 dark:text-gray-100",
    medium: "text-gray-600 dark:text-gray-400",
  },
  card: "bg-white dark:bg-gray-900",
  light: "bg-gray-50 dark:bg-gray-950",
};

interface MetricsData {
  registrations: { date: string; count: number }[];
  wauMau: { week: string; wau: number; mau: number }[];
  completion: { stage: string; rate: number }[];
  retention: { day: string; percentage: number }[];
  loading: boolean;
  error: string | null;
}

export default function MetricsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [metrics, setMetrics] = useState<MetricsData>({
    registrations: [],
    wauMau: [],
    completion: [],
    retention: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchMetrics();
        
        // Map API response to the expected format
        setMetrics({
          registrations: data.registrationsTrend || [],
          wauMau: data.wauMauRatio || [],
          completion: [
            { stage: "Module Completion", rate: data.moduleCompletionRate || 0 },
          ],
          retention: data.sevenDayActivation?.map(item => ({
            day: item.day,
            percentage: item.rate,
          })) || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error loading metrics:', error);
        setMetrics(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load metrics. Please try again later.',
        }));
        toast.error('Failed to load metrics');
      }
    };

    loadMetrics();
  }, []);

  // Show loading skeleton while data is being fetched
  if (metrics.loading) {
    return (
      <div className={`flex h-screen overflow-x-hidden overflow-y-hidden ${colors.light}`}>
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-6">
            <MetricsSkeleton />
          </main>
          <Nav />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-x-hidden overflow-y-hidden ${colors.light}`}>
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Layout */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-10 space-y-10 pb-32">

          <div>
            <h1 className={`text-3xl font-bold ${colors.text.dark}`}>
              Metrics & Reports
            </h1>
            <p className={`mt-1 ${colors.text.medium}`}>
              Analytics dashboards and exportable reports
            </p>
          </div>

          {metrics.error && (
            <div className="col-span-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-200">Error loading metrics</h3>
                <p className="text-sm text-red-700 dark:text-red-300">{metrics.error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Registrations Trend */}
            <section className={`${colors.card} rounded-2xl shadow-sm p-6`}>
              <div className="flex items-center gap-2 border-b border-gray-700/20 pb-3 mb-5">
                <Users className="w-5 h-5 text-lime-500" />
                <h2 className={`text-lg font-semibold ${colors.text.dark}`}>
                  Registrations Trend
                </h2>
              </div>
              {metrics.loading ? (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Loading...
                </div>
              ) : metrics.registrations.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No registration data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RLineChart data={metrics.registrations}>
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#84cc16" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#84cc16" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke={colors.grid} opacity={0.4} />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        backgroundColor: "#1f2937",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="url(#lineGrad)"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#84cc16", strokeWidth: 1 }}
                    />
                  </RLineChart>
                </ResponsiveContainer>
              )}
            </section>

            {/* WAU / MAU */}
            <section className={`${colors.card} rounded-2xl shadow-sm p-6`}>
              <div className="flex items-center gap-2 border-b border-gray-700/20 pb-3 mb-5">
                <Activity className="w-5 h-5 text-lime-500" />
                <h2 className={`text-lg font-semibold ${colors.text.dark}`}>
                  WAU / MAU Ratio
                </h2>
              </div>
              {metrics.loading ? (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Loading...
                </div>
              ) : metrics.wauMau.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No WAU/MAU data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RBarChart data={metrics.wauMau}>
                    <CartesianGrid strokeDasharray="4 4" stroke={colors.grid} opacity={0.4} />
                    <XAxis dataKey="week" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        backgroundColor: "#1f2937",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="wau" fill={colors.primary} radius={[6, 6, 0, 0]} name="WAU" />
                    <Bar dataKey="mau" fill={colors.secondary} radius={[6, 6, 0, 0]} name="MAU" />
                  </RBarChart>
                </ResponsiveContainer>
              )}
            </section>

            {/* Completion Funnel */}
            <section className={`${colors.card} rounded-2xl shadow-sm p-6`}>
              <div className="flex items-center gap-2 border-b border-gray-700/20 pb-3 mb-5">
                <BarChart3 className="w-5 h-5 text-lime-500" />
                <h2 className={`text-lg font-semibold ${colors.text.dark}`}>
                  Module Completion Rate
                </h2>
              </div>
              {metrics.loading ? (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Loading...
                </div>
              ) : metrics.completion.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No completion data available
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px]">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl font-bold text-lime-500">
                        {metrics.completion[0]?.rate}%
                      </div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-lime-500"
                        strokeWidth="10"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        strokeDasharray={`${metrics.completion[0]?.rate * 2.51} 1000`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Average module completion rate
                  </p>
                </div>
              )}
            </section>

          {/* 7-Day Activation */}
          <section className={`${colors.card} rounded-2xl shadow-sm p-6`}>
            <div className="flex items-center gap-2 border-b border-gray-700/20 pb-3 mb-5">
              <TrendingUp className="w-5 h-5 text-lime-500" />
              <h2 className={`text-lg font-semibold ${colors.text.dark}`}>
                7-Day Activation Rate
              </h2>
            </div>
            {metrics.loading ? (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Loading...
              </div>
            ) : metrics.retention.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No activation data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RLineChart data={metrics.retention}>
                  <CartesianGrid strokeDasharray="4 4" stroke={colors.grid} opacity={0.4} />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      backgroundColor: "#1f2937",
                      color: "#fff",
                    }}
                    formatter={(value) => [`${value}%`, 'Activation Rate']}
                  />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="#84cc16"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#84cc16", strokeWidth: 1 }}
                    name="Activation Rate"
                  />
                </RLineChart>
              </ResponsiveContainer>
            )}
          </section>
          </div>
        </main>

        {/* Footer Nav */}
        <Nav />
      </div>
    </div>
  );
}
