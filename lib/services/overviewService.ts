export interface OverviewData {
  totalRgistrations: number;
  usersThatHaveCompletedFirstLesson: number;
  weeklyActiveUsers: number;
  firstLessonCompletionRate: number;
  totalModules: number;
  completedModules: number;
  moduleConpletionRate: number;
}

import { apiClient } from '@/lib/api/client';

export const getOverviewData = async (): Promise<OverviewData> => {
  const response = await apiClient.get('/admin/overview');
  return response.data.data;
};