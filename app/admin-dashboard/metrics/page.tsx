"use client";

import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "@/components/admin-sidebar";
import AdminHeader from "@/components/admin-header";
import Nav from "@/components/admin-nav";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, EyeOff, Settings } from "lucide-react"; // Added Settings icon for the button
import {
  fetchMetrics,
  fetchMetricsVisibility,
  updateMetricVisibility,
} from "@/lib/services/metricsService";
import {
  Users,
  Activity,
  TrendingUp,
  BarChart3,
  AlertCircle,
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
import { toast } from "sonner";
import { MetricsSkeleton } from "@/components/ui/metrics-skeleton";

/* 🎨 Theme Colors */
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

// Map the API key to a readable title for the UI
const METRIC_MAP = {
  registrations_trend: "Registrations Trend",
  wau_mau_ratio: "WAU / MAU Ratio",
  module_completion_rate: "Module Completion Rate",
  seven_day_activation: "7-Day Activation Rate",
};

/* --- Component for "No Data" State --- */
// Used when metric is visible but has no data
const EmptyState = ({
  title,
  message,
  icon: Icon,
}: {
  title: string;
  message: string;
  icon: React.ElementType;
}) => (
  <div className="h-[300px] flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-gray-50/50 to-blue-50/50 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
      <Icon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
    </div>
    <h3 className={`text-lg font-semibold ${colors.text.dark} mb-2`}>
      {title}
    </h3>
    <p className={`text-sm ${colors.text.medium} mb-6 max-w-sm`}>{message}</p>
    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
        Waiting for data...
      </span>
    </div>
  </div>
);

export default function MetricsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visibilityOpen, setVisibilityOpen] = useState(false);

  const [metrics, setMetrics] = useState<MetricsData>({
    registrations: [],
    wauMau: [],
    completion: [],
    retention: [],
    loading: true,
    error: null,
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  /* ✅ Reusable metrics loader */
  const loadMetrics = useCallback(async () => {
    try {
      const data = await fetchMetrics();

      setMetrics((prev) => ({
        ...prev,
        registrations: data.registrationsTrend || [],
        wauMau: data.wauMauRatio || [],
        completion: [
          {
            stage: "Module Completion",
            rate: data.moduleCompletionRate || 0,
          },
        ],
        retention:
          data.sevenDayActivation?.map((item) => ({
            day: item.day,
            percentage: item.rate,
          })) || [],
        loading: false,
        error: null,
      }));
      setIsInitialLoad(false);
    } catch (error) {
      setMetrics((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load metrics.",
      }));
      toast.error("Failed to load metrics");
    }
  }, []);

  /* ✅ FIXED toggle handler */
  const handleToggle = async (key: string, value: boolean) => {
    // optimistic update
    setVisibility((prev) => ({ ...prev, [key]: value }));

    try {
      await updateMetricVisibility(key, value);

      // 🔥 refetch metrics only when turning ON and if data might be missing
      if (value) {
        // Debounce or optimize this if performance is an issue
        await loadMetrics();
      }

      toast.success("Visibility updated");
    } catch {
      // rollback
      setVisibility((prev) => ({ ...prev, [key]: !value }));
      toast.error("Failed to update visibility");
    }
  };

  /* --- Component for "Toggled Off" State (Needs access to handleToggle) --- */
  const ToggledOffMessage = ({
    label,
    metricKey,
    message,
    icon: Icon,
  }: {
    label: string;
    metricKey: string;
    message: string;
    icon: React.ElementType;
  }) => (
    <div className="h-[300px] flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-gray-50/50 to-red-50/50 dark:from-gray-900/50 dark:to-red-900/10 rounded-xl border-2 border-dashed border-red-300 dark:border-red-800/80">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
        <EyeOff className="w-8 h-8 text-red-500 dark:text-red-300" />
      </div>
      <h3 className={`text-lg font-semibold ${colors.text.dark} mb-2`}>
        {label} is Toggled Off
      </h3>
      <p className={`text-sm ${colors.text.medium} mb-6 max-w-sm`}>{message}</p>
      <button
        onClick={() => handleToggle(metricKey, true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-lime-600 dark:text-lime-500 bg-lime-50 dark:bg-gray-700 rounded-full border border-lime-200 dark:border-lime-700 hover:bg-lime-100 dark:hover:bg-gray-600 transition shadow-md cursor-pointer"
      >
        <Settings className="w-4 h-4" />
        Show on Dashboard
      </button>
    </div>
  );

  /* Initial load */
  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Start both requests in parallel
        const [metricsData, visibilityData] = await Promise.allSettled([
          loadMetrics(),
          (async () => {
            const data = await fetchMetricsVisibility();
            const mapped: Record<string, boolean> = {};

            // Populate mapped with API data
            data.forEach((item) => {
              mapped[item.key] = item.visible;
            });

            // Ensure all configured metrics exist in state, defaulting to true if not found in API
            const allKeys = [
              "registrations_trend",
              "wau_mau_ratio",
              "module_completion_rate",
              "seven_day_activation",
            ];

            allKeys.forEach((key) => {
              if (mapped[key] === undefined) {
                mapped[key] = true;
              }
            });

            setVisibility(mapped);
            return mapped;
          })(),
        ]);

        if (metricsData.status === 'rejected') {
          throw metricsData.reason;
        }
        if (visibilityData.status === 'rejected') {
          throw visibilityData.reason;
        }
      } catch (error) {
        toast.error("Failed to load metrics data");
        setMetrics(prev => ({ ...prev, loading: false, error: 'Failed to load metrics' }));
      }
    };

    loadAllData();
  }, [loadMetrics]);

  // Show skeleton only during initial load
  if (isInitialLoad || (metrics.loading && Object.keys(visibility).length === 0)) {
    return (
      <div className={`flex h-screen ${colors.light}`}>
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 flex flex-col">
          <AdminHeader setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 p-6">
            <MetricsSkeleton />
          </main>
          <Nav />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${colors.light}`}>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-10 pb-32">
          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${colors.text.dark}`}>
                Metrics & Reports
              </h1>
              <p className={`mt-1 ${colors.text.medium}`}>
                Analytics dashboards and exportable reports
              </p>
            </div>

            {/* Visibility Dropdown */}
            <div className="relative self-end lg:self-auto">
              <button
                onClick={() => setVisibilityOpen((p) => !p)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm shadow-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <Settings className="w-4 h-4" /> {/* Use settings icon */}
                Toggle Visibility
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    visibilityOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {visibilityOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl p-4 space-y-3 z-50">
                  {[
                    {
                      key: "registrations_trend",
                      label: METRIC_MAP.registrations_trend,
                    },
                    { key: "wau_mau_ratio", label: METRIC_MAP.wau_mau_ratio },
                    {
                      key: "module_completion_rate",
                      label: METRIC_MAP.module_completion_rate,
                    },
                    {
                      key: "seven_day_activation",
                      label: METRIC_MAP.seven_day_activation,
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item.label}
                      </span>
                      <Switch
                        // Ensure we check against the actual visibility state
                        checked={visibility[item.key] ?? true}
                        onCheckedChange={(val) => handleToggle(item.key, val)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {metrics.error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">
                {metrics.error}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Registrations Trend */}
            <section className={`${colors.card} rounded-2xl shadow-sm p-6`}>
              <div className="flex items-center gap-2 border-b border-gray-700/20 pb-3 mb-5">
                <Users className="w-5 h-5 text-lime-500" />
                <h2 className={`text-lg font-semibold ${colors.text.dark}`}>
                  {METRIC_MAP.registrations_trend}
                </h2>
              </div>
              {!visibility.registrations_trend ? (
                <ToggledOffMessage
                  label={METRIC_MAP.registrations_trend}
                  message="Toggle this metric on to view registration trends over time."
                  icon={Users}
                  metricKey="registrations_trend"
                />
              ) : metrics.registrations.length === 0 ? (
                <EmptyState
                  title="No Data Yet"
                  message="Registration data will appear here once users start signing up."
                  icon={Users}
                />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RLineChart data={metrics.registrations}>
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#84cc16"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor="#84cc16"
                          stopOpacity={0.2}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      stroke={colors.grid}
                      opacity={0.4}
                    />
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
                  {METRIC_MAP.wau_mau_ratio}
                </h2>
              </div>
              {!visibility.wau_mau_ratio ? (
                <ToggledOffMessage
                  label={METRIC_MAP.wau_mau_ratio}
                  message="Enable this metric to compare weekly and monthly active users."
                  icon={Activity}
                  metricKey="wau_mau_ratio"
                />
              ) : metrics.wauMau.length === 0 ? (
                <EmptyState
                  title="No Activity Data"
                  message="User activity data will populate here as users engage with the platform."
                  icon={Activity}
                />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RBarChart data={metrics.wauMau}>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      stroke={colors.grid}
                      opacity={0.4}
                    />
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
                    <Bar
                      dataKey="wau"
                      fill={colors.primary}
                      radius={[6, 6, 0, 0]}
                      name="WAU"
                    />
                    <Bar
                      dataKey="mau"
                      fill={colors.secondary}
                      radius={[6, 6, 0, 0]}
                      name="MAU"
                    />
                  </RBarChart>
                </ResponsiveContainer>
              )}
            </section>

            {/* Module Completion Rate */}
            <section className={`${colors.card} rounded-2xl shadow-sm p-6`}>
              <div className="flex items-center gap-2 border-b border-gray-700/20 pb-3 mb-5">
                <BarChart3 className="w-5 h-5 text-lime-500" />
                <h2 className={`text-lg font-semibold ${colors.text.dark}`}>
                  {METRIC_MAP.module_completion_rate}
                </h2>
              </div>
              {!visibility.module_completion_rate ? (
                <ToggledOffMessage
                  label={METRIC_MAP.module_completion_rate}
                  message="Turn on this metric to track how learners complete modules."
                  icon={BarChart3}
                  metricKey="module_completion_rate" // ✅ CORRECT
                />
              ) : metrics.completion.length === 0 ||
                metrics.completion[0]?.rate === 0 ? (
                <EmptyState
                  title="No Completion Data"
                  message="Module completion stats will appear here once learners start courses."
                  icon={BarChart3}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                  <div className="text-sm text-gray-400">
                    <span>Completion Rate :</span>{" "}
                    <span className="text-lime-500 font-bold">
                      {metrics.completion[0]?.rate}%
                    </span>
                  </div>
                  <div className="relative w-48 h-48">
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
                        strokeDasharray={`${
                          metrics.completion[0]?.rate * 2.51
                        } 1000`}
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
                  {METRIC_MAP.seven_day_activation}
                </h2>
              </div>
              {!visibility.seven_day_activation ? (
                <ToggledOffMessage
                  label={METRIC_MAP.seven_day_activation}
                  message="Enable to see user activation rates within first 7 days."
                  icon={TrendingUp}
                  metricKey="seven_day_activation"
                />
              ) : metrics.retention.length === 0 ? (
                <EmptyState
                  title="No Activation Data"
                  message="Activation data appears here once users start engaging after signup."
                  icon={TrendingUp}
                />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RLineChart data={metrics.retention}>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      stroke={colors.grid}
                      opacity={0.4}
                    />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        backgroundColor: "#1f2937",
                        color: "#fff",
                      }}
                      formatter={(value) => [`${value}%`, "Activation Rate"]}
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

        <Nav />
      </div>
    </div>
  );
}
