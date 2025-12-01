"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin-sidebar";
import AdminHeader from "@/components/admin-header";
import Nav from "@/components/admin-nav";
import { Users, Activity, TrendingUp, BarChart3 } from "lucide-react";
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
}

export default function MetricsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [metrics, setMetrics] = useState<MetricsData>({
    registrations: [],
    wauMau: [],
    completion: [],
    retention: [],
  });

  useEffect(() => {
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
    }, 400);
  }, []);

  return (
    // <div className={`flex h-screen overflow-hidden ${colors.light}`}>
    <div className={`flex h-screen overflow-x-hidden overflow-y-hidden ${colors.light}`}>

      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Layout */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        {/* <main className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-10 pb-30"> */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-10 space-y-10 pb-32">

          <div>
            <h1 className={`text-3xl font-bold ${colors.text.dark}`}>
              Metrics & Reports
            </h1>
            <p className={`mt-1 ${colors.text.medium}`}>
              Analytics dashboards and exportable reports
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Registrations Trend */}
            <section className={`${colors.card} rounded-2xl shadow-sm p-6`}>
              <div className="flex items-center gap-2 border-b border-gray-700/20 pb-3 mb-5">
                <Users className="w-5 h-5 text-lime-500" />
                <h2 className={`text-lg font-semibold ${colors.text.dark}`}>
                  Registrations Trend
                </h2>
              </div>
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
            </section>

            {/* WAU / MAU */}
            <section className={`${colors.card} rounded-2xl shadow-sm p-6`}>
              <div className="flex items-center gap-2 border-b border-gray-700/20 pb-3 mb-5">
                <Activity className="w-5 h-5 text-lime-500" />
                <h2 className={`text-lg font-semibold ${colors.text.dark}`}>
                  WAU / MAU Ratio
                </h2>
              </div>
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
                  <Bar dataKey="wau" fill={colors.primary} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="mau" fill={colors.secondary} radius={[6, 6, 0, 0]} />
                </RBarChart>
              </ResponsiveContainer>
            </section>

            {/* Completion Funnel */}
            <section className={`${colors.card} rounded-2xl shadow-sm p-6`}>
              <div className="flex items-center gap-2 border-b border-gray-700/20 pb-3 mb-5">
                <BarChart3 className="w-5 h-5 text-lime-500" />
                <h2 className={`text-lg font-semibold ${colors.text.dark}`}>
                  Lesson / Module Completion
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RBarChart data={metrics.completion}>
                  <CartesianGrid strokeDasharray="4 4" stroke={colors.grid} opacity={0.4} />
                  <XAxis dataKey="stage" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      backgroundColor: "#1f2937",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="rate" fill="url(#lineGrad)" radius={[8, 8, 0, 0]} />
                </RBarChart>
              </ResponsiveContainer>
            </section>

            {/* Retention */}
            <section className={`${colors.card} rounded-2xl shadow-sm p-6`}>
              <div className="flex items-center gap-2 border-b border-gray-700/20 pb-3 mb-5">
                <TrendingUp className="w-5 h-5 text-lime-500" />
                <h2 className={`text-lg font-semibold ${colors.text.dark}`}>
                  Retention (7-Day Activation)
                </h2>
              </div>
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
                  />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="url(#lineGrad)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#84cc16" }}
                  />
                </RLineChart>
              </ResponsiveContainer>
            </section>
          </div>
        </main>

        {/* Footer Nav */}
        <Nav />
      </div>
    </div>
  );
}
