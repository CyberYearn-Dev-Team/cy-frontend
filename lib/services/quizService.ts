import { apiClient } from '../api/client';


interface ApiResponse {
  success: boolean;
  message?: string;
  xp?: number;
  [key: string]: any;
}

export async function getQuiz(lessonId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonId}/quiz`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch quiz');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getQuiz:', error);
    throw error;
  }
}


export async function submitQuiz(lessonId: string, score: number, passed: boolean): Promise<ApiResponse> {
  try {
    console.log('Submitting quiz for lesson:', lessonId, { score, passed });
    
    const response = await apiClient.post(`/lessons/${lessonId}/submit`, {
      score,
      passed,
    });

    return response.data;
  } catch (error: any) {
    console.error('Error in submitQuiz:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
      });
      throw new Error(error.response.data?.message || 'Failed to submit quiz');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      throw error;
    }
  }
}