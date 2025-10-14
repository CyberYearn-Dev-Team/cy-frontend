import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ slug: string; moduleSlug: string; lessonSlug: string }>;
  }
): Promise<NextResponse> {
  const { lessonSlug } = await context.params;

  try {
    const base = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";
    const token = process.env.DIRECTUS_TOKEN;
    const encoded = encodeURIComponent(lessonSlug);

    // Build headers and only include Authorization if token is valid
    const baseHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };
    const headers: HeadersInit = { ...baseHeaders };
    const hasAuth = Boolean(token && token.trim() !== "" && token !== "undefined");
    if (hasAuth) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // ✅ only fetch lesson + its linked lab_guides
    let directusRes = await fetch(
      `${base}/items/lessons?filter[slug][_eq]=${encoded}&fields=*,lab_guides.lab_guides_id.*`,
      {
        headers,
        cache: "no-store",
      }
    );

    // Retry without token if unauthorized/forbidden
    if (!directusRes.ok && [401, 403].includes(directusRes.status) && hasAuth) {
      directusRes = await fetch(
        `${base}/items/lessons?filter[slug][_eq]=${encoded}&fields=*,lab_guides.lab_guides_id.*`,
        {
          headers: baseHeaders,
          cache: "no-store",
        }
      );
    }

    if (!directusRes.ok) {
      return NextResponse.json(
        { lesson: null, error: "Failed to fetch from Directus" },
        { status: directusRes.status }
      );
    }

    const json = await directusRes.json();

    if (!json?.data || json.data.length === 0) {
      return NextResponse.json({ lesson: null }, { status: 404 });
    }

    const lesson = json.data[0];

    // ✅ flatten lab_guides into labs array
    const flatLabs = (lesson.lab_guides || [])
      .map((l: any) => l.lab_guides_id)
      .filter((l: any) => l !== null);

    return NextResponse.json({
      lesson: {
        ...lesson,
        labs: flatLabs,
      },
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { lesson: null, error: "Server error" },
      { status: 500 }
    );
  }
}
