import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await context.params;

  try {
    const base = process.env.DIRECTUS_URL || "http://localhost:8055";
    const encoded = encodeURIComponent(slug);

    const directusRes = await fetch(
      `${base}/items/tracks?filter[slug][_eq]=${encoded}&fields=*,modules.modules_id.*`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!directusRes.ok) {
      return NextResponse.json(
        { track: null, error: "Failed to fetch from Directus" },
        { status: directusRes.status }
      );
    }

    const json = await directusRes.json();

    if (!json?.data || json.data.length === 0) {
      return NextResponse.json({ track: null }, { status: 404 });
    }

    const track = json.data[0];

    // Flatten modules (from { modules_id: {...} } to just {...}) and filter out nulls
    const flatModules = (track.modules || [])
      .map((m: any) => m.modules_id)
      .filter((m: any) => m !== null);

    return NextResponse.json({
      track: {
        ...track,
        modules: flatModules,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { track: null, error: "Server error" },
      { status: 500 }
    );
  }
}
