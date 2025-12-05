const API_BASE_URL = 'https://cy-backend.onrender.com/api/v1/technical-issues';

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

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Something went wrong');
  }
  return response.json();
};

export const sendMessageToAdmin = async (message: string): Promise<TechnicalIssue> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ message }),
    });

    const result = await handleResponse<ApiResponse<TechnicalIssue>>(response);
    return result.data!;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getAnsweredMessages = async (): Promise<TechnicalIssue[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/answered`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await handleResponse<ApiResponse<TechnicalIssue[]>>(response);
    return result.data || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};
