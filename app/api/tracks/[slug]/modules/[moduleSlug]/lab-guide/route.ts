import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; moduleSlug: string }> }
): Promise<NextResponse> {
  const { moduleSlug } = await context.params;
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
    
    // If no labGuideId is provided, get first lab guide for module
    if (!labGuideIdToFetch) {
      const moduleRes = await fetch(
        `${base}/items/modules?filter[slug][_eq]=${encodeURIComponent(moduleSlug)}&filter[status][_eq]=published&fields=lab_guides.lab_guides_id.id&filter[lab_guides][lab_guides_id][status][_eq]=published`,
        { 
          cache: "no-store",
          headers
        }
      );
      
      if (!moduleRes.ok) {
        throw new Error('Failed to fetch module data');
      }
      
      const moduleData = await moduleRes.json();
      if (!moduleData.data?.length || !moduleData.data[0]?.lab_guides?.length) {
        return NextResponse.json({ lab: null }, { status: 404 });
      }
      
      labGuideIdToFetch = moduleData.data[0].lab_guides[0].lab_guides_id.id;
    }

    // Fetch lab guide with steps
    let res = await fetch(
      `${base}/items/lab_guides/${labGuideIdToFetch}?filter[status][_eq]=published&fields=*,steps.lab_guide_steps_id.id,steps.lab_guide_steps_id.title,steps.lab_guide_steps_id.text,steps.lab_guide_steps_id.status,video.id,video.filename_disk,pdf.id,pdf.filename_disk`,
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
        `${base}/items/lab_guides/${labGuideIdToFetch}?filter[status][_eq]=published&fields=*,steps.lab_guide_steps_id.id,steps.lab_guide_steps_id.title,steps.lab_guide_steps_id.text,steps.lab_guide_steps_id.status,video.id,video.filename_disk,pdf.id,pdf.filename_disk`,
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

    // Format response to match expected structure
    const lab = {
      ...data.data,
      video: data.data.video || null,
      pdf: data.data.pdf || null,
      steps: data.data.steps
        ?.filter((step: any) => step.lab_guide_steps_id?.status === "published")
        .map((step: any, index: number) => ({
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
