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
                return `${key.toUpperCase()}\n${rows.join("\n")}`;
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
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Metrics & Reports
                </h1>
                <p className="text-gray-600 mt-1">
                  Analytics dashboards and exportable reports
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => exportData("csv")}
                  className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" /> CSV
                </button>
                <button
                  onClick={() => exportData("json")}
                  className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" /> JSON
                </button>
              </div>
            </div>

            {metricsVisibility.visible ? (
              <div className="space-y-8">
                {/* Registrations Trend */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Registrations Trend
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <RLineChart data={metrics.registrations}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
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
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    WAU / MAU Ratio
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <RBarChart data={metrics.wauMau}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="wau" fill="#22c55e" />
                      <Bar dataKey="mau" fill="#3b82f6" />
                    </RBarChart>
                  </ResponsiveContainer>
                </div>

                {/* Completion Funnel */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Lesson / Module Completion Funnel
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <RBarChart data={metrics.completion}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stage" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="rate" fill="#8b5cf6" />
                    </RBarChart>
                  </ResponsiveContainer>
                </div>

                {/* Retention Stats */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-pink-600" />
                    Retention (7-day activation & streaks)
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <RLineChart data={metrics.retention}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
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
              <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
                Metrics are hidden (metrics_visibility.visible = false).
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
