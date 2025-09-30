// app/api/lab-guides/route.ts
import { NextResponse } from "next/server";
import { fetchLabGuides } from "@/lib/directus";

export async function GET() {
  try {
    const labs = await fetchLabGuides();
    // normalize to { data: LabGuide[] } so client code has a stable shape
    return NextResponse.json({ data: labs });
  } catch (error) {
    console.error("Error fetching lab guides:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ data: [], error: message }, { status: 500 });
  }
}



