import { NextResponse } from "next/server";
import { fetchLabGuides } from "@/lib/directus";

export async function GET() {
  try {
    const labs = await fetchLabGuides();
    return NextResponse.json({ data: labs });
  } catch (error) {
    console.error("Error fetching lab guides:", error);
    return NextResponse.json({ error: "Failed to fetch lab guides" }, { status: 500 });
  }
}
