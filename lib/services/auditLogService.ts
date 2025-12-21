import { apiClient } from "@/lib/api/client";

const API_BASE = "/admin/audit";

export interface AuditLog {
  id: string;
  actorUserId: string;
  actionTitle: string;
  actionDescription: string;
  entity: string;
  entityId: string | null;
  diffJson: any | null;
  createdAt: string;
  actor: {
    username: string;
    roles: string[];
  };
}

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  try {
    const response = await apiClient.get(API_BASE);
    return response.data?.data || [];
  } catch (error: any) {
    console.error("Error fetching audit logs:", error);
    throw error.response?.data || { message: "Failed to fetch audit logs" };
  }
};
