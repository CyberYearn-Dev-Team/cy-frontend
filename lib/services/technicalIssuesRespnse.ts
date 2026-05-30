import { apiClient } from '../api/client';

export interface TechnicalIssue {
  id: string;
  userId: string;
  message: string;
  adminReply?: string;
  status: 'OPEN' | 'ANSWERED' | 'CLOSED';
  createdAt: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const sendMessageToAdmin = async (message: string): Promise<TechnicalIssue> => {
  try {
    const response = await apiClient.post<ApiResponse<TechnicalIssue>>('/technical-issues', { message });
    return response.data.data!;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getAnsweredMessages = async (): Promise<TechnicalIssue[]> => {
  try {
    const response = await apiClient.get<ApiResponse<TechnicalIssue[]>>('/technical-issues/answered');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const getUserMessages = async (): Promise<TechnicalIssue[]> => {
  try {
    const response = await apiClient.get<ApiResponse<TechnicalIssue[]>>('/technical-issues');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching user messages:', error);
    throw error;
  }
};
