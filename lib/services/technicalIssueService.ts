export interface User {
  id: string;
  email: string;
  username: string;
  profileImage: string | null;
  firstName?: string;
  lastName?: string;
}

export interface TechnicalIssue {
  id: string;
  userId: string;
  message: string;
  adminReply: string | null;
  status: 'PENDING' | 'ANSWERED';
  createdAt: string;
  user: User;
}

export const getTechnicalIssues = async (): Promise<TechnicalIssue[]> => {
  try {
    const response = await fetch('https://cy-backend.onrender.com/api/v1/technical-issues', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch technical issues');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching technical issues:', error);
    throw error;
  }
};

export const updateTechnicalIssue = async (id: string, status: 'PENDING' | 'ANSWERED', adminReply: string): Promise<TechnicalIssue> => {
  try {
    const response = await fetch(`https://cy-backend.onrender.com/api/v1/technical-issues/${id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        adminReply
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update technical issue');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating technical issue:', error);
    throw error;
  }
};
