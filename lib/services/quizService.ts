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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonId}/submit`;
    console.log('Submitting quiz to:', url, { score, passed });
    
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include', // This sends cookies
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ 
        score, 
        passed,
        // Add any additional required fields here
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Quiz submission failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Quiz submission failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in submitQuiz:', error);
    throw error;
  }
}