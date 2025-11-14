import { NextResponse } from "next/server";

const BACKEND_BASE = "https://cy-backend.onrender.com/api/v1";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const authHeader = req.headers.get("authorization");
    
    console.log("🔍 [auth/me] Headers received:", {
      cookie: cookie ? '***cookie present***' : 'no cookie',
      authorization: authHeader ? '***auth header present***' : 'no auth header'
    });

    const headers: HeadersInit = {
      'Cookie': cookie,
      'Content-Type': 'application/json',
    };

    // Add Authorization header if present
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const backendRes = await fetch(`${BACKEND_BASE}/me`, {
      method: "GET",
      headers,
      credentials: 'include',
    });

    const text = await backendRes.text();
    const contentType = backendRes.headers.get("content-type") || "application/json";

    // Debug logging
    console.log("🔍 [/me] Backend response status:", backendRes.status);
    console.log("🔍 [/me] Backend response text:", text);

    return new NextResponse(text, {
      status: backendRes.status,
      headers: { "content-type": contentType },
    });
  } catch (err) {
    return NextResponse.json({ message: "Proxy error: Get user failed" }, { status: 500 });
  }
}


