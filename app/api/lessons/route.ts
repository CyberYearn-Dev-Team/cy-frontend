import { NextResponse } from "next/server";
import { fetchLessonsByModule } from "@/lib/directus";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId");

  if (!moduleId) {
    return NextResponse.json({ error: "moduleId is required" }, { status: 400 });
  }

  try {
    const lessons = await fetchLessonsByModule(moduleId);
    return NextResponse.json({ data: lessons });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 });
  }
}
