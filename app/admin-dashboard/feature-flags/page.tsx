"use client";

import React, { useState } from "react";
import {
  Flag,
  Info,
  History,
  Search,
  Filter,
  X, // Added for closing audit log
} from "lucide-react";
import AdminSidebar from "@/components/ui/admin-sidebar";
import AdminHeader from "@/components/ui/admin-header";

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: "core" | "experimental" | "beta";
  impactLevel: "low" | "medium" | "high";
  lastModified: string;
  modifiedBy: string;
}

interface AuditLog {
  id: string;
  flagName: string;
  action: "enabled" | "disabled";
  timestamp: string;
  user: string;
  previousValue: boolean;
  newValue: boolean;
}

const FeatureFlagsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [flags, setFlags] = useState<FeatureFlag[]>([
    {
      id: "leaderboard",
      name: "Leaderboard",
      description:
        "Enable the public leaderboard feature showing top performers across the platform",
      enabled: false,
      category: "experimental",
      impactLevel: "medium",
      lastModified: "2025-09-28 14:23",
      modifiedBy: "admin@example.com",
    },
    {
      id: "advanced_analytics",
      name: "Advanced Analytics",
      description:
        "Unlock detailed analytics dashboard with custom reports and data export",
      enabled: true,
      category: "beta",
      impactLevel: "low",
      lastModified: "2025-09-27 10:15",
      modifiedBy: "admin@example.com",
    },
    {
      id: "ai_suggestions",
      name: "AI-Powered Suggestions",
      description:
        "Enable AI-driven content recommendations and personalized suggestions",
      enabled: false,
      category: "experimental",
      impactLevel: "high",
      lastModified: "2025-09-26 16:45",
      modifiedBy: "admin@example.com",
    },
    {
      id: "real_time_collab",
      name: "Real-time Collaboration",
      description:
        "Allow multiple users to collaborate on documents in real-time",
      enabled: true,
      category: "beta",
      impactLevel: "high",
      lastModified: "2025-09-25 09:30",
      modifiedBy: "admin@example.com",
    },
    {
      id: "dark_mode",
      name: "Dark Mode",
      description:
        "System-wide dark theme with automatic switching based on user preference",
      enabled: true,
      category: "core",
      impactLevel: "low",
      lastModified: "2025-09-24 11:20",
      modifiedBy: "admin@example.com",
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "1",
      flagName: "Advanced Analytics",
      action: "enabled",
      timestamp: "2025-09-27 10:15:32",
      user: "admin@example.com",
      previousValue: false,
      newValue: true,
    },
    {
      id: "2",
      flagName: "Leaderboard",
      action: "disabled",
      timestamp: "2025-09-28 14:23:18",
      user: "admin@example.com",
      previousValue: true,
      newValue: false,
    },
    {
        id: "3",
        flagName: "Dark Mode",
        action: "enabled",
        timestamp: "2025-09-24 11:20:00",
        user: "admin@example.com",
        previousValue: false,
        newValue: true,
      },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAuditLog, setShowAuditLog] = useState(false);

  const handleToggle = (flagId: string) => {
    const currentTime = new Date()
      .toISOString()
      .slice(0, 16)
      .replace("T", " ");

    setFlags((prevFlags) =>
      prevFlags.map((flag) => {
        if (flag.id === flagId) {
          const newLog: AuditLog = {
            id: Date.now().toString(),
            flagName: flag.name,
            action: !flag.enabled ? "enabled" : "disabled",
            timestamp:
              currentTime +
              ":" +
              new Date().getSeconds().toString().padStart(2, "0"),
            user: "admin@example.com",
            previousValue: flag.enabled,
            newValue: !flag.enabled,
          };

          setAuditLogs((prev) => [newLog, ...prev]);

          return {
            ...flag,
            enabled: !flag.enabled,
            lastModified: currentTime,
            modifiedBy: "admin@example.com",
          };
        }
        return flag;
      })
    );
  };

  const filteredFlags = flags.filter((flag) => {
    const matchesSearch =
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || flag.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "core":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "beta":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "experimental":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "low":
        return "text-green-600 dark:text-green-400";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "high":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getLogActionColor = (action: string) => {
    return action === "enabled" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Feature Flags
                  </h1>
                  {/* Button to toggle Audit Log */}
                  <button
                    onClick={() => setShowAuditLog(!showAuditLog)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                  >
                    <History className="w-4 h-4" />
                    {showAuditLog ? "Hide Audit Log" : "Show Audit Log"}
                  </button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Manage experimental features and beta functionality
              </p>
            </div>

            {/* Audit Log Panel */}
            {showAuditLog && (
              <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-600" /> Audit Log
                  </h2>
                  <button onClick={() => setShowAuditLog(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                      <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Flag</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {auditLogs.slice(0, 10).map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{log.timestamp}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{log.flagName}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getLogActionColor(log.action)}`}>
                            {log.action.toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{log.user}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {auditLogs.length > 10 && (
                    <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Showing last 10 logs.
                    </div>
                )}
              </div>
            )}


            {/* Search and Filter */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search feature flags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:dark:border-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:dark:border-indigo-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="core">Core</option>
                    <option value="beta">Beta</option>
                    <option value="experimental">Experimental</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Feature Flags List */}
            <div className="space-y-4 mb-8">
              {filteredFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {flag.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                            flag.category
                          )}`}
                        >
                          {flag.category}
                        </span>
                        <span
                          className={`text-xs font-medium ${getImpactColor(
                            flag.impactLevel
                          )}`}
                        >
                          {flag.impactLevel.toUpperCase()} IMPACT
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{flag.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Last modified: {flag.lastModified}</span>
                        <span>•</span>
                        <span>by {flag.modifiedBy}</span>
                      </div>
                    </div>
                    {/* Toggle Switch */}
                    <button
                      onClick={() => handleToggle(flag.id)}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        flag.enabled ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                        <span className="sr-only">Toggle {flag.name}</span>
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          flag.enabled ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>


            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-700 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900 dark:text-blue-200">
                <p className="font-medium mb-1">About Feature Flags</p>
                <p>
                  Feature flags allow you to safely test new features in
                  production. All changes are automatically logged and can be
                  reviewed in the audit log. Experimental features may have
                  stability issues and should be monitored closely.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeatureFlagsPage;