/**
 * Service for handling lab guide related API calls
 */

const API_BASE_URL = 'https://cy-backend.onrender.com/api/v1/lab-guides';

interface LabGuideResponse {
  status: number;
  message: string;
  data: {
    userId: string;
    labId: string;
    completed: boolean;
  };
}

/**
 * Start a lab guide
 * @param labGuideId - The ID of the lab guide to start
 * @returns Promise with lab guide status
 */
export const startLabGuide = async (labGuideId: string): Promise<LabGuideResponse> => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cy_token') : null;

    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_BASE_URL}?lab_guide_id=${labGuideId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to start lab guide');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Failed to start lab guide:', error);
    throw new Error(error.message || 'Failed to start lab guide. Please try again.');
  }
};





/**
 * Complete a lab guide
 * @param labGuideId - The ID of the lab guide to mark as completed
 * @returns Promise with completion status
 */
export const completeLabGuide = async (labGuideId: string): Promise<LabGuideResponse> => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cy_token') : null;

    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_BASE_URL}?lab_guide_id=${labGuideId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to complete lab guide');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Failed to complete lab guide:', error);
    throw new Error(error.message || 'Failed to complete lab guide. Please try again.');
  }
};





/**
 * Get lab guide status
 * @param labGuideId - The ID of the lab guide to check
 * @returns Promise with lab guide status
 */
export const getLabGuideStatus = async (labGuideId: string): Promise<LabGuideResponse> => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cy_token') : null;

    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_BASE_URL}?lab_guide_id=${labGuideId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch lab guide status');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Failed to fetch lab guide status:', error);
    throw new Error(error.message || 'Failed to fetch lab guide status. Please try again.');
  }
};
