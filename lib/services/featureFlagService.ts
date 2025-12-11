const API_BASE_URL = 'https://cy-backend.onrender.com/api/v1';

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
    const response = await fetch(`${API_BASE_URL}/admin/feature-flags`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feature flags');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    throw error;
  }
};



// Toggle feature flag status
export const toggleFeatureFlag = async (id: string, enabled: boolean): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/feature-flags?id=${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        enabled: !enabled // Toggle the current state
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to toggle feature flag');
    }

    const data = await response.json();
    return data;
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
    const response = await fetch(`${API_BASE_URL}/admin/feature-flags`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create feature flag');
    }

    const responseData = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('Error creating feature flag:', error);
    throw error;
  }
};