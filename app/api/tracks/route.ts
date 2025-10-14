import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // ensures this runs at runtime

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";
    const token = process.env.DIRECTUS_TOKEN;

    // Base headers
    const baseHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add token if it exists
    const headers: HeadersInit = { ...baseHeaders };
    if (token && token.trim() !== "" && token !== "undefined") {
      headers["Authorization"] = `Bearer ${token}`;
      console.log("Using Directus token for authenticated request");
    } else {
      console.log("No valid Directus token found — using public access");
    }

    // --- Try fetching tracks ---
    let res = await fetch(`${url}/items/tracks`, {
      cache: "no-store",
      next: { revalidate: 0 },
      headers,
    });

    // --- Retry without token if first attempt fails ---
    if ((!res.ok && [401, 403].includes(res.status)) && headers["Authorization"]) {
      console.warn(`Directus responded ${res.status}. Retrying without token...`);
      res = await fetch(`${url}/items/tracks`, {
        cache: "no-store",
        next: { revalidate: 0 },
        headers: baseHeaders,
      });
    }

    // --- Handle errors ---
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Directus API Error: ${res.status} ${res.statusText}`);
      console.error("Error response:", errorText);
      throw new Error(`Failed to fetch tracks: ${res.status} ${res.statusText}`);
    }

    // --- Parse and return data ---
    const data = await res.json();
    console.log("✅ Successfully fetched tracks:", data);

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in /api/tracks:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
