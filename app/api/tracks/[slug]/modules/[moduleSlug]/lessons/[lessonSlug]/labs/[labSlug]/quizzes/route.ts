import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      slug: string;
      moduleSlug: string;
      lessonSlug: string;
      labSlug: string;
    }>;
  }
): Promise<NextResponse> {
  const { labSlug } = await context.params;

  try {
    const base = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";
    const token = process.env.DIRECTUS_TOKEN;
    const encoded = encodeURIComponent(labSlug);

    const baseHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };
    const headers: HeadersInit = { ...baseHeaders };
    const hasAuth = Boolean(token && token.trim() !== "" && token !== "undefined");
    if (hasAuth) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // ✅ Fetch from lab_guides (not lessons)
    let directusRes = await fetch(
      `${base}/items/lab_guides?filter[slug][_eq]=${encoded}&fields=*,quizzes.quizzes_id.*,quizzes.quizzes_id.questions.*`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!directusRes.ok && [401, 403].includes(directusRes.status) && hasAuth) {
      directusRes = await fetch(
        `${base}/items/lab_guides?filter[slug][_eq]=${encoded}&fields=*,quizzes.quizzes_id.*,quizzes.quizzes_id.questions.*`,
        {
          headers: baseHeaders,
          cache: "no-store",
        }
      );
    }

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

    // ✅ Flatten quizzes with their questions
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
