import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string; moduleSlug: string } }
) {
  const { moduleSlug } = params;

  try {
    const base = process.env.DIRECTUS_URL || "http://localhost:8055";
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

    // Flatten lessons
    const flatLessons = (module.lessons || [])
      .map((l: any) => l.lessons_id)
      .filter((l: any) => l !== null);

    return NextResponse.json({
      module: {
        ...module,
        lessons: flatLessons,
      },
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { module: null, error: "Server error" },
      { status: 500 }
    );
  }
}
