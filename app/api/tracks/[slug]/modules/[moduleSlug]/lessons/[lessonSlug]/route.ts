import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: { params: { slug: string; moduleSlug: string; lessonSlug: string } }
) {
  const { lessonSlug } = params;

  try {
    const base = process.env.DIRECTUS_URL || "http://localhost:8055";
    const encoded = encodeURIComponent(lessonSlug);

    // ✅ only fetch lesson + its linked lab_guides
    const directusRes = await fetch(
      `${base}/items/lessons?filter[slug][_eq]=${encoded}&fields=*,lab_guides.lab_guides_id.*`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DIRECTUS_TOKEN ?? ""}`,
        },
        cache: "no-store",
      }
    );

    if (!directusRes.ok) {
      return NextResponse.json(
        { lesson: null, error: "Failed to fetch from Directus" },
        { status: directusRes.status }
      );
    }

    const json = await directusRes.json();

    if (!json?.data || json.data.length === 0) {
      return NextResponse.json({ lesson: null }, { status: 404 });
    }

    const lesson = json.data[0];

    // ✅ flatten lab_guides into labs array
    const flatLabs = (lesson.lab_guides || [])
      .map((l: any) => l.lab_guides_id)
      .filter((l: any) => l !== null);

    return NextResponse.json({
      lesson: {
        ...lesson,
        labs: flatLabs, // expose labs cleanly
      },
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { lesson: null, error: "Server error" },
      { status: 500 }
    );
  }
}
