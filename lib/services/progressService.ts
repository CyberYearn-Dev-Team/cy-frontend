import { apiClient } from '@/lib/api/client';

export async function startLesson(lessonId: string) {
  return apiClient.post('/me/progress', {
    lessonId,
    status: "IN_PROGRESS",
    timeSpentDelta: 0
  });
}

export async function trackTime(lessonId: string, delta: number) {
  return apiClient.post('/me/progress', {
    lessonId,
    status: "IN_PROGRESS",
    timeSpentDelta: delta
  });
}

export async function completeLesson(lessonId: string) {
  try {
    console.log("Request sent to backend:", lessonId);
    
    const { data } = await apiClient.post('/me/progress', {
      lessonId,
      status: "COMPLETED",
      timeSpentDelta: 300
    });

    console.log("Backend responded 200:", data);
    return data;
    return data;
  } catch (error) {
    console.error("FETCH ERROR:", error);
    throw error;
  }
}
