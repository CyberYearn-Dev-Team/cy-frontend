export interface User {
  id: string;
  email: string;
  username: string;
  profileImage: string | null;
  firstName?: string;
  lastName?: string;
}

export interface TechnicalIssue {
  id: string;
  userId: string;
  message: string;
  adminReply: string | null;
  status: 'PENDING' | 'ANSWERED';
  createdAt: string;
  user: User;
}

import { apiClient } from '../api/client';

export const getTechnicalIssues = async (): Promise<TechnicalIssue[]> => {
  try {
    const response = await apiClient.get('/technical-issues');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching technical issues:', error);
    throw error;
  }
};

export const updateTechnicalIssue = async (id: string, status: 'PENDING' | 'ANSWERED', adminReply: string): Promise<TechnicalIssue> => {
  try {
    const response = await apiClient.post(`/technical-issues/${id}`, {
      status,
      adminReply,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating technical issue:', error);
    throw error;
  }
};
