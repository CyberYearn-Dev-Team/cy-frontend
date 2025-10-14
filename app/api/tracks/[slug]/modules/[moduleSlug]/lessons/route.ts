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
      `${base}/items/modules?filter[slug][_eq]=${encoded}&fields=*,lessons.lessons_id.*`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!directusRes.ok) {
      return NextResponse.json(
        { module: null, error: "Failed to fetch from Directus" },
        { status: directusRes.status }
      );
    }

    const json = await directusRes.json();

    if (!json?.data || json.data.length === 0) {
      return NextResponse.json({ module: null }, { status: 404 });
    }

    const module = json.data[0];

    // Flatten lessons (from { lessons_id: {...} } to {...})
    const flatLessons = (module.lessons || [])
      .map((l: any) => l.lessons_id)
      .filter((l: any) => l !== null);

    return NextResponse.json({
      module: {
        ...module,
        lessons: flatLessons,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { module: null, error: "Server error" },
      { status: 500 }
    );
  }
}
