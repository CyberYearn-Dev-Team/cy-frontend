export interface OverviewData {
  totalRgistrations: number;
  usersThatHaveCompletedFirstLesson: number;
  weeklyActiveUsers: number;
  firstLessonCompletionRate: number;
  totalModules: number;
  completedModules: number;
  moduleConpletionRate: number;
}

export const getOverviewData = async (): Promise<OverviewData> => {
  const response = await fetch('https://cy-backend.onrender.com/api/v1/admin/overview', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch overview data');
  }

  const data = await response.json();
  return data.data;
};
