"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/ui/admin-sidebar";
import AdminHeader from "@/components/ui/admin-header";
import {
  Users,
  Activity,
  TrendingUp,
  Download,
  BarChart3,
  LineChart,
} from "lucide-react";
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

interface MetricsVisibility {
  visible: boolean;
}

interface MetricsData {
  registrations: { date: string; count: number }[];
  wauMau: { week: string; wau: number; mau: number }[];
  completion: { stage: string; rate: number }[];
  retention: { day: string; percentage: number }[];
}

export default function MetricsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [metricsVisibility, setMetricsVisibility] = useState<MetricsVisibility>({
    visible: true, // default, in real app fetch from DB
  });
  const [metrics, setMetrics] = useState<MetricsData>({
    registrations: [],
    wauMau: [],
    completion: [],
    retention: [],
  });

  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      setMetrics({
        registrations: [
          { date: "2025-09-01", count: 120 },
          { date: "2025-09-08", count: 180 },
          { date: "2025-09-15", count: 240 },
          { date: "2025-09-22", count: 300 },
          { date: "2025-09-29", count: 400 },
        ],
        wauMau: [
          { week: "Week 1", wau: 120, mau: 500 },
          { week: "Week 2", wau: 150, mau: 520 },
          { week: "Week 3", wau: 170, mau: 530 },
          { week: "Week 4", wau: 210, mau: 560 },
        ],
        completion: [
          { stage: "Registered", rate: 100 },
          { stage: "Started Lesson 1", rate: 85 },
          { stage: "Completed Lesson 1", rate: 78 },
          { stage: "Completed Module 1", rate: 65 },
          { stage: "Completed Course", rate: 45 },
        ],
        retention: [
          { day: "Day 1", percentage: 100 },
          { day: "Day 3", percentage: 72 },
          { day: "Day 5", percentage: 58 },
          { day: "Day 7", percentage: 44 },
        ],
      });
    }, 500);
  }, []);

  const exportData = (type: "csv" | "json") => {
    const dataStr =
      type === "json"
        ? JSON.stringify(metrics, null, 2)
        : Object.entries(metrics)
            .map(([key, arr]) => {
              if (Array.isArray(arr)) {
                const rows = arr.map((obj) =>
                  Object.values(obj).join(",")
                );
                return `${key.toUpperCase()}\n${Object.keys(arr[0]).join(',')}\n${rows.join("\n")}`;
              }
              return "";
            })
            .join("\n\n");

    const blob = new Blob([dataStr], {
      type: type === "json" ? "application/json" : "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `metrics.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    // 1. Update main background
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                {/* 2. Update heading text colors */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Metrics & Reports
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Analytics dashboards and exportable reports
                </p>
              </div>
              <div className="flex gap-3">
                {/* 3. Update export buttons for dark mode */}
                <button
                  onClick={() => exportData("csv")}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <Download className="w-4 h-4 text-gray-600 dark:text-gray-300" /> CSV
                </button>
                <button
                  onClick={() => exportData("json")}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <Download className="w-4 h-4 text-gray-600 dark:text-gray-300" /> JSON
                </button>
              </div>
            </div>

            {metricsVisibility.visible ? (
              <div className="space-y-8">
                {/* Registrations Trend */}
                {/* 4. Update chart card background and text colors */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Users className="w-5 h-5 text-blue-600" />
                    Registrations Trend
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <RLineChart data={metrics.registrations}>
                      {/* 5. Update CartesianGrid and Axis colors */}
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                      <XAxis dataKey="date" className="text-sm dark:text-gray-300" stroke="#9ca3af" tick={{ fill: 'var(--color-text)' }} style={{ fill: 'var(--color-text)' }} />
                      <YAxis className="text-sm dark:text-gray-300" stroke="#9ca3af" tick={{ fill: 'var(--color-text)' }} style={{ fill: 'var(--color-text)' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--color-tooltip-bg)', 
                          borderColor: 'var(--color-tooltip-border)',
                          borderRadius: '8px',
                          color: 'var(--color-tooltip-text)'
                        }} 
                        itemStyle={{ color: 'var(--color-tooltip-text)' }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#2563eb"
                        strokeWidth={2}
                      />
                    </RLineChart>
                  </ResponsiveContainer>
                </div>

                {/* WAU / MAU Ratio */}
                {/* 6. Update chart card background and text colors */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Activity className="w-5 h-5 text-green-600" />
                    WAU / MAU Ratio
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <RBarChart data={metrics.wauMau}>
                      {/* 7. Update CartesianGrid and Axis colors */}
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                      <XAxis dataKey="week" className="text-sm dark:text-gray-300" stroke="#9ca3af" tick={{ fill: 'var(--color-text)' }} style={{ fill: 'var(--color-text)' }} />
                      <YAxis className="text-sm dark:text-gray-300" stroke="#9ca3af" tick={{ fill: 'var(--color-text)' }} style={{ fill: 'var(--color-text)' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--color-tooltip-bg)', 
                          borderColor: 'var(--color-tooltip-border)',
                          borderRadius: '8px',
                          color: 'var(--color-tooltip-text)'
                        }} 
                        itemStyle={{ color: 'var(--color-tooltip-text)' }}
                      />
                      <Legend />
                      <Bar dataKey="wau" fill="#22c55e" />
                      <Bar dataKey="mau" fill="#3b82f6" />
                    </RBarChart>
                  </ResponsiveContainer>
                </div>

                {/* Completion Funnel */}
                {/* 8. Update chart card background and text colors */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Lesson / Module Completion Funnel
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <RBarChart data={metrics.completion}>
                      {/* 9. Update CartesianGrid and Axis colors */}
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                      <XAxis dataKey="stage" className="text-sm dark:text-gray-300" stroke="#9ca3af" tick={{ fill: 'var(--color-text)' }} style={{ fill: 'var(--color-text)' }} />
                      <YAxis className="text-sm dark:text-gray-300" stroke="#9ca3af" tick={{ fill: 'var(--color-text)' }} style={{ fill: 'var(--color-text)' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--color-tooltip-bg)', 
                          borderColor: 'var(--color-tooltip-border)',
                          borderRadius: '8px',
                          color: 'var(--color-tooltip-text)'
                        }} 
                        itemStyle={{ color: 'var(--color-tooltip-text)' }}
                      />
                      <Bar dataKey="rate" fill="#8b5cf6" />
                    </RBarChart>
                  </ResponsiveContainer>
                </div>

                {/* Retention Stats */}
                {/* 10. Update chart card background and text colors */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <TrendingUp className="w-5 h-5 text-pink-600" />
                    Retention (7-day activation & streaks)
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <RLineChart data={metrics.retention}>
                      {/* 11. Update CartesianGrid and Axis colors */}
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                      <XAxis dataKey="day" className="text-sm dark:text-gray-300" stroke="#9ca3af" tick={{ fill: 'var(--color-text)' }} style={{ fill: 'var(--color-text)' }} />
                      <YAxis className="text-sm dark:text-gray-300" stroke="#9ca3af" tick={{ fill: 'var(--color-text)' }} style={{ fill: 'var(--color-text)' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--color-tooltip-bg)', 
                          borderColor: 'var(--color-tooltip-border)',
                          borderRadius: '8px',
                          color: 'var(--color-tooltip-text)'
                        }} 
                        itemStyle={{ color: 'var(--color-tooltip-text)' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="percentage"
                        stroke="#ec4899"
                        strokeWidth={2}
                      />
                    </RLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              // 12. Update placeholder background and text colors
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-10 text-center text-gray-500 dark:text-gray-400">
                Metrics are hidden (metrics_visibility.visible = false).
              </div>
            )}
          </div>
        </main>
      </div>

      {/* NOTE: For Recharts elements (XAxis, YAxis, Tooltip, Legend),
        we need to use inline styles or CSS variables to control the color,
        as Tailwind classes won't directly apply to the SVG elements rendered by Recharts.
        
        A global CSS setup (e.g., in global.css or theme context) for Dark Mode 
        is generally required for Recharts. 
        
        I'm using 'var(--color-text)' for axis/tick text and 
        'var(--color-tooltip-bg/border/text)' for Tooltip,
        and adding dark: classes to CartesianGrid, assuming these CSS variables/classes 
        will be defined in the app's global styles to support the theme switching 
        for the chart library's SVG output.
      */}
      <style jsx global>{`
        .recharts-text, .recharts-legend-item-text {
          fill: var(--color-text);
        }
        .recharts-wrapper {
          --color-text: #1f2937; /* Default for light mode (gray-800) */
          --color-tooltip-bg: #ffffff;
          --color-tooltip-border: #e5e7eb;
          --color-tooltip-text: #1f2937;
        }

        .dark .recharts-wrapper {
          --color-text: #d1d5db; /* Dark mode (gray-300) */
          --color-tooltip-bg: #1f2937; /* Dark mode (gray-800) */
          --color-tooltip-border: #374151; /* Dark mode (gray-700) */
          --color-tooltip-text: #d1d5db;
        }
      `}</style>
    </div>
  );
}