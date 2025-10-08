import { NextResponse } from "next/server";

const BACKEND_BASE = "https://cy-backend.onrender.com/api/v1";

export async function GET(req: Request) {
  try {
    const cookie = (req.headers.get("cookie") || "");

    const backendRes = await fetch(`${BACKEND_BASE}/auth/me`, {
      method: "GET",
      headers: { cookie },
      credentials: "include",
    });

    const text = await backendRes.text();
    const contentType = backendRes.headers.get("content-type") || "application/json";

    // Debug logging
    console.log("🔍 [auth/me] Backend response status:", backendRes.status);
    console.log("🔍 [auth/me] Backend response text:", text);

    return new NextResponse(text, {
      status: backendRes.status,
      headers: { "content-type": contentType },
    });
  } catch (err) {
    return NextResponse.json({ message: "Proxy error: Get user failed" }, { status: 500 });
  }
}


