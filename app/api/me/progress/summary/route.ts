import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get('trackId');
    
    // Fetch from external API
    const externalApiUrl = trackId 
      ? `https://cy-backend.onrender.com/api/v1/me/progress/summary?trackId=${trackId}`
      : 'https://cy-backend.onrender.com/api/v1/me/progress/summary';
    
    const response = await fetch(externalApiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch progress summary');
    }
    
    const data = await response.json();
    
    // Transform thumbnail URLs if trackProgress exists
    if (data.data && data.data.trackProgress && Array.isArray(data.data.trackProgress)) {
      data.data.trackProgress = data.data.trackProgress.map((item: any) => ({
        ...item,
        thumbnail: item.thumbnail ? `${process.env.DIRECTUS_URL}/assets/${item.thumbnail}` : null,
        track: item.track ? {
          ...item.track,
          thumbnail: item.track.thumbnail ? `${process.env.DIRECTUS_URL}/assets/${item.track.thumbnail}` : null
        } : null
      }));
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching progress summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress summary' },
      { status: 500 }
    );
  }
}
