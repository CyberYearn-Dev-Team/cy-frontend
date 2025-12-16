// lib/services/leaderboardService.ts
import axios from 'axios';

const API_BASE_URL = 'https://cy-backend.onrender.com/api/v1';

const leaderboardApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
leaderboardApi.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cy_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface LeaderboardResponse {
  status: number;
  message: string;
  data: {
    topThree: Array<{
      id: string;
      username: string;
      totalXp: number;
      createdAt: string;
      profileImage: string | null;
      xpEvents: Array<{
        id: string;
        amount: number;
        reason: string;
        refType: string;
        refId: string;
        createdAt: string;
      }>;
    }>;
    allUsers: Array<{
      id: string;
      username: string;
      totalXp: number;
      createdAt: string;
      profileImage: string | null;
    }>;
  };
}

export const getLeaderboard = async (): Promise<LeaderboardResponse> => {
  try {
    const response = await leaderboardApi.get('/leaderboard');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Handle 401/403 errors
      if (error.response.status === 401 || error.response.status === 403) {
        // Clear invalid token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cy_token');
          window.location.href = '/auth/login';
        }
      }
      throw new Error(error.response.data?.message || 'Failed to fetch leaderboard');
    }
    throw new Error('Network error while fetching leaderboard');
  }
};