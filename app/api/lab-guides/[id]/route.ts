import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";
    const token = process.env.DIRECTUS_TOKEN;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && token.trim() !== "" && token !== "undefined" ? { "Authorization": `Bearer ${token}` } : {})
    };

    // First try with authentication if token is available
    let res = await fetch(
      `${url}/items/lab_guides/${id}?filter[status][_eq]=published&filter[steps][lab_guide_steps_id][status][_eq]=published&fields=*,steps.lab_guide_steps_id.id,steps.lab_guide_steps_id.title,steps.lab_guide_steps_id.text,video.id,video.filename_disk,pdf.id,pdf.filename_disk`,
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
        `${url}/items/lab_guides/${id}?filter[status][_eq]=published&filter[steps][lab_guide_steps_id][status][_eq]=published&fields=*,steps.lab_guide_steps_id.id,steps.lab_guide_steps_id.title,steps.lab_guide_steps_id.text,video.id,video.filename_disk,pdf.id,pdf.filename_disk`,
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
        { data: null, error: `Failed to fetch lab guide: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("✅ Successfully fetched lab guide:", data);

    return NextResponse.json({ data: data.data || null });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in /api/lab-guides/[id]:", message);
    return NextResponse.json(
      { data: null, error: `Internal server error: ${message}` },
      { status: 500 }
    );
  }
}