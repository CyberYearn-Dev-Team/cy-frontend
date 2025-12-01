"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Calendar as CalendarIcon,
  Filter,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import AdminSidebar from "@/components/admin-sidebar";
import AdminHeader from "@/components/admin-header";
import Nav from "@/components/admin-nav";

interface AuditLog {
  id: string;
  // NOTE: This will likely be a string from the API (e.g., ISO 8601).
  // You will need to convert it to a Date object when fetched.
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
  details: string;
  ipAddress: string;
  severity: "low" | "medium" | "high" | "critical";
}

// 🎨 Theme Colors
const primary = "#72a210";
const secondary = "#507800";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textMedium = "text-gray-600 dark:text-gray-400";

const severityOrder: Record<AuditLog["severity"], number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

// --- MOCKED DATA REMOVED ---
// The original mockLogs array has been removed.
// --- MOCKED DATA REMOVED ---

type SortKey = keyof AuditLog | "actionLabel" | "actorRole";
type SortDirection = "ascending" | "descending";
interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

type ActionFilter =
  | "all"
  | "role_change"
  | "feature_flag_toggle"
  | "content_edit"
  | "user_delete"
  | "permission_update";
type SeverityFilter = "all" | "low" | "medium" | "high" | "critical";

export default function AuditLogsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // 🎯 KEY CHANGE: Initial state is now an empty array.
  // The 'logs' state must be updated via an API call.
  const [logs, setLogs] = useState<AuditLog[]>([]);
  // State for tracking loading and error (highly recommended for real data)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig] = useState<SortConfig>({
    key: "timestamp",
    direction: "descending",
  });

  // NOTE: In a production app with a large number of logs, you should request
  // filtered/sorted data from the **backend**. The current useMemo approach
  // is fine for a few hundred logs, but not thousands.
  const sortedLogs = useMemo(() => {
    let filtered = logs.filter((log) => {
      const matchesSearch =
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actionLabel.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction = actionFilter === "all" || log.action === actionFilter;
      const matchesSeverity =
        severityFilter === "all" || log.severity === severityFilter;
      return matchesSearch && matchesAction && matchesSeverity;
    });

    filtered = filtered.filter((log) => {
      const logDate = log.timestamp.getTime();
      let matchesDate = true;
      if (startDate) matchesDate = matchesDate && logDate >= startDate.getTime();
      if (endDate) matchesDate = matchesDate && logDate <= endDate.getTime();
      return matchesDate;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof AuditLog];
      const bValue = b[sortConfig.key as keyof AuditLog];

      if (sortConfig.key === "timestamp") {
        const aTime = aValue as Date;
        const bTime = bValue as Date;
        return sortConfig.direction === "ascending"
          ? aTime.getTime() - bTime.getTime()
          : bTime.getTime() - aTime.getTime();
      }
      if (sortConfig.key === "severity") {
        const aSeverity = aValue as AuditLog["severity"];
        const bSeverity = bValue as AuditLog["severity"];
        return sortConfig.direction === "ascending"
          ? severityOrder[aSeverity] - severityOrder[bSeverity]
          : severityOrder[bSeverity] - severityOrder[aSeverity];
      }
      const comparison = String(aValue).localeCompare(String(bValue));
      return sortConfig.direction === "ascending" ? comparison : -comparison;
    });
    return filtered;
  }, [logs, searchTerm, actionFilter, severityFilter, startDate, endDate, sortConfig]);

  // --- RENDERING SECTION ---
  
  // ... (rest of the component JSX remains the same)
  
  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Audit Logs
              </h1>
              <p className={`${textMedium}`}>
                Monitor all sensitive admin and instructor operations.
              </p>
            </div>

            {/* Search & Filter Toggle */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#72a210]"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 whitespace-nowrap border-0 text-white font-medium"
                style={{
                  backgroundColor: showFilters ? secondary : primary,
                  transition: "background-color 0.2s ease",
                }}
              >
                {showFilters ? (
                  <>
                    <X className="w-4 h-4" /> Hide Filters
                  </>
                ) : (
                  <>
                    <Filter className="w-4 h-4" /> Show Filters
                  </>
                )}
              </Button>
            </div>

            {/* Filters Section */}
            {showFilters && (
              <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Action Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-between w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">
                      {actionFilter === "all"
                        ? "All Actions"
                        : actionFilter
                            .split("_")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                      <ChevronDown className="ml-2 w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[
                      "role_change",
                      "feature_flag_toggle",
                      "content_edit",
                      "user_delete",
                      "permission_update",
                    ].map((action) => (
                      <DropdownMenuItem
                        key={action}
                        onClick={() => setActionFilter(action as ActionFilter)}
                      >
                        {action
                          .split("_")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Severity Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-between w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">
                      {severityFilter === "all"
                        ? "All Severities"
                        : severityFilter.charAt(0).toUpperCase() +
                          severityFilter.slice(1)}
                      <ChevronDown className="ml-2 w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["critical", "high", "medium", "low"].map((sev) => (
                      <DropdownMenuItem
                        key={sev}
                        onClick={() => setSeverityFilter(sev as SeverityFilter)}
                      >
                        {sev.charAt(0).toUpperCase() + sev.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Date Pickers */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-300 dark:border-gray-700",
                        !startDate && "text-gray-500 dark:text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-300 dark:border-gray-700",
                        !endDate && "text-gray-500 dark:text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Logs Table */}
            <div
              className={`${bgCard} rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-800`}
            >
              {/* Add loading/error indicators here */}
              {isLoading && (
                  <div className="text-center py-10 text-lg text-gray-500 dark:text-gray-400">
                      Loading audit logs...
                  </div>
              )}
              {error && (
                  <div className="text-center py-10 text-lg text-red-600 dark:text-red-400">
                      Error fetching logs: {error}
                  </div>
              )}
              
              {!isLoading && !error && (
                  <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                          <thead className="bg-gray-100 dark:bg-gray-700">
                              <tr>
                                  <th className="px-6 py-3 text-left">Time</th>
                                  <th className="px-6 py-3 text-left">Actor</th>
                                  <th className="px-6 py-3 text-left">Action</th>
                                  <th className="px-6 py-3 text-left">Details</th>
                                  <th className="px-6 py-3 text-left">IP</th>
                                  <th className="px-6 py-3 text-left">Severity</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {sortedLogs.map((log) => (
                                  <tr
                                      key={log.id}
                                      className="hover:bg-gray-50 dark:hover:bg-gray-700/40"
                                  >
                                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                          {log.timestamp.toLocaleString()}
                                      </td>
                                      <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                          {log.actor}
                                      </td>
                                      <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                          {log.actionLabel}
                                      </td>
                                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                          {log.details}
                                      </td>
                                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                          {log.ipAddress}
                                      </td>
                                      <td className="px-6 py-4">
                                          <span
                                              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                                  log.severity === "critical"
                                                      ? "bg-red-100 text-red-700"
                                                      : log.severity === "high"
                                                          ? "bg-orange-100 text-orange-700"
                                                          : log.severity === "medium"
                                                              ? "bg-yellow-100 text-yellow-700"
                                                              : "bg-green-100 text-green-700"
                                              }`}
                                          >
                                              {log.severity.charAt(0).toUpperCase() +
                                                  log.severity.slice(1)}
                                          </span>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}
              {sortedLogs.length === 0 && !isLoading && !error && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No logs found.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Nav />
    </div>
  );
}