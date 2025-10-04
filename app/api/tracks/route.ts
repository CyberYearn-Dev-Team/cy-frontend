import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // ensures this runs at runtime

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";

    const res = await fetch(`${url}/items/tracks?filter[published][_eq]=true`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in /api/tracks:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
