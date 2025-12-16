import { apiClient } from '../api/client';

export const updateUserProfile = async (userData: any) => {
  try {
    const response = await apiClient.post('/me/update', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const updateUserProfileImage = async (avatar: string) => {
  return updateUserProfile({ avatar });
};
