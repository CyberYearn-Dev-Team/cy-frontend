import { apiClient } from '../api/client';

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  updatedAt: string;
  createdAt: string;
  impact: string;
  stage: string;
}

export const getFeatureFlags = async (): Promise<FeatureFlag[]> => {
  try {
    const response = await apiClient.get('/admin/feature-flags');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    throw error;
  }
};



// Toggle feature flag status
export const toggleFeatureFlag = async (id: string, enabled: boolean): Promise<void> => {
  try {
    const response = await apiClient.patch(`/admin/feature-flags?id=${id}`, {
      enabled: !enabled
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling feature flag:', error);
    throw error;
  }
};




// Create feature flag
export interface CreateFeatureFlagDTO {
  name: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  stage: 'experimental' | 'beta';
}

export const createFeatureFlag = async (data: CreateFeatureFlagDTO): Promise<FeatureFlag> => {
  try {
    const response = await apiClient.post('/admin/feature-flags', data);
    return response.data.data;
  } catch (error) {
    console.error('Error creating feature flag:', error);
    throw error;
  }
};