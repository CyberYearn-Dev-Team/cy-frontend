import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; moduleSlug: string; lessonId: string }> }
): Promise<NextResponse> {
  const { lessonId } = await context.params;

  try {
    const base = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";

    const directusRes = await fetch(
      `${base}/items/lessons?filter[id][_eq]=${lessonId}&filter[status][_eq]=published&fields=*,quizzes.quizzes_id.*,lab_guides.lab_guides_id.*`,
      {
        headers: { "Content-Type": "application/json" },
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

    // flatten quizzes
    const flatQuizzes = (lesson.quizzes || [])
      .map((q: any) => q.quizzes_id)
      .filter(Boolean);

    // flatten lab guides (correct field name)
    const flatLabGuides = (lesson.lab_guides || [])
      .map((lg: any) => lg.lab_guides_id)
      .filter(Boolean);

    return NextResponse.json({
      lesson: {
        ...lesson,
        quizzes: flatQuizzes,
        lab_guides: flatLabGuides,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ lesson: null, error: "Server error" }, { status: 500 });
  }
}
