import { NextResponse } from "next/server";
import { fetchModulesByTrack } from "@/lib/directus";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const trackId = searchParams.get("trackId");

  if (!trackId) {
    return NextResponse.json({ error: "trackId is required" }, { status: 400 });
  }

  try {
    const modules = await fetchModulesByTrack(trackId);
    return NextResponse.json({ data: modules });
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json({ error: "Failed to fetch modules" }, { status: 500 });
  }
}
