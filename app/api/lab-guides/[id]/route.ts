import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const url = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";
    const token = process.env.DIRECTUS_TOKEN;

    const baseHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    const headers: HeadersInit = { ...baseHeaders };

    if (token && token.trim() !== "" && token !== "undefined") {
      headers["Authorization"] = `Bearer ${token}`;
      console.log("Using Directus token for authenticated lab detail");
    } else {
      console.log("No token — using public access");
    }

    // ---- Fetch single lab with explicit video/pdf fields ----
    let res = await fetch(
      `${url}/items/lab_guides/${id}?fields=*,video.id,video.filename_disk,pdf.id,pdf.filename_disk,steps.text`,
      {
        cache: "no-store",
        next: { revalidate: 0 },
        headers,
      }
    );

    // ---- Retry without token if forbidden ----
    if ((!res.ok && [401, 403].includes(res.status)) && headers["Authorization"]) {
      console.warn(`Directus responded ${res.status}. Retrying without token...`);
      res = await fetch(
        `${url}/items/lab_guides/${id}?fields=*,video.id,video.filename_disk,pdf.id,pdf.filename_disk,steps.text`,
        {
          cache: "no-store",
          next: { revalidate: 0 },
          headers: baseHeaders,
        }
      );
    }

    const json = await res.json();

    if (!res.ok) {
      console.error("Directus error:", json);
      throw new Error(json?.errors?.[0]?.message || "Failed to fetch lab guide");
    }

    return NextResponse.json({ data: json.data });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error fetching lab detail:", message);
    return NextResponse.json({ data: null, error: message }, { status: 500 });
  }
}
