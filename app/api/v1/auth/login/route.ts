import { NextResponse } from "next/server";

const BACKEND_BASE = "https://cy-backend.onrender.com/api/v1";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookie = req.headers.get("cookie") || "";

    const backendRes = await fetch(`${BACKEND_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const text = await backendRes.text();
    const contentType = backendRes.headers.get("content-type") || "application/json";

    const res = new NextResponse(text, {
      status: backendRes.status,
      headers: {
        "content-type": contentType,
      },
    });

    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }

    return res;
  } catch (err) {
    return NextResponse.json({ message: "Proxy error: Login failed" }, { status: 500 });
  }
}


