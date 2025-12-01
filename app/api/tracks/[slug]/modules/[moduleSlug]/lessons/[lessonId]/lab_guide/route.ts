import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await context.params;

  try {
    const base = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";

   const directusRes = await fetch(
  `${base}/items/lessons?filter[id][_eq]=${lessonId}&fields=lab_guides.lab_guides_id.*,lab_guides.lab_guides_id.video.id,lab_guides.lab_guides_id.pdf.id`,
  { cache: "no-store" }
);


    const json = await directusRes.json();
    const lesson = json.data?.[0];

    if (!lesson || !lesson.lab_guides?.length) {
      return NextResponse.json({ lab: null }, { status: 404 });
    }

    // extract linked lab guide (first one)
    const lab = lesson.lab_guides.map((lg: any) => lg.lab_guides_id)[0];

    return NextResponse.json({ lab });
  } catch (e) {
    console.error("Lab guide API error:", e);
    return NextResponse.json({ lab: null }, { status: 500 });
  }
}
