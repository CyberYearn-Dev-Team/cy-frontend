import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ slug: string; moduleSlug: string; lessonId: string }>;
  }
): Promise<NextResponse> {
  const { lessonId } = await context.params;

  try {
    const base =
      process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";

    const url = `${base}/items/lessons?filter[id][_eq]=${lessonId}
&filter[status][_eq]=published
&filter[quizzes][quizzes_id][status][_eq]=published
&filter[quizzes][quizzes_id][questions][questions_id][status][_eq]=published
&filter[quizzes][quizzes_id][questions][questions_id][status][_nnull]=true
&status=all
&limit=-1
&fields=*,quizzes.quizzes_id.*,quizzes.quizzes_id.questions.questions_id.*`;

    console.log("🔗 Directus URL:", url);

    const directusRes = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("📡 Directus Status:", directusRes.status);

    if (!directusRes.ok) {
      const errorText = await directusRes.text();
      console.error("Directus Error Response:", errorText);

      return NextResponse.json(
        { quizzes: null, error: "Failed to fetch from Directus" },
        { status: directusRes.status }
      );
    }

    const json = await directusRes.json();

    console.log("RAW Directus Data:", JSON.stringify(json, null, 2));

    if (!json?.data || json.data.length === 0) {
      console.warn("No lesson data found");
      return NextResponse.json({ quizzes: [] }, { status: 404 });
    }

    const lesson = json.data[0];

    console.log("Lesson:", lesson.id);
    console.log("Quizzes Count:", lesson.quizzes?.length || 0);

    const flatQuizzes = (lesson.quizzes || [])
      .map((q: any, quizIndex: number) => {
        const quiz = q.quizzes_id;

        if (!quiz) {
          console.warn(`Missing quiz at index ${quizIndex}`);
          return null;
        }

        console.log(`🧩 Quiz ${quizIndex}:`, quiz.title);
        console.log(
          `   ↳ Questions raw:`,
          JSON.stringify(quiz.questions, null, 2)
        );

        const questions = (quiz.questions || [])
          .map((qRel: any, qIndex: number) => {
            const question = qRel.questions_id;

            if (!question) {
              console.warn(
                `Missing question at quiz ${quizIndex}, index ${qIndex}`
              );
              return null;
            }

            // Additional client-side filter to ensure only published questions
            if (question.status !== 'published') {
              console.log(
                `   Skipping question ${qIndex} (status: ${question.status}):`,
                question.question_text
              );
              return null;
            }

            console.log(
              `   Question ${qIndex}:`,
              question.question_text
            );

            let parsedOptions: string[] = [];

            try {
              parsedOptions =
                typeof question.options === "string"
                  ? JSON.parse(question.options)
                  : question.options || [];
            } catch (err) {
              console.error(
                `Options parse failed for question ${qIndex}`,
                err
              );
              parsedOptions = [];
            }

            return {
              question_text: question.question_text,
              options: parsedOptions,
              answer: question.answer,
              hint:
                question.hint ||
                question.explanation ||
                question.tip ||
                "",
            };
          })
          .filter(Boolean);

        console.log(
          `   Final Questions Count:`,
          questions.length
        );

        return {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          passing_score: quiz.passing_score,
          questions,
        };
      })
      .filter(Boolean);

    console.log("FINAL OUTPUT:", JSON.stringify(flatQuizzes, null, 2));

    return NextResponse.json({ quizzes: flatQuizzes });
  } catch (err) {
    console.error("API ERROR:", err);

    return NextResponse.json(
      { quizzes: null, error: "Server error" },
      { status: 500 }
    );
  }
}