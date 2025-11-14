"use client";

import React, { useState } from "react";
import {
  Info,
  Search,
  Filter,
} from "lucide-react";
import AdminSidebar from "@/components/ui/admin-sidebar";
import AdminHeader from "@/components/ui/admin-header";
import Nav from "@/components/ui/admin-nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 🎨 Theme Colors
const primary = "#72a210";
const secondary = "#507800";
const hover = "#5a850d";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLight = "text-gray-500 dark:text-gray-300";

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

const FeatureFlagsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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
      enabled: false,
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
      enabled: false,
      category: "beta",
      impactLevel: "high",
      lastModified: "2025-09-25 09:30",
      modifiedBy: "admin@example.com",
    },
  ]);

  const handleToggle = (flagId: string) => {
    setFlags((prev) =>
      prev.map((flag) =>
        flag.id === flagId ? { ...flag, enabled: !flag.enabled } : flag
      )
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
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "beta":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
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
        return textMedium;
    }
  };

  return (
    <div className={`flex h-screen ${bgLight}`}>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-30">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="mb-6 space-y-2">
              <h1 className={`text-3xl font-bold ${textDark}`}>
                Feature Flags
              </h1>
              <p className={`${textMedium}`}>
                Manage experimental and beta features across your platform.
              </p>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search feature flags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[${primary}]`}
                  style={{
                    outline: "none",
                    boxShadow: "none",
                  }}
                />
              </div>

              {/* Category Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex items-center justify-between w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 ${bgCard} ${textDark} hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
                  >
                    {selectedCategory === "all"
                      ? "All Categories"
                      : selectedCategory.charAt(0).toUpperCase() +
                        selectedCategory.slice(1)}
                    <Filter className="ml-2 w-4 h-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {["all", "beta", "experimental"].map((cat) => (
                    <DropdownMenuItem
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat === "all"
                        ? "All Categories"
                        : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>



            {/* Flags List */}
            <div className="space-y-4">
              {filteredFlags.map((flag) => (
                <div
                  key={flag.id}
                  className={`${bgCard} rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className={`text-lg font-semibold ${textDark}`}>
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
                      <p className={`${textMedium} mb-3`}>
                        {flag.description}
                      </p>
                      <div className={`text-sm ${textLight}`}>
                        Last modified: {flag.lastModified} • {flag.modifiedBy}
                      </div>
                    </div>

                    {/* Toggle */}
                    <button
                      onClick={() => handleToggle(flag.id)}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors cursor-pointer ${
                        flag.enabled
                          ? "bg-[#72a210]"
                          : "bg-gray-300 dark:bg-gray-600"
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
<div
  className={`border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950 rounded-lg p-4 flex items-start gap-3`}
>
  <Info
    className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0"
  />
  <div className="text-sm">
    <p className="font-medium mb-1 text-[#b45309] dark:text-[#fbbf24]">
      About Feature Flags
    </p>
    <p className={`${textMedium}`}>
      Feature flags allow you to safely test new features in
      production. All changes are logged for auditability.
    </p>
  </div>
</div>

          </div>
        </main>

        {/* Mobile Nav */}
        <Nav />
      </div>
    </div>
  );
};

export default FeatureFlagsPage;
