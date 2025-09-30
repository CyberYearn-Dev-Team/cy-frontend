import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      slug: string;
      moduleSlug: string;
      lessonSlug: string;
      labSlug: string;
    };
  }
) {
  const { labSlug } = params;

  try {
    const base = process.env.DIRECTUS_URL || "http://localhost:8055";
    const encoded = encodeURIComponent(labSlug);

    // ✅ fetch from lab_guides not lessons
    const directusRes = await fetch(
      `${base}/items/lab_guides?filter[slug][_eq]=${encoded}&fields=*,quizzes.quizzes_id.*,quizzes.quizzes_id.questions.*`,
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
        { quizzes: null, error: "Failed to fetch from Directus" },
        { status: directusRes.status }
      );
    }

    const json = await directusRes.json();

    if (!json?.data || json.data.length === 0) {
      return NextResponse.json({ quizzes: [] }, { status: 404 });
    }

    const lab = json.data[0];

    // ✅ flatten quizzes with their questions
    const flatQuizzes = (lab.quizzes || [])
      .map((q: any) => {
        if (!q?.quizzes_id) return null;
        return {
          ...q.quizzes_id,
          questions: (q.quizzes_id.questions || []).map((qq: any) => ({
            question_text: qq.question_text,
            options: qq.options,
            answer: qq.answer,
          })),
        };
      })
      .filter(Boolean);

    return NextResponse.json({ quizzes: flatQuizzes });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { quizzes: null, error: "Server error" },
      { status: 500 }
    );
  }
}
