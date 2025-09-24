// /app/api/legal-pages/route.ts
import { NextResponse, type NextRequest } from "next/server";

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055"; // e.g., https://my-directus.com
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || process.env.DIRECTUS_STATIC_TOKEN || ""; // Optional: if you need auth

export async function GET(request: NextRequest) {
  try {
    // Build URL safely and encode query param
    const url = new URL(`${DIRECTUS_URL.replace(/\/$/, "")}/items/Legal_Pages`);
    const type = request.nextUrl.searchParams.get("type"); // ?type=terms

    // If a type is specified, filter by type
    if (type) {
      url.searchParams.append("filter[type][_eq]", encodeURIComponent(type));
    }

    // Build headers only when token is present
    const headers: Record<string, string> = {};
    if (DIRECTUS_TOKEN) headers.Authorization = `Bearer ${DIRECTUS_TOKEN}`;

    // Fetch from Directus (no-store so dev reflects latest)
    const res = await fetch(url.toString(), {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "<non-text response>");
      console.error(`Directus responded ${res.status} ${res.statusText}:`, body);
      return NextResponse.json({ error: "Directus error", details: body }, { status: res.status });
    }

    const data = await res.json();

    // Return JSON
    return NextResponse.json({ data: data?.data ?? [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error fetching legal pages:", message);
    return NextResponse.json({ error: "Failed to fetch legal pages", details: message }, { status: 500 });
  }
}
