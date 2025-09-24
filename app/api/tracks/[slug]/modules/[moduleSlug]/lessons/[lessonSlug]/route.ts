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

    const directusRes = await fetch(
      `${base}/items/Lessons?filter[slug][_eq]=${encoded}&fields=*,quizzes.Quizzes_id.*`,
      {
        headers: {
          "Content-Type": "application/json",
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

    // Flatten quizzes (so you get clean array of quiz objects)
    const flatQuizzes = (lesson.quizzes || [])
      .map((q: any) => q.Quizzes_id)
      .filter((q: any) => q !== null);

    return NextResponse.json({
      lesson: {
        ...lesson,
        quizzes: flatQuizzes,
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
