import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const directusUrl = process.env.DIRECTUS_URL;
    const response = await fetch(`${directusUrl}/items/coming_soon?filter[status][_eq]=published`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch coming soon content');
    }
    
    const data = await response.json();
    
    // Transform the data to include full thumbnail URLs
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map((item: any) => ({
        ...item,
        thumbnail: item.thumbnail ? `${directusUrl}/assets/${item.thumbnail}` : null
      }));
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching coming soon content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coming soon content' },
      { status: 500 }
    );
  }
}