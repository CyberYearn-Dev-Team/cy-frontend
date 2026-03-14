import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; moduleSlug: string; lessonId: string }> }
) {
  const { lessonId } = await context.params;
  const { searchParams } = new URL(request.url);
  const labGuideId = searchParams.get('labGuideId');

  try {
    const base = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";
    const token = process.env.DIRECTUS_TOKEN;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && token.trim() !== "" && token !== "undefined" ? { "Authorization": `Bearer ${token}` } : {})
    };

    let labGuideIdToFetch = labGuideId;
    
    // If no labGuideId is provided, get the first lab guide for the lesson
    if (!labGuideIdToFetch) {
      const lessonRes = await fetch(
        `${base}/items/lessons/${lessonId}?fields=lab_guides.lab_guides_id.id`,
        { 
          cache: "no-store",
          headers
        }
      );
      
      if (!lessonRes.ok) {
        throw new Error('Failed to fetch lesson data');
      }
      
      const lessonData = await lessonRes.json();
      if (!lessonData.data?.lab_guides?.length) {
        return NextResponse.json({ lab: null }, { status: 404 });
      }
      
      labGuideIdToFetch = lessonData.data.lab_guides[0].lab_guides_id.id;
    }

    // Fetch the lab guide with steps (ONLY PUBLISHED)
    let res = await fetch(
      `${base}/items/lab_guides/${labGuideIdToFetch}?filter[status][_eq]=published&fields=*,steps.lab_guide_steps_id.id,steps.lab_guide_steps_id.title,steps.lab_guide_steps_id.text,video.id,video.filename_disk,pdf.id,pdf.filename_disk`,
      {
        cache: "no-store",
        headers,
      }
    );

    // If unauthorized/forbidden and we were using a token, try without it
    if ((!res.ok && [401, 403].includes(res.status)) && headers["Authorization"]) {
      console.warn(`Directus responded ${res.status}. Retrying without token...`);
      delete headers.Authorization;
      res = await fetch(
        `${base}/items/lab_guides/${labGuideIdToFetch}?filter[status][_eq]=published&fields=*,steps.lab_guide_steps_id.id,steps.lab_guide_steps_id.title,steps.lab_guide_steps_id.text,video.id,video.filename_disk,pdf.id,pdf.filename_disk`,
        {
          cache: "no-store",
          headers,
        }
      );
    }

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Directus API Error: ${res.status} - ${errorText}`);
      return NextResponse.json(
        { lab: null, error: `Failed to fetch lab guide: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    if (!data.data) {
      return NextResponse.json({ lab: null }, { status: 404 });
    }

    // Format the response to match the expected structure
    const lab = {
      ...data.data,
      video: data.data.video || null,
      pdf: data.data.pdf || null,
      steps: data.data.steps?.map((step: any, index: number) => ({
        id: step.lab_guide_steps_id?.id || index,
        title: step.lab_guide_steps_id?.title || `Step ${index + 1}`,
        text: step.lab_guide_steps_id?.text || ''
      })) || []
    };

    return NextResponse.json({ lab });
  } catch (e) {
    console.error("Lab guide API error:", e);
    return NextResponse.json(
      { lab: null, error: e instanceof Error ? e.message : 'Internal server error' },
      { status: 500 }
    );
  }
}