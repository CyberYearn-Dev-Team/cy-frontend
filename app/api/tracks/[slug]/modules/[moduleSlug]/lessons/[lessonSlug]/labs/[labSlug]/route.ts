import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { labSlug: string } }
) {
  try {
    const { labSlug } = params;
    const encodedSlug = encodeURIComponent(labSlug);

    const res = await fetch(
      `${process.env.DIRECTUS_URL}/items/lab_guides?filter[slug][_eq]=${encodedSlug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch lab" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ lab: data.data?.[0] || null });
  } catch (err) {
    console.error("Error fetching lab:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
