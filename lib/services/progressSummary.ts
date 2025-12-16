import { apiClient } from '@/lib/api/client';

export async function getProgressSummary(trackId?: string | number) {
  try {
    const params = trackId !== undefined ? { trackId } : {};
    const response = await apiClient.get('/me/progress/summary', { params });
    return response.data?.data?.trackProgress || [];
  } catch (error) {
    console.error('Error fetching progress summary:', error);
    throw new Error('Failed to fetch progress summary');
  }
}
