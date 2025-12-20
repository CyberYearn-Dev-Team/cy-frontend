"use client";

import React, { useState } from "react";

// ✅ Import my admin nav just like i did in the stored code

import Nav from "@/components/admin-nav";

import AdminSidebar from "@/components/admin-sidebar";

import AdminHeader from "@/components/admin-header";

import {
  Shield,
  AlertTriangle,
  Lock,
  Activity,
  Users,
  Ban,
  Eye,
  Clock,
  TrendingUp,
  ChevronDown,
} from "lucide-react";

// ✅ Import shadcn ui components

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button"; // Assuming you have a standard button component

interface SecurityAlert {
  id: string;

  type:
    | "rate-limit"
    | "suspicious-login"
    | "security-incident"
    | "unauthorized-access";

  severity: "low" | "medium" | "high" | "critical";

  message: string;

  timestamp: string;

  source: string;

  details?: string;
}

// 🎨 Theme Colors (Copied from stored code)

const primary = "#72a210";

const secondary = "#507800";

const hover = "#5a850d";

const bgLight = "bg-gray-50 dark:bg-gray-950";

const bgCard = "bg-white dark:bg-gray-900";

const textDark = "text-gray-900 dark:text-gray-100";

const textMedium = "text-gray-600 dark:text-gray-400";

const textLight = "text-gray-500 dark:text-gray-300";

type SeverityFilter = "all" | "low" | "medium" | "high" | "critical";

const SecurityPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [contentFrozen, setContentFrozen] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [showFreezeConfirm, setShowFreezeConfirm] = useState(false);

  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(
    null
  );

  // ✅ Changed state to use the new SeverityFilter type

  const [filterSeverity, setFilterSeverity] = useState<SeverityFilter>("all");

  // --- Mock security alerts ---

  const [alerts] = useState<SecurityAlert[]>([
    {
      id: "1",

      type: "rate-limit",

      severity: "high",

      message: "Rate limit exceeded from IP 192.168.1.100",

      timestamp: "2025-10-01T14:32:00Z",

      source: "API Gateway",

      details: "User attempted 500 requests in 60 seconds",
    },

    {
      id: "2",

      type: "suspicious-login",

      severity: "critical",

      message: "Multiple failed login attempts detected",

      timestamp: "2025-10-01T14:15:00Z",

      source: "Auth Service",

      details: "15 failed attempts from different IPs in 5 minutes",
    },

    {
      id: "3",

      type: "unauthorized-access",

      severity: "medium",

      message: "Unauthorized API endpoint access attempt",

      timestamp: "2025-10-01T13:45:00Z",

      source: "API Gateway",

      details: "Attempt to access /admin/users without proper credentials",
    },

    {
      id: "4",

      type: "unauthorized-access",

      severity: "low",

      message: "Low severity policy violation",

      timestamp: "2025-10-01T13:45:00Z",

      source: "Policy Engine",

      details: "Minor policy violation",
    },
  ]);

  // --- MOCK LOGS REMOVED ---

  // const [logs] = useState<LogEntry[]>([ ... ]);

  const handleGlobalLogout = () => {
    console.log("Initiating global logout for all users...");

    setShowLogoutConfirm(false);
  };

  const handleContentFreeze = () => {
    setContentFrozen(!contentFrozen);

    setShowFreezeConfirm(false);

    console.log(
      `Content freeze mode ${!contentFrozen ? "enabled" : "disabled"}`
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-700";

      case "high":
        return "text-orange-600 bg-orange-50 dark:bg-orange-900/50 border-orange-200 dark:border-orange-700";

      case "medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-700";

      case "low":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700";

      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "rate-limit":
        return <TrendingUp className="w-5 h-5" />;

      case "suspicious-login":
        return <Users className="w-5 h-5" />;

      case "data-breach":
        return <AlertTriangle className="w-5 h-5" />;

      case "unauthorized-access":
        return <Ban className="w-5 h-5" />;

      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  // ✅ New Stat Component for responsiveness and icon hiding

  const StatCard: React.FC<{
    label: string;

    value: string | number;

    subtext: string;

    Icon: React.ElementType;

    iconColor: string;
  }> = ({ label, value, subtext, Icon, iconColor }) => (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </span>

        {/* Hide icon on small screens, show on md and up */}

        <Icon className={`hidden md:block w-5 h-5 ${iconColor}`} />
      </div>

      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {value}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {subtext}
      </div>
    </div>
  );

  const filteredAlerts =
    filterSeverity === "all"
      ? alerts
      : alerts.filter((a) => a.severity === filterSeverity);

  return (
    // ✅ Apply background color from stored code

    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-30">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                  {/* Used primary color */}
                  Security Controls
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage security settings and monitor threats
                </p>
              </div>
            </div>

            {/* Security Stats - ✅ Flexed to 2x2 on small screens */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <StatCard
                label="Critical Alerts"
                value={alerts.filter((a) => a.severity === "critical").length}
                subtext="Last 24 hours"
                Icon={AlertTriangle}
                iconColor="text-red-600"
              />

              <StatCard
                label="Active Sessions"
                value="1,247"
                subtext="Current users"
                Icon={Activity}
                iconColor="text-blue-600"
              />

              <StatCard
                label="Blocked IPs"
                value="23"
                subtext="Auto-blocked"
                Icon={Ban}
                iconColor="text-orange-600"
              />

              <StatCard
                label="Rate Limits"
                value="7"
                subtext="Triggered today"
                Icon={TrendingUp}
                iconColor="text-yellow-600"
              />
            </div>

            {/* Quick Actions */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Global Logout Card */}

              <div
                className={`${bgCard} rounded-lg border border-gray-200 dark:border-gray-700 p-6`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 dark:bg-red-800 rounded-lg">
                      <Users className="w-6 h-6 text-red-600 dark:text-red-300" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Force Global Logout
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        End all active sessions
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Immediately terminate all user sessions across the platform.
                  Use this in case of security breach or emergency.
                </p>

                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-500 transition-colors font-medium"
                >
                  Initiate Global Logout
                </button>
              </div>

              {/* Content Freeze Card */}

              <div
                className={`${bgCard} rounded-lg border border-gray-200 dark:border-gray-700 p-6`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 dark:bg-orange-800 rounded-lg">
                      <Lock className="w-6 h-6 text-orange-600 dark:text-orange-300" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Content Freeze Mode
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Block new content creation
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Temporarily prevent users from creating, editing, or
                  publishing new content. Read-only mode for investigation.
                </p>

                <button
                  onClick={() => setShowFreezeConfirm(true)}
                  className={`w-full px-4 py-2 rounded-lg transition-colors font-medium ${
                    contentFrozen
                      ? "bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-500"
                      : "bg-orange-600 text-white hover:bg-orange-700 dark:hover:bg-orange-500"
                  }`}
                >
                  {contentFrozen
                    ? "Disable Content Freeze"
                    : "Enable Content Freeze"}
                </button>
              </div>
            </div>

            {/* Security Alerts */}

            <div
              className={`${bgCard} rounded-lg border border-gray-200 dark:border-gray-700 mt-6`}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Security Alerts
                  </h2>

                  {/* ✅ Replaced native select with Shadcn DropdownMenu */}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center justify-between w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        {filterSeverity === "all"
                          ? "All Severities"
                          : filterSeverity.charAt(0).toUpperCase() +
                            filterSeverity.slice(1)}

                        <ChevronDown className="ml-2 w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      {(
                        ["all", "critical", "high", "medium", "low"] as const
                      ).map((severity) => (
                        <DropdownMenuItem
                          key={severity}
                          onClick={() => setFilterSeverity(severity)}
                        >
                          {severity.charAt(0).toUpperCase() + severity.slice(1)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(
                              alert.severity
                            )}`}
                          >
                            {alert.severity.toUpperCase()}
                          </span>

                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {alert.type.replace("-", " ").toUpperCase()}
                          </span>
                        </div>

                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {alert.message}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />

                            {new Date(alert.timestamp).toLocaleString()}
                          </span>

                          <span>Source: {alert.source}</span>
                        </div>
                      </div>

                      <Eye className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Logs section removed as requested */}
          </div>
        </main>
      </div>

      {/* ✅ Add Admin Nav component from stored code */}

      <Nav />

      {/* --- Modals/Popouts (using Popover for Alert Details) --- */}

      {/* Global Logout Confirmation Popover */}

      {showLogoutConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${bgCard} rounded-xl shadow-xl max-w-md w-full p-6`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-800 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-300" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Confirm Global Logout
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will immediately terminate all active user sessions. Users
              will need to log in again. **This action cannot be undone.**
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleGlobalLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-500 transition-colors cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Freeze Confirmation Popover */}

      {showFreezeConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${bgCard} rounded-xl shadow-xl max-w-md w-full p-6`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-800 rounded-lg">
                <Lock className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {contentFrozen
                  ? "Disable Content Freeze"
                  : "Enable Content Freeze"}
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {contentFrozen
                ? "This will restore normal content operations. Users will be able to create and edit content again."
                : "This will prevent all users from creating or editing content. Only read operations will be allowed."}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFreezeConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleContentFreeze}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  contentFrozen
                    ? "bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-500"
                    : "bg-orange-600 text-white hover:bg-orange-700 dark:hover:bg-orange-500"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Detail Popover/Modal - ✅ Using a fixed modal style for details */}

      {selectedAlert && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${bgCard} rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(
                      selectedAlert.severity
                    )}`}
                  >
                    {selectedAlert.severity.toUpperCase()}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-2">
                    {selectedAlert.message}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {selectedAlert.type.replace("-", " ").toUpperCase()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Source
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {selectedAlert.source}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Timestamp
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {new Date(selectedAlert.timestamp).toLocaleString()}
                  </p>
                </div>

                {selectedAlert.details && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Details
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mt-1 whitespace-pre-wrap break-words">
                      {selectedAlert.details}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  className="flex-1 px-4 py-2 text-white rounded-lg transition-colors cursor-pointer hover:bg-[#507800]"
                  style={{ backgroundColor: primary }}
                >
                  Acknowledge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityPage;
