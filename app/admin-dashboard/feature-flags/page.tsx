"use client";

import React, { useState, useEffect } from "react";
import {
  Info,
  Search,
  Filter,
  Loader2
} from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";
import AdminHeader from "@/components/admin-header";
import Nav from "@/components/admin-nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFeatureFlags, toggleFeatureFlag, createFeatureFlag, FeatureFlag as APIFeatureFlag, CreateFeatureFlagDTO } from "@/lib/services/featureFlagService";
import { toast } from 'sonner';
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateFeatureFlagDialog } from "@/components/ui/CreateFeatureFlagDialog";

// 🎨 Theme Colors
const primary = "#72a210";
const secondary = "#507800";
const hover = "#5a850d";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLight = "text-gray-500 dark:text-gray-300";

interface FeatureFlag extends APIFeatureFlag {
  category: "core" | "experimental" | "beta";
  impactLevel: "low" | "medium" | "high";
  lastModified: string;
  modifiedBy: string;
}

const FeatureFlagsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const fetchFlagsData = async () => {
    try {
      setIsLoading(true);
      const data = await getFeatureFlags();
      // Map API response to our local interface
      const mappedFlags = data.map(flag => ({
        ...flag,
        category: flag.stage as "core" | "experimental" | "beta",
        impactLevel: flag.impact as "low" | "medium" | "high",
        lastModified: new Date(flag.updatedAt).toLocaleString(),
        modifiedBy: 'System',
      }));
      setFlags(mappedFlags);
    } catch (err) {
      console.error('Failed to fetch feature flags:', err);
      setError('Failed to load feature flags. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlagsData();
  }, []);

  const handleCreateSuccess = () => {
    fetchFlagsData(); // Refresh the list after creating a new flag
  };

  const handleToggle = async (flagId: string, currentState: boolean) => {
    try {
      // Optimistic update
      const newState = !currentState;
      setFlags(prev =>
        prev.map(flag =>
          flag.id === flagId ? { ...flag, enabled: newState } : flag
        )
      );
      
      // API call
      await toggleFeatureFlag(flagId, currentState);
      
      // Show success toast
      toast.success(`Feature flag ${newState ? 'enabled' : 'disabled'} successfully`);
    } catch (err) {
      console.error('Failed to toggle feature flag:', err);
      // Revert on error
      setFlags(prev =>
        prev.map(flag =>
          flag.id === flagId ? { ...flag, enabled: currentState } : flag
        )
      );
      // Show error toast
      toast.error(err instanceof Error ? err.message : 'Failed to toggle feature flag');
    }
  };

  const filteredFlags = flags.filter((flag) => {
    const matchesSearch =
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || flag.stage === selectedCategory;
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
                  disabled={isLoading}
                />
              </div>

              {/* Category Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={isLoading}>
                  <button
                    className={`flex items-center justify-between w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 ${bgCard} ${textDark} hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
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

                {/* the creat feature popout  */}
              <CreateFeatureFlagDialog onSuccess={handleCreateSuccess} />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                <span className="font-medium">Error:</span> {error}
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-[#72a210]" />
                <span className="ml-2">Loading feature flags...</span>
              </div>
            ) : (
              /* Feature Flags List */
              <div className="space-y-4">
                {filteredFlags.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchQuery || selectedCategory !== "all"
                        ? "No feature flags match your filters."
                        : "No feature flags found."}
                    </p>
                  </div>
                ) : (
                  filteredFlags.map((flag) => (
                    <div
                      key={flag.id}
                      className={`p-6 rounded-xl ${bgCard} border border-gray-200 dark:border-gray-800`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className={`text-lg font-semibold ${textDark}`}>
                              {flag.name}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                                flag.stage
                              )}`}
                            >
                              {flag.stage.charAt(0).toUpperCase() +
                                flag.stage.slice(1)}
                            </span>
                          </div>
                          <p className={`mt-1 ${textMedium}`}>
                            {flag.description}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-4">
                            <div className="flex items-center">
                              <span
                                className={`text-xs font-medium ${getImpactColor(
                                  flag.impact
                                )}`}
                              >
                                Impact: {flag.impact}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Updated: {new Date(flag.updatedAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4 flex items-center">
                          <button
                            onClick={() => handleToggle(flag.id, flag.enabled)}
                            disabled={isLoading}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[${primary}] focus:ring-offset-2 ${
                              flag.enabled ? "bg-[#72a210]" : "bg-gray-200 dark:bg-gray-700"
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            role="switch"
                            aria-checked={flag.enabled}
                            aria-labelledby={`${flag.id}-status`}
                          >
                            <span className="sr-only">Toggle {flag.name} feature</span>
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                flag.enabled ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}


          </div>

          {/* Info Banner */}
          <div className="mt-12">
            <div className={`border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950 rounded-lg p-4 flex items-start gap-3`}>
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
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
