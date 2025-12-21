"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Calendar as CalendarIcon,
  Filter,
  History,
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
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import AdminSidebar from "@/components/admin-sidebar";
import AdminHeader from "@/components/admin-header";
import Nav from "@/components/admin-nav";
import { getAuditLogs } from "@/lib/services/auditLogService";
import { AuditLogsSkeleton } from "@/components/ui/audit-logs-skeleton";

// --- TYPES ---

interface AuditDiff {
  field: string;
  oldValue: any;
  newValue: any;
}

interface AuditLog {
  id: string;
  timestamp: Date;
  actor: string;
  actorRole: string;
  entity: string;
  action: string;
  actionLabel: string;
  details: string;
  ipAddress: string;
  severity: "low" | "medium" | "high" | "critical";
  diff?: AuditDiff[];
}

const deriveFallbackDiff = (log: any): AuditDiff[] | undefined => {
  const { actionTitle, actionDescription, entity } = log;

  if (!actionTitle || !actionDescription) return undefined;

  // ROLE UPDATES
  if (actionTitle === "Role Updated") {
    const added = actionDescription.match(/Added (.+) role/i);
    const removed = actionDescription.match(/Removed (.+) role/i);

    if (added) {
      return [
        {
          field: "roles",
          oldValue: "Role not assigned",
          newValue: added[1].toUpperCase(),
        },
      ];
    }

    if (removed) {
      return [
        {
          field: "roles",
          oldValue: removed[1].toUpperCase(),
          newValue: "Role removed",
        },
      ];
    }
  }

  // USER SUSPENDED
  if (actionTitle === "User Suspended") {
    return [
      {
        field: "suspended",
        oldValue: false,
        newValue: true,
      },
    ];
  }

  // USER REACTIVATED
  if (actionTitle === "User Reactivated") {
    return [
      {
        field: "suspended",
        oldValue: true,
        newValue: false,
      },
    ];
  }

  // FEATURE FLAG UPDATED
  if (actionTitle === "Updated Feature Flag") {
    return [
      {
        field: entity?.replace("Feature:", "").trim() || "feature",
        oldValue: "Previous state",
        newValue: "Updated",
      },
    ];
  }

  return undefined;
};

const getSeverity = (log: any): "low" | "medium" | "high" | "critical" => {
  // If there's a backend-provided severity, use it
  if (log.severity) return log.severity;

  // Otherwise, determine severity based on action type
  const { actionTitle } = log;
  
  if (actionTitle === "User Suspended" || actionTitle === "User Deleted") {
    return "high";
  }
  
  if (actionTitle === "Role Updated" || actionTitle === "Updated Feature Flag") {
    return "medium";
  }

  // Default to low for all other actions
  return "low";
};

const mapApiToUiLog = (apiLog: any): AuditLog => {
  const diff = apiLog.diffJson || deriveFallbackDiff(apiLog);
  const severity = getSeverity(apiLog);
  const ipAddress = 'N/A';

  return {
    id: apiLog.id,
    timestamp: parseISO(apiLog.createdAt),
    actor: apiLog.actor?.username || 'System',
    actorRole: apiLog.actor?.roles?.[0] || 'system',
    entity: apiLog.entity,
    action: apiLog.actionTitle ? apiLog.actionTitle.toLowerCase().replace(/\s+/g, '_') : 'unknown',
    actionLabel: apiLog.actionTitle || 'Unknown Action',
    details: apiLog.actionDescription || '',
    ipAddress,
    severity,
    diff: diff || undefined
  };
};

const primary = "#72a210";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textMedium = "text-gray-600 dark:text-gray-400";

export default function AuditLogsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const apiLogs = await getAuditLogs();
        const mappedLogs = apiLogs.map(mapApiToUiLog);
        setLogs(mappedLogs);
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
        setError('Failed to load audit logs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedRows(newExpanded);
  };

  const sortedLogs = useMemo(() => {
    let filtered = logs.filter((log) => {
      const matchesSearch =
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entity.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction = actionFilter === "all" || log.action === actionFilter;
      const matchesSeverity =
        severityFilter === "all" || log.severity === severityFilter;
      return matchesSearch && matchesAction && matchesSeverity;
    });

    if (startDate || endDate) {
      filtered = filtered.filter((log) => {
        const logDate = log.timestamp.getTime();
        if (startDate && logDate < startDate.getTime()) return false;
        if (endDate && logDate > endDate.getTime()) return false;
        return true;
      });
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [logs, searchTerm, actionFilter, severityFilter, startDate, endDate]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Audit Logs</h1>
              </div>
              <AuditLogsSkeleton />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-30">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                System Audit Logs
              </h1>
              <p className={`${textMedium}`}>
                Detailed history of changes to users, content, and system configurations.
              </p>
            </div>

            <div className="flex sm:flex-row gap-4 items-center">
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by actor or entity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#72a210] outline-none"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="text-white p-5"
                style={{ backgroundColor: primary }}
              >
                <Filter className="w-4 h-4 mr-2" /> {showFilters ? "Hide Filters" : "Filters"}
              </Button>
            </div>

            {showFilters && (
              <div className="flex justify-between md:flex gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-[160px] justify-between cursor-pointer">
                      {severityFilter === 'all' ? 'All Severities' : `${severityFilter.charAt(0).toUpperCase() + severityFilter.slice(1)}`}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[180px]">
                    <DropdownMenuItem onClick={() => setSeverityFilter('all')}>All Severities</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSeverityFilter('critical')}>Critical</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSeverityFilter('high')}>High</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSeverityFilter('medium')}>Medium</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSeverityFilter('low')}>Low</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal cursor-pointer">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className={`${bgCard} rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4 w-10"></th>
                      <th className="px-6 py-4">Actor</th>
                      <th className="px-6 py-4">Entity</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#72a210]"></div>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">Loading audit logs...</p>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center">
                          <p className="text-red-500">{error}</p>
                          <Button 
                            onClick={() => window.location.reload()}
                            className="mt-2 bg-[#72a210] text-white cursor-pointer"
                          >
                            Retry
                          </Button>
                        </td>
                      </tr>
                    ) : sortedLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No audit logs found
                        </td>
                      </tr>
                    ) : (
                      sortedLogs.map((log) => (
                        <React.Fragment key={log.id}>
                          <tr 
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                            onClick={() => toggleRow(log.id)}
                          >
                            <td className="px-6 py-4">
                              {expandedRows.has(log.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900 dark:text-gray-100">{log.actor}</div>
                              <div className="text-xs text-gray-500 uppercase">{log.actorRole}</div>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-[#72a210] dark:text-[#72a210]">
                              {log.entity}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-medium">{log.actionLabel}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[200px]">{log.details}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                              {format(log.timestamp, "MMM dd, HH:mm:ss")}
                            </td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                                log.severity === "critical" ? "bg-red-100 text-red-700" :
                                log.severity === "high" ? "bg-orange-100 text-orange-700" :
                                log.severity === "medium" ? "bg-yellow-100 text-yellow-700" :
                                "bg-green-100 text-green-700"
                              )}>
                                {log.severity}
                              </span>
                            </td>
                          </tr>
                          
                          {expandedRows.has(log.id) && (
                            <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                              <td colSpan={6} className="px-12 py-6 border-l-4 border-[#72a210]">
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    <History className="w-4 h-4" />
                                    Change Summary (Diff)
                                  </div>
                                  
                                  {log.diff && log.diff.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-2">
                                      <div className="grid grid-cols-3 text-xs font-bold text-gray-400 uppercase px-3">
                                        <span>Field</span>
                                        <span>Before</span>
                                        <span>After</span>
                                      </div>
                                      {log.diff.map((change, idx) => (
                                        <div key={`${log.id}-diff-${idx}`} className="grid grid-cols-3 items-center bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 text-sm">
                                          <span className="font-mono font-bold text-gray-600 dark:text-gray-400">{change.field}</span>
                                          <span className="text-red-500 line-through decoration-red-300/50 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded w-fit">
                                            {JSON.stringify(change.oldValue)}
                                          </span>
                                          <span className="text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded w-fit">
                                            {JSON.stringify(change.newValue)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-gray-500 italic">No structured diff available for this action.</p>
                                  )}
                                  
                                  <div className="pt-2 text-[11px] text-gray-400">
                                    IP Address: {log.ipAddress} • Audit ID: {log.id}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Nav />
    </div>
  );
}