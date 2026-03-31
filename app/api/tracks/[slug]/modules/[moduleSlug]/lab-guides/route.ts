import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; moduleSlug: string }> }
): Promise<NextResponse> {
  const { moduleSlug } = await context.params;

  try {
    const base = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";
    const encoded = encodeURIComponent(moduleSlug);

    const directusRes = await fetch(
      `${base}/items/modules?filter[slug][_eq]=${encoded}&filter[status][_eq]=published&fields=*,lab_guides.lab_guides_id.*`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!directusRes.ok) {
      return NextResponse.json(
        { lab_guides: null, error: "Failed to fetch from Directus" },
        { status: directusRes.status }
      );
    }

    const json = await directusRes.json();

    if (!json?.data || json.data.length === 0) {
      return NextResponse.json({ lab_guides: [] }, { status: 404 });
    }

    const module = json.data[0];

    // flatten lab guides and filter by status
    const flatLabGuides = (module.lab_guides || [])
      .map((lg: any) => lg.lab_guides_id)
      .filter((lg: any) => lg !== null && lg.status === 'published');

    return NextResponse.json({
      lab_guides: flatLabGuides,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { lab_guides: null, error: "Server error" },
      { status: 500 }
    );
  }
}
