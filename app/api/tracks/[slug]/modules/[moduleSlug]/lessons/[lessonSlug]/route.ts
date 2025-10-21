import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ slug: string; moduleSlug: string; lessonSlug: string }>;
  }
): Promise<NextResponse> {
  const { lessonSlug } = await context.params;

  try {
    const base = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";
    const encoded = encodeURIComponent(lessonSlug);

    // Fetch lesson and its linked quizzes
    const directusRes = await fetch(
      `${base}/items/lessons?filter[slug][_eq]=${encoded}&fields=*,quizzes.quizzes_id.*`,
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

    // ✅ Flatten quizzes (just like modules in your working route)
    const flatQuizzes = (lesson.quizzes || [])
      .map((q: any) => q.quizzes_id)
      .filter((q: any) => q !== null);

    return NextResponse.json({
      lesson: {
        ...lesson,
        quizzes: flatQuizzes,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { lesson: null, error: "Server error" },
      { status: 500 }
    );
  }
}
