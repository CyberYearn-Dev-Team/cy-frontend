import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ labSlug: string }> }
): Promise<NextResponse> {
  const { labSlug } = await context.params;

  try {
    const encodedSlug = encodeURIComponent(labSlug);
    const base = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";
    const token = process.env.DIRECTUS_TOKEN;

    const baseHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };
    const headers: HeadersInit = { ...baseHeaders };
    const hasAuth = Boolean(token && token.trim() !== "" && token !== "undefined");
    if (hasAuth) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let res = await fetch(
      `${base}/items/lab_guides?filter[slug][_eq]=${encodedSlug}`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!res.ok && [401, 403].includes(res.status) && hasAuth) {
      res = await fetch(
        `${base}/items/lab_guides?filter[slug][_eq]=${encodedSlug}`,
        {
          headers: baseHeaders,
          cache: "no-store",
        }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch lab" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ lab: data.data?.[0] || null });
  } catch (err) {
    console.error("Error fetching lab:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
