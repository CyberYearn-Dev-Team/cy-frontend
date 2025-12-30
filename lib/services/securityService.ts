import { apiClient } from "@/lib/api/client";

export interface SecurityMetrics {
  criticalAlerts: number;
  activeSessions: number;
  blockedIps: number;
  rateLimits: number;
}

export interface SecurityAlert {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  createdAt: string;
  source: string;
  timestamp: string;
}



// ---- GET SECURITY METRICS ----
export const fetchSecurityMetrics = async (): Promise<SecurityMetrics> => {
  try {
    const res = await apiClient.get("/admin/security/metrics");
    return res.data?.data;
  } catch (error: any) {
    console.error("Error fetching security metrics:", error);
    throw error.response?.data || { message: "Failed to fetch security metrics" };
  }
};



// ---- GLOBAL LOGOUT ----
export const initiateGlobalLogout = async () => {
  try {
    const res = await apiClient.post("/admin/security/global-logout");
    return res.data;
  } catch (error: any) {
    console.error("Error initiating global logout:", error);
    throw error.response?.data || { message: "Failed to initiate global logout" };
  }
};




// ---- GET SECURITY ALERTS ----
export const fetchSecurityAlerts = async (): Promise<SecurityAlert[]> => {
  try {
    const res = await apiClient.get("/admin/security/alerts");
    return res.data?.data || [];
  } catch (error: any) {
    console.error("Error fetching security alerts:", error);
    throw error.response?.data || { message: "Failed to fetch security alerts" };
  }
};
