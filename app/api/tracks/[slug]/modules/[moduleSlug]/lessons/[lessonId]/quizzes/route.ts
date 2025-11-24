import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ slug: string; moduleSlug: string; lessonId: string }>;
  }
): Promise<NextResponse> {
  const { lessonId } = await context.params;

  try {
    const base = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const directusRes = await fetch(
      `${base}/items/lessons?filter[id][_eq]=${lessonId}&status=all&limit=-1&fields=*,quizzes.quizzes_id.*,quizzes.quizzes_id.questions.*`,
      { headers, cache: "no-store" }
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

    const lesson = json.data[0];

    const flatQuizzes = (lesson.quizzes || [])
      .map((q: any) => {
        const quiz = q.quizzes_id;
        if (!quiz) return null;

        let parsedOptions: string[] = [];
        try {
          parsedOptions = JSON.parse(quiz.options);
        } catch {
          parsedOptions = [];
        }

        return {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          passing_score: quiz.passing_score,
          questions: [
            {
              question_text: quiz.question_text,
              options: parsedOptions,
              answer: quiz.answer,
              hint: quiz.hint || quiz.explanation || quiz.tip || "",
            },
          ],
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
