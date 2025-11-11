import { NextResponse } from "next/server";

const BACKEND_BASE = "https://cy-backend.onrender.com/api/v1";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookie = req.headers.get("cookie") || "";

    const backendRes = await fetch(`${BACKEND_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const contentType = backendRes.headers.get("content-type") || "application/json";
    let responseData;
    
    try {
      responseData = await backendRes.text();
      // Try to parse as JSON, but fallback to text if it's not valid JSON
      try {
        responseData = JSON.parse(responseData);
      } catch {
        // If it's not JSON, use it as text
      }
    } catch (error) {
      responseData = { message: 'Failed to process response' };
    }

    const res = new NextResponse(
      typeof responseData === 'string' ? responseData : JSON.stringify(responseData),
      {
        status: backendRes.status,
        headers: {
          "content-type": contentType,
        },
      }
    );

    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }

    return res;
  } catch (err) {
    return NextResponse.json({ message: "Proxy error: Registration failed" }, { status: 500 });
  }
}


