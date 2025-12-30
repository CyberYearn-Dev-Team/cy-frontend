"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  fetchSecurityMetrics,
  fetchSecurityAlerts,
  initiateGlobalLogout,
  SecurityAlert as APISecurityAlert,
} from "@/lib/services/securityService";

import Nav from "@/components/admin-nav";
import AdminSidebar from "@/components/admin-sidebar";
import AdminHeader from "@/components/admin-header";
import { SecuritySkeleton } from "@/components/ui/security-skeleton";

import {
  AlertTriangle,
  Activity,
  Users,
  Ban,
  Eye,
  Clock,
  TrendingUp,
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

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

type SeverityFilter = "all" | "low" | "medium" | "high" | "critical";

const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";

const SecurityPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(
    null
  );
  const [filterSeverity, setFilterSeverity] = useState<SeverityFilter>("all");

  const [metrics, setMetrics] = useState({
    criticalAlerts: 0,
    activeSessions: 0,
    blockedIps: 0,
    rateLimits: 0,
  });

  const [apiAlerts, setApiAlerts] = useState<APISecurityAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [metricsData, alertsData] = await Promise.all([
          fetchSecurityMetrics(),
          fetchSecurityAlerts(),
        ]);

        setMetrics(metricsData);
        setApiAlerts(alertsData);
      } catch (error) {
        console.error("Error loading security data:", error);
        toast.error("Failed to load security data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);


  const getAlertType = (alert: APISecurityAlert): SecurityAlert["type"] => {
    if (alert.description.toLowerCase().includes("login"))
      return "suspicious-login";
    if (alert.severity === "CRITICAL") return "security-incident";
    if (alert.severity === "MEDIUM") return "unauthorized-access";
    return "rate-limit";
  };

  const alerts: SecurityAlert[] = apiAlerts.map((alert) => ({
    id: alert.timestamp,
    type: getAlertType(alert),
    severity: alert.severity.toLowerCase() as SecurityAlert["severity"],
    message: alert.description,
    timestamp: alert.timestamp,
    source: alert.source,
    details: alert.description,
  }));

  const filteredAlerts =
    filterSeverity === "all"
      ? alerts
      : alerts.filter((a) => a.severity === filterSeverity);

  const handleGlobalLogout = async () => {
    try {
      await initiateGlobalLogout();
      toast.success("All users have been successfully logged out.");
    } catch (err) {
      console.error("Global logout failed:", err);
      toast.error("Failed to log out all users. Please try again.");
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50 dark:bg-red-900/50";
      case "high":
        return "text-orange-600 bg-orange-50 dark:bg-orange-900/50";
      case "medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/50";
      case "low":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/50";
      default:
        return "";
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-30">
          {isLoading ? (
            <SecuritySkeleton />
          ) : (
            <div className="max-w-7xl mx-auto space-y-6">
              <h1 className="text-3xl font-bold">Security Controls</h1>

            {/* METRICS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat
                label="Critical Alerts"
                value={metrics.criticalAlerts}
                Icon={AlertTriangle}
              />
              <Stat
                label="Active Sessions"
                value={metrics.activeSessions}
                Icon={Activity}
              />
              <Stat label="Blocked IPs" value={metrics.blockedIps} Icon={Ban} />
              <Stat
                label="Rate Limits"
                value={metrics.rateLimits}
                Icon={TrendingUp}
              />
            </div>

            {/* GLOBAL LOGOUT */}
            <div className={`${bgCard} p-6 rounded-lg border`}>
              <h3 className="font-semibold mb-2">Force Global Logout</h3>
              <p className="text-sm mb-4">
                End all active sessions immediately.
              </p>
              <Button
                className="cursor-pointer"
                variant="destructive"
                onClick={() => setShowLogoutConfirm(true)}
              >
                Initiate Global Logout
              </Button>
            </div>

            {/* ALERTS */}
            <div className={`${bgCard} rounded-lg border`}>
              <div className="p-4 flex justify-between items-center">
                <h2 className="font-semibold">Security Alerts</h2>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {filterSeverity.toUpperCase()}
                      <ChevronDown className="ml-2 w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["all", "critical", "high", "medium", "low"].map((s) => (
                      <DropdownMenuItem
                        key={s}
                        onClick={() => setFilterSeverity(s as SeverityFilter)}
                      >
                        {s.toUpperCase()}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="divide-y">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span
                      className={`text-xs px-2 py-1 rounded ${getSeverityColor(
                        alert.severity
                      )}`}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                    <p className="mt-2 font-medium">{alert.message}</p>
                    <div className="text-xs text-gray-500 mt-1 flex gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                      <span>{alert.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}
        </main>
      </div>

      <Nav />

      {/* LOGOUT CONFIRM */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
  <div
    className={`${bgCard} p-6 rounded-lg max-w-md w-full sm:w-auto`}
  >
    <h3 className="font-semibold mb-2">Confirm Global Logout</h3>

    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
      This action will immediately log out <strong>all users</strong> across the
      platform, including administrators. Active sessions will be terminated
      and users will be required to sign in again. This action cannot be undone.
    </p>

    <div className="flex gap-3">
      <Button
      className="cursor-pointer"
        variant="outline"
        onClick={() => setShowLogoutConfirm(false)}
      >
        Cancel
      </Button>

      <Button
      className="cursor-pointer"
       variant="destructive"
        onClick={handleGlobalLogout}>
        Confirm
      </Button>
    </div>
  </div>
</div>

      )}
    </div>
  );
};

const Stat = ({
  label,
  value,
  Icon,
}: {
  label: string;
  value: number;
  Icon: React.ElementType;
}) => (
  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">{label}</span>
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <div className="text-2xl font-bold mt-2">{value}</div>
  </div>
);

// Export the main component
export default SecurityPage;
