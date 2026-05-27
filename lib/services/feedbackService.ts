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
 * Get community reviews (Public)
 * GET /api/v1/feedback
 */
export const getCommunityReviews = async (params?: {
  page?: number;
  limit?: number;
  star?: number;
}) => {
  try {
    const response = await apiClient.get('/feedback', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching community reviews:', error);
    throw error;
  }
};

/**
 * Toggle helpful vote
 * POST /api/v1/feedback/:id/helpful
 */
export const toggleHelpful = async (feedbackId: string) => {
  try {
    const response = await apiClient.post(`/feedback/${feedbackId}/helpful`);
    return response.data;
  } catch (error) {
    console.error('Error toggling helpful:', error);
    throw error;
  }
};

/**
 * Report a review
 * POST /api/v1/feedback/:id/report
 */
export const reportReview = async (feedbackId: string, reason?: string) => {
  try {
    const response = await apiClient.post(`/feedback/${feedbackId}/report`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error reporting review:', error);
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
  status?: 'PENDING' | 'APPROVED' | 'HIDDEN';
}) => {
  try {
    const response = await apiClient.get('/admin/feedback', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    throw error;
  }
};

/**
 * Approve a review (Admin only)
 * PATCH /api/v1/admin/feedback/:id/approve
 */
export const approveReview = async (feedbackId: string) => {
  try {
    const response = await apiClient.patch(`/admin/feedback/${feedbackId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving review:', error);
    throw error;
  }
};

/**
 * Hide a review (Admin only)
 * PATCH /api/v1/admin/feedback/:id/hide
 */
export const hideReview = async (feedbackId: string) => {
  try {
    const response = await apiClient.patch(`/admin/feedback/${feedbackId}/hide`);
    return response.data;
  } catch (error) {
    console.error('Error hiding review:', error);
    throw error;
  }
};

/**
 * Update review status (Admin only)
 * PATCH /api/v1/admin/feedback/:id/status
 */
export const updateReviewStatus = async (feedbackId: string, status: 'PENDING' | 'APPROVED' | 'HIDDEN') => {
  try {
    const response = await apiClient.patch(`/admin/feedback/${feedbackId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating review status:', error);
    throw error;
  }
};

/**
 * Delete a review (Admin only)
 * DELETE /api/v1/admin/feedback/:id
 */
export const deleteReview = async (feedbackId: string) => {
  try {
    const response = await apiClient.delete(`/admin/feedback/${feedbackId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};
