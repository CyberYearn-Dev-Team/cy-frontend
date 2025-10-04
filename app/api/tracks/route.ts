import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // ensures this runs on the server at runtime

export async function GET() {
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error in /api/tracks:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
