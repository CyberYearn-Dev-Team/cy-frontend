import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ In Next.js 15+, params must be awaited
    const { id } = await context.params;

    const res = await fetch(
      `${process.env.DIRECTUS_URL}/items/lab_guides/${id}?fields=*,steps.text`,
      {
        headers: {
          Authorization: `Bearer ${process.env.DIRECTUS_TOKEN || ""}`,
        },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.errors?.[0]?.message || "Failed to load lab");
    }

    return NextResponse.json({ data: json.data });
  } catch (error) {
    console.error("Error fetching lab detail:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ data: null, error: message }, { status: 500 });
  }
}
