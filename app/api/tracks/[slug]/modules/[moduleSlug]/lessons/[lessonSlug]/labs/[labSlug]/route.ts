import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ labSlug: string }> }
): Promise<NextResponse> {
  const { labSlug } = await context.params;

  try {
    const encodedSlug = encodeURIComponent(labSlug);
    const base = process.env.DIRECTUS_URL || "http://localhost:8055";

    const res = await fetch(
      `${base}/items/lab_guides?filter[slug][_eq]=${encodedSlug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.DIRECTUS_TOKEN ?? ""}`,
        },
        cache: "no-store",
      }
    );

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
