"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  AlertCircle,
  User,
  Shield,
  Flag,
  Edit,
  Clock,
} from "lucide-react";

import AdminSidebar from "@/components/ui/admin-sidebar";
import AdminHeader from "@/components/ui/admin-header";

interface AuditLog {
  id: string;
  timestamp: Date;
  actor: string;
  actorRole: "admin" | "instructor" | "system";
  action:
    | "role_change"
    | "feature_flag_toggle"
    | "content_edit"
    | "user_delete"
    | "permission_update";
  actionLabel: string;
  target: string;
  details: string;
  ipAddress: string;
  severity: "low" | "medium" | "high" | "critical";
}

const mockLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: new Date("2025-10-01T14:30:00"),
    actor: "john.doe@example.com",
    actorRole: "admin",
    action: "role_change",
    actionLabel: "Role Changed",
    target: "jane.smith@example.com",
    details: "Changed role from Instructor to Admin",
    ipAddress: "192.168.1.100",
    severity: "high",
  },
  {
    id: "2",
    timestamp: new Date("2025-10-01T13:15:00"),
    actor: "admin@system.com",
    actorRole: "system",
    action: "feature_flag_toggle",
    actionLabel: "Feature Flag Toggled",
    target: "advanced_analytics",
    details: "Enabled feature flag: advanced_analytics",
    ipAddress: "10.0.0.1",
    severity: "medium",
  },
  {
    id: "3",
    timestamp: new Date("2025-10-01T12:45:00"),
    actor: "sarah.wilson@example.com",
    actorRole: "instructor",
    action: "content_edit",
    actionLabel: "Emergency Content Edit",
    target: "Course: Introduction to React",
    details: "Emergency fix: Corrected critical error in module 3",
    ipAddress: "192.168.1.105",
    severity: "critical",
  },
];

const AuditLogsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logs] = useState<AuditLog[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<AuditLog["actorRole"] | "all">("all");
  const [selectedAction, setSelectedAction] = useState<AuditLog["action"] | "all">("all");
  const [selectedSeverity, setSelectedSeverity] = useState<AuditLog["severity"] | "all">("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === "all" || log.actorRole === selectedRole;
      const matchesAction = selectedAction === "all" || log.action === selectedAction;
      const matchesSeverity = selectedSeverity === "all" || log.severity === selectedSeverity;

      const matchesDate =
        (!dateRange.start || log.timestamp >= new Date(dateRange.start)) &&
        (!dateRange.end || log.timestamp <= new Date(dateRange.end));

      return matchesSearch && matchesRole && matchesAction && matchesSeverity && matchesDate;
    });
  }, [logs, searchTerm, selectedRole, selectedAction, selectedSeverity, dateRange]);

  const getActionIcon = (action: AuditLog["action"]) => {
    switch (action) {
      case "role_change":
        return <Shield className="w-4 h-4" />;
      case "feature_flag_toggle":
        return <Flag className="w-4 h-4" />;
      case "content_edit":
        return <Edit className="w-4 h-4" />;
      case "user_delete":
        return <AlertCircle className="w-4 h-4" />;
      case "permission_update":
        return <User className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: AuditLog["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getRoleBadgeColor = (role: AuditLog["actorRole"]) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "instructor":
        return "bg-green-100 text-green-800";
      case "system":
        return "bg-gray-100 text-gray-800";
    }
  };

  const exportLogs = () => {
    const csv = [
      ["Timestamp", "Actor", "Role", "Action", "Target", "Details", "IP Address", "Severity"],
      ...filteredLogs.map((log) => [
        log.timestamp.toISOString(),
        log.actor,
        log.actorRole,
        log.actionLabel,
        log.target,
        log.details,
        log.ipAddress,
        log.severity,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full overflow-y-auto">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Audit Logs</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Monitor all sensitive admin and instructor operations for compliance and security
            </p>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                className="pl-9 pr-3 py-2 border rounded-md w-full text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border rounded-md text-sm sm:text-base"
              >
                <Filter className="w-4 h-4 mr-2" /> Filters
              </button>
              <button
                onClick={exportLogs}
                className="flex items-center px-3 py-2 border rounded-md bg-blue-600 text-white text-sm sm:text-base"
              >
                <Download className="w-4 h-4 mr-2" /> Export
              </button>
            </div>
          </div>

          {/* Logs Table (responsive scroll) */}
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600">Time</th>
                  <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600">Actor</th>
                  <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600">Action</th>
                  <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600">Target</th>
                  <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600">Details</th>
                  <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600">IP</th>
                  <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600">Severity</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b">
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-600">
                      {log.timestamp.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-xs sm:text-sm">
                      <span
                        className={`px-2 py-1 rounded text-[10px] sm:text-xs font-medium ${getRoleBadgeColor(
                          log.actorRole
                        )}`}
                      >
                        {log.actor}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs sm:text-sm flex items-center gap-1">
                      {getActionIcon(log.action)}
                      {log.actionLabel}
                    </td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-600">{log.target}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-600">{log.details}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-600">{log.ipAddress}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm">
                      <span
                        className={`px-2 py-1 rounded border text-[10px] sm:text-xs font-medium ${getSeverityColor(
                          log.severity
                        )}`}
                      >
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500 text-sm">
                      No logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditLogsPage;
