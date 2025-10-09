import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // ensures this runs at runtime

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";
    const token = process.env.DIRECTUS_TOKEN;

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authentication token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Try to fetch with authentication first, then without if it fails
    let res = await fetch(`${url}/items/tracks?filter[published][_eq]=true`, {
      cache: "no-store",
      next: { revalidate: 0 },
      headers,
    });

    // If authenticated request fails with 403, try without authentication
    if (!res.ok && res.status === 403 && token) {
      console.log('Authenticated request failed, trying without authentication...');
      res = await fetch(`${url}/items/tracks?filter[published][_eq]=true`, {
        cache: "no-store",
        next: { revalidate: 0 },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!res.ok) {
      console.error(`Directus API Error: ${res.status} ${res.statusText}`);
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch tracks: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Successfully fetched tracks:', data);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in /api/tracks:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
