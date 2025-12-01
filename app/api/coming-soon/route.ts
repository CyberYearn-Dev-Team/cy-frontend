import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const directusUrl = process.env.DIRECTUS_URL;
    const response = await fetch(`${directusUrl}/items/coming_soon`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch coming soon content');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching coming soon content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coming soon content' },
      { status: 500 }
    );
  }
}
