"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/ui/admin-sidebar";
import AdminHeader from "@/components/ui/admin-header";
import {
  Shield,
  AlertTriangle,
  Lock,
  Activity,
  Database,
  Users,
  Ban,
  Eye,
  Clock,
  TrendingUp,
} from "lucide-react";

interface SecurityAlert {
  id: string;
  type:
    | "rate-limit"
    | "suspicious-login"
    | "data-breach"
    | "unauthorized-access";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: string;
  source: string;
  details?: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  source: "sentry" | "posthog" | "internal";
  message: string;
  metadata?: Record<string, any>;
}

const SecurityPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ Added like in dashboard
  const [contentFrozen, setContentFrozen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showFreezeConfirm, setShowFreezeConfirm] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(
    null
  );
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

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
  ]);

  // --- Mock system logs ---
  const [logs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: "2025-10-01T14:30:00Z",
      level: "error",
      source: "sentry",
      message: "Uncaught exception in payment processing",
      metadata: { userId: "user_123", orderId: "order_456" },
    },
    {
      id: "2",
      timestamp: "2025-10-01T14:25:00Z",
      level: "warning",
      source: "posthog",
      message: "Unusual user behavior pattern detected",
      metadata: { pattern: "rapid-navigation", sessions: 5 },
    },
    {
      id: "3",
      timestamp: "2025-10-01T14:20:00Z",
      level: "info",
      source: "internal",
      message: "Security scan completed successfully",
      metadata: { vulnerabilities: 0, duration: "45s" },
    },
  ]);

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
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "rate-limit":
        return <TrendingUp className="w-5 h-5" />;
      case "suspicious-login":
        return <Users className="w-5 h-5" />;
      case "data-breach":
        return <Database className="w-5 h-5" />;
      case "unauthorized-access":
        return <Ban className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const filteredAlerts =
    filterSeverity === "all"
      ? alerts
      : alerts.filter((a) => a.severity === filterSeverity);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                      {/* <Shield className="w-8 h-8 text-blue-600" /> */}
                      Security Controls
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Manage security settings and monitor threats
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      contentFrozen
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span className="font-medium">
                      {contentFrozen ? "Content Frozen" : "System Normal"}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Global Logout Card */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 rounded-lg">
                          <Users className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Force Global Logout
                          </h3>
                          <p className="text-sm text-gray-600">
                            End all active sessions
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Immediately terminate all user sessions across the
                      platform. Use this in case of security breach or
                      emergency.
                    </p>
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Initiate Global Logout
                    </button>
                  </div>

                  {/* Content Freeze Card */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <Lock className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Content Freeze Mode
                          </h3>
                          <p className="text-sm text-gray-600">
                            Block new content creation
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Temporarily prevent users from creating, editing, or
                      publishing new content. Read-only mode for investigation.
                    </p>
                    <button
                      onClick={() => setShowFreezeConfirm(true)}
                      className={`w-full px-4 py-2 rounded-lg transition-colors font-medium ${
                        contentFrozen
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-orange-600 text-white hover:bg-orange-700"
                      }`}
                    >
                      {contentFrozen
                        ? "Disable Content Freeze"
                        : "Enable Content Freeze"}
                    </button>
                  </div>
                </div>

                {/* Security Stats */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Critical Alerts
                      </span>
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">1</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Last 24 hours
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Active Sessions
                      </span>
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      1,247
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Current users
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Blocked IPs</span>
                      <Ban className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">23</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Auto-blocked
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Rate Limits</span>
                      <TrendingUp className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">7</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Triggered today
                    </div>
                  </div>
                </div>

                {/* Security Alerts */}
<div className="bg-white rounded-lg border border-gray-200 mt-6">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        Security Alerts
                      </h2>
                      <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="all">All Severities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {filteredAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-2 rounded-lg ${getSeverityColor(
                              alert.severity
                            )}`}
                          >
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(
                                  alert.severity
                                )}`}
                              >
                                {alert.severity.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500">
                                {alert.type.replace("-", " ").toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {alert.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(alert.timestamp).toLocaleString()}
                              </span>
                              <span>Source: {alert.source}</span>
                            </div>
                          </div>
                          <Eye className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Logs */}
<div className="bg-white rounded-lg border border-gray-200 mt-6">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-600" />
                      System Logs Integration
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Recent logs from Sentry, PostHog, and internal systems
                    </p>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {logs.map((log) => (
                      <div key={log.id} className="p-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              log.level === "error"
                                ? "bg-red-100 text-red-700"
                                : log.level === "warning"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {log.level.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-gray-900">
                                {log.source.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {log.message}
                            </p>
                            {log.metadata && (
                              <pre className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded overflow-x-auto">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Global Logout Confirmation Modal */}
                {showLogoutConfirm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-red-100 rounded-lg">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Confirm Global Logout
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-6">
                        This will immediately terminate all active user
                        sessions. Users will need to log in again. This action
                        cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowLogoutConfirm(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleGlobalLogout}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Confirm Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Freeze Confirmation Modal */}
                {showFreezeConfirm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <Lock className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {contentFrozen
                            ? "Disable Content Freeze"
                            : "Enable Content Freeze"}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-6">
                        {contentFrozen
                          ? "This will restore normal content operations. Users will be able to create and edit content again."
                          : "This will prevent all users from creating or editing content. Only read operations will be allowed."}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowFreezeConfirm(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleContentFreeze}
                          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                            contentFrozen
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-orange-600 text-white hover:bg-orange-700"
                          }`}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Alert Detail Modal */}
                {selectedAlert && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-3 rounded-lg ${getSeverityColor(
                              selectedAlert.severity
                            )}`}
                          >
                            {getAlertIcon(selectedAlert.type)}
                          </div>
                          <div>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(
                                selectedAlert.severity
                              )}`}
                            >
                              {selectedAlert.severity.toUpperCase()}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900 mt-2">
                              {selectedAlert.message}
                            </h3>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedAlert(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Type
                          </label>
                          <p className="text-sm text-gray-900">
                            {selectedAlert.type.replace("-", " ").toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Source
                          </label>
                          <p className="text-sm text-gray-900">
                            {selectedAlert.source}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Timestamp
                          </label>
                          <p className="text-sm text-gray-900">
                            {new Date(selectedAlert.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {selectedAlert.details && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Details
                            </label>
                            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">
                              {selectedAlert.details}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={() => setSelectedAlert(null)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Close
                        </button>
                        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Take Action
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
        </main>
      </div>
    </div>
  );
};

export default SecurityPage;
