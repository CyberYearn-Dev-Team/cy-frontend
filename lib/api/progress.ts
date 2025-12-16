import { apiClient } from './client';

export const progressService = {
  getProgressSummary: async (trackId?: string) => {
    const params = trackId ? { trackId } : {};
    const response = await apiClient.get('/me/progress/summary', { params });
    return response.data;
  },
};
