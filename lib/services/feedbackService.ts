import { apiClient } from '../api/client';

/**
 * Submit feedback/review (Learner)
 * POST /api/v1/feedback
 */
export const submitFeedback = async (payload: {
  starRating: number;
  subject: string;
  message: string;
  anonymous: boolean;
}) => {
  try {
    const response = await apiClient.post('/feedback', payload);
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

/**
 * Get all feedbacks (Admin only)
 * GET /api/v1/admin/feedback
 */
export const getAllFeedbacks = async (params?: {
  page?: number;
  limit?: number;
  star?: number;
}) => {
  try {
    const response = await apiClient.get('/admin/feedback', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    throw error;
  }
};
