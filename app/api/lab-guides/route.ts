import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";
    const token = process.env.DIRECTUS_TOKEN;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && token.trim() !== "" && token !== "undefined"
        ? { Authorization: `Bearer ${token}` }
        : {}),
    };

    // First try with authentication if token is available
    let res = await fetch(
      `${url}/items/lab_guides?filter[status][_eq]=published&fields=id,title,description,levels,steps.lab_guide_steps_id.status`,
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
        `${url}/items/lab_guides?filter[status][_eq]=published&fields=id,title,description,levels,steps.lab_guide_steps_id.status`,
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
        { data: [], error: `Failed to fetch lab guides: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Count only published steps
    const labs = data.data?.map((lab: any) => {
      const publishedStepsCount = lab.steps?.filter(
        (step: any) => step.lab_guide_steps_id?.status === 'published'
      ).length || 0;
      
      return {
        ...lab,
        steps: [], // Empty for now, steps will be fetched individually
        published_steps_count: publishedStepsCount
      };
    }) || [];

    console.log("✅ Successfully fetched lab guides:", labs);

    return NextResponse.json({ data: labs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in /api/lab-guides:", message);
    return NextResponse.json(
      { data: [], error: `Internal server error: ${message}` },
      { status: 500 }
    );
  }
}
