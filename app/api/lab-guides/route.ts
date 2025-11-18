import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";
    const token = process.env.DIRECTUS_TOKEN;

    const baseHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    const headers: HeadersInit = { ...baseHeaders };

    if (token && token.trim() !== "" && token !== "undefined") {
      headers["Authorization"] = `Bearer ${token}`;
      console.log("Using Directus token for authenticated request");
    } else {
      console.log("No valid Directus token — using public access");
    }

    // --- Fetch labs ---
    let res = await fetch(
      `${url}/items/lab_guides?fields=*,steps.text`,
      {
        cache: "no-store",
        next: { revalidate: 0 },
        headers,
      }
    );

    // --- Retry without token if forbidden ---
    if ((!res.ok && [401, 403].includes(res.status)) && headers["Authorization"]) {
      console.warn(`Directus responded ${res.status}. Retrying without token...`);
      res = await fetch(
        `${url}/items/lab_guides?fields=*,steps.text`,
        {
          cache: "no-store",
          next: { revalidate: 0 },
          headers: baseHeaders,
        }
      );
    }

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Directus API Error: ${res.status}`);
      console.error(errorText);
      throw new Error(`Failed to fetch lab guides: ${res.status}`);
    }

    const data = await res.json();
    console.log("✅ Successfully fetched lab guides:", data);

    return NextResponse.json({ data: data.data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in /api/lab-guides:", message);
    return NextResponse.json({ data: [], error: message }, { status: 500 });
  }
}
