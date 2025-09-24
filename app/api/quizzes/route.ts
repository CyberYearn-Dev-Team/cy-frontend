import { NextResponse } from "next/server";
import { fetchQuizzesByLesson } from "@/lib/directus";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get("lessonId");

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
  }

  try {
    const quizzes = await fetchQuizzesByLesson(lessonId);
    return NextResponse.json({ data: quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}
