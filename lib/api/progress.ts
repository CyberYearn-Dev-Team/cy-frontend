export const progressService = {
  getProgressSummary: async (trackId?: string) => {
    const params = trackId ? `?trackId=${trackId}` : '';
    // Use local API endpoint which proxies to external API and transforms URLs
    const token = typeof window !== 'undefined' ? localStorage.getItem('cy_token') : null;
    const response = await fetch(`/api/me/progress/summary${params}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch progress summary');
    }
    
    return response.json();
  },
};
