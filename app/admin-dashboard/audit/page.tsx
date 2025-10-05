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
    ChevronUp, // Added for sorting indicator
    ChevronDown, // Added for sorting indicator
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

// Map severity to a numerical order for accurate sorting
const severityOrder: Record<AuditLog["severity"], number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
};

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
    {
        id: "4",
        timestamp: new Date("2025-10-01T15:00:00"),
        actor: "admin.user@example.com",
        actorRole: "admin",
        action: "permission_update",
        actionLabel: "Permission Updated",
        target: "User: Bob Smith",
        details: "Granted access to reports dashboard",
        ipAddress: "203.0.113.5",
        severity: "low",
    },
];

// Define SortConfig type for state management
type SortKey = keyof AuditLog | "actionLabel" | "actorRole";
type SortDirection = "ascending" | "descending";
interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}


const AuditLogsPage: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [logs] = useState<AuditLog[]>(mockLogs);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState<AuditLog["actorRole"] | "all">("all");
    const [selectedAction, setSelectedAction] = useState<AuditLog["action"] | "all">("all");
    const [selectedSeverity, setSelectedSeverity] = useState<AuditLog["severity"] | "all">("all");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [showFilters, setShowFilters] = useState(false);
    // 1. STATE FOR SORTING: Default to sorting by timestamp descending
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "timestamp", direction: "descending" });


    // --- SORTING LOGIC ---
    const sortedLogs = useMemo(() => {
        let filtered = logs.filter((log) => {
            const matchesSearch =
                log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.details.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = selectedRole === "all" || log.actorRole === selectedRole;
            const matchesAction = selectedAction === "all" || log.action === selectedAction;
            const matchesSeverity = selectedSeverity === "all" || log.severity === selectedSeverity;

            return matchesSearch && matchesRole && matchesAction && matchesSeverity;
        });

        // Date filtering
        filtered = filtered.filter((log) => {
            const logDate = log.timestamp.getTime();
            let matchesDate = true;

            if (dateRange.start) {
                const startDate = new Date(dateRange.start);
                startDate.setHours(0, 0, 0, 0);
                matchesDate = matchesDate && logDate >= startDate.getTime();
            }

            if (dateRange.end) {
                const endDate = new Date(dateRange.end);
                endDate.setHours(23, 59, 59, 999);
                matchesDate = matchesDate && logDate <= endDate.getTime();
            }

            return matchesDate;
        });

        // 2. APPLY SORTING LOGIC
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue: any, bValue: any;

                if (sortConfig.key === 'actionLabel') {
                    aValue = a.actionLabel;
                    bValue = b.actionLabel;
                } else if (sortConfig.key === 'actorRole') {
                    aValue = a.actorRole;
                    bValue = b.actorRole;
                } else {
                    aValue = a[sortConfig.key as keyof AuditLog];
                    bValue = b[sortConfig.key as keyof AuditLog];
                }

                if (sortConfig.key === "timestamp") {
                    const comparison = aValue.getTime() - bValue.getTime();
                    return sortConfig.direction === "ascending" ? comparison : -comparison;
                } else if (sortConfig.key === "severity") {
                    const comparison = severityOrder[aValue as AuditLog["severity"]] - severityOrder[bValue as AuditLog["severity"]];
                    return sortConfig.direction === "ascending" ? comparison : -comparison;
                } else {
                    // Default string comparison
                    const comparison = String(aValue).localeCompare(String(bValue), undefined, { numeric: true });
                    return sortConfig.direction === "ascending" ? comparison : -comparison;
                }
            });
        }
        
        return filtered;

    }, [logs, searchTerm, selectedRole, selectedAction, selectedSeverity, dateRange, sortConfig]);

    // 3. FUNCTION TO HANDLE SORT REQUESTS
    const requestSort = (key: SortKey) => {
        let direction: SortDirection = "ascending";
        // If the current key is the same, toggle direction
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: SortKey) => {
        if (sortConfig.key !== key) {
            return null; // Not the active column
        }
        if (sortConfig.direction === "ascending") {
            return <ChevronUp className="w-4 h-4 ml-1" />;
        }
        return <ChevronDown className="w-4 h-4 ml-1" />;
    };
    // ---------------------------------


    const getActionIcon = (action: AuditLog["action"]) => {
        switch (action) {
            case "role_change":
                return <Shield className="w-4 h-4 text-purple-500 dark:text-purple-400" />;
            case "feature_flag_toggle":
                return <Flag className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
            case "content_edit":
                return <Edit className="w-4 h-4 text-green-500 dark:text-green-400" />;
            case "user_delete":
                return <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />;
            case "permission_update":
                return <User className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
        }
    };

    const getSeverityColor = (severity: AuditLog["severity"]) => {
        switch (severity) {
            case "critical":
                return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700";
            case "high":
                return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700";
            case "medium":
                return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700";
            case "low":
                return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700";
        }
    };

    const getRoleBadgeColor = (role: AuditLog["actorRole"]) => {
        switch (role) {
            case "admin":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
            case "instructor":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "system":
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
        }
    };

    const exportLogs = () => {
        const csv = [
            ["Timestamp", "Actor", "Role", "Action", "Target", "Details", "IP Address", "Severity"],
            ...sortedLogs.map((log) => [
                `"${log.timestamp.toISOString()}"`,
                `"${log.actor}"`,
                log.actorRole,
                `"${log.actionLabel}"`,
                `"${log.target}"`,
                `"${log.details.replace(/"/g, '""')}"`, // Handle quotes in details
                log.ipAddress,
                log.severity,
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full overflow-y-auto">
                    {/* Page Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Audit Logs</h1>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            Monitor all sensitive admin and instructor operations for compliance and security
                        </p>
                    </div>

                    {/* Search + Filters Controls (unchanged) */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search logs (actor, target, details)..."
                                className="pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-md w-full text-sm sm:text-base focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center px-3 py-2 border rounded-md text-sm sm:text-base transition-colors ${
                                    showFilters
                                        ? "bg-indigo-500 text-white dark:bg-indigo-600 dark:text-white"
                                        : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                            >
                                <Filter className="w-4 h-4 mr-2" /> {showFilters ? "Hide Filters" : "Show Filters"}
                            </button>
                            <button
                                onClick={exportLogs}
                                className="flex items-center px-3 py-2 border rounded-md bg-blue-600 text-white text-sm sm:text-base hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 border-blue-600"
                            >
                                <Download className="w-4 h-4 mr-2" /> Export CSV
                            </button>
                        </div>
                    </div>

                    {/* Detailed Filters Dropdown (unchanged) */}
                    {showFilters && (
                        <div className="mb-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Role Filter */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Actor Role</label>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value as AuditLog["actorRole"] | "all")}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 rounded-md text-sm"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="admin">Admin</option>
                                        <option value="instructor">Instructor</option>
                                        <option value="system">System</option>
                                    </select>
                                </div>

                                {/* Action Filter */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Action Type</label>
                                    <select
                                        value={selectedAction}
                                        onChange={(e) => setSelectedAction(e.target.value as AuditLog["action"] | "all")}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 rounded-md text-sm"
                                    >
                                        <option value="all">All Actions</option>
                                        <option value="role_change">Role Change</option>
                                        <option value="feature_flag_toggle">Feature Flag Toggle</option>
                                        <option value="content_edit">Content Edit</option>
                                        <option value="user_delete">User Delete</option>
                                        <option value="permission_update">Permission Update</option>
                                    </select>
                                </div>

                                {/* Severity Filter */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Severity</label>
                                    <select
                                        value={selectedSeverity}
                                        onChange={(e) => setSelectedSeverity(e.target.value as AuditLog["severity"] | "all")}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 rounded-md text-sm"
                                    >
                                        <option value="all">All Severities</option>
                                        <option value="critical">Critical</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>

                                {/* Date Range Filter (Start Date) */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 rounded-md text-sm"
                                    />
                                </div>

                                {/* Date Range Filter (End Date) */}
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 rounded-md text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Logs Table (responsive scroll) */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-700">
                        <table className="w-full min-w-[1100px]">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-700">
                                <tr>
                                    {/* Sortable Header: Time/Timestamp */}
                                    <th
                                        className={`px-4 py-3 text-left text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors ${sortConfig.key === "timestamp" ? "text-indigo-500" : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"}`}
                                        onClick={() => requestSort("timestamp")}
                                    >
                                        <div className="flex items-center">
                                            Time {getSortIcon("timestamp")}
                                        </div>
                                    </th>

                                    {/* Sortable Header: Actor */}
                                    <th
                                        className={`px-4 py-3 text-left text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors ${sortConfig.key === "actor" ? "text-indigo-500" : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"}`}
                                        onClick={() => requestSort("actor")}
                                    >
                                        <div className="flex items-center">
                                            Actor {getSortIcon("actor")}
                                        </div>
                                    </th>

                                    {/* Sortable Header: Action */}
                                    <th
                                        className={`px-4 py-3 text-left text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors ${sortConfig.key === "actionLabel" ? "text-indigo-500" : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"}`}
                                        onClick={() => requestSort("actionLabel")}
                                    >
                                        <div className="flex items-center">
                                            Action {getSortIcon("actionLabel")}
                                        </div>
                                    </th>

                                    {/* Sortable Header: Target */}
                                    <th
                                        className={`px-4 py-3 text-left text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors ${sortConfig.key === "target" ? "text-indigo-500" : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"}`}
                                        onClick={() => requestSort("target")}
                                    >
                                        <div className="flex items-center">
                                            Target {getSortIcon("target")}
                                        </div>
                                    </th>

                                    {/* Sortable Header: Details */}
                                    <th
                                        className={`px-4 py-3 text-left text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors ${sortConfig.key === "details" ? "text-indigo-500" : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"}`}
                                        onClick={() => requestSort("details")}
                                    >
                                        <div className="flex items-center">
                                            Details {getSortIcon("details")}
                                        </div>
                                    </th>
                                    
                                    {/* Sortable Header: IP Address */}
                                    <th
                                        className={`px-4 py-3 text-left text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors ${sortConfig.key === "ipAddress" ? "text-indigo-500" : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"}`}
                                        onClick={() => requestSort("ipAddress")}
                                    >
                                        <div className="flex items-center">
                                            IP {getSortIcon("ipAddress")}
                                        </div>
                                    </th>
                                    
                                    {/* Sortable Header: Severity */}
                                    <th
                                        className={`px-4 py-3 text-left text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors ${sortConfig.key === "severity" ? "text-indigo-500" : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"}`}
                                        onClick={() => requestSort("severity")}
                                    >
                                        <div className="flex items-center">
                                            Severity {getSortIcon("severity")}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedLogs.map((log) => (
                                    <tr key={log.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-4 py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                            {log.timestamp.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-xs sm:text-sm">
                                            <span
                                                className={`px-2 py-1 rounded text-[10px] sm:text-xs font-medium ${getRoleBadgeColor(
                                                    log.actorRole
                                                )}`}
                                            >
                                                {log.actor}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs sm:text-sm text-gray-800 dark:text-gray-200 flex items-center gap-1">
                                            {getActionIcon(log.action)}
                                            {log.actionLabel}
                                        </td>
                                        <td className="px-4 py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">{log.target}</td>
                                        <td className="px-4 py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-sm truncate">{log.details}</td>
                                        <td className="px-4 py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">{log.ipAddress}</td>
                                        <td className="px-4 py-3 text-xs sm:text-sm">
                                            <span
                                                className={`px-2 py-1 rounded border text-[10px] sm:text-xs font-medium ${getSeverityColor(
                                                    log.severity
                                                )}`}
                                            >
                                                {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {sortedLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                                            No audit logs found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="p-3 text-right text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700">
                            Total Logs: {sortedLogs.length}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AuditLogsPage;