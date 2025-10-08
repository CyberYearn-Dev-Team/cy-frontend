import { NextResponse } from "next/server";

const BACKEND_BASE = "https://cy-backend.onrender.com/api/v1";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const backendRes = await fetch(`${BACKEND_BASE}/auth/logout`, {
      method: "POST",
      headers: { cookie },
      credentials: "include",
    });

    const text = await backendRes.text();
    const res = new NextResponse(text, { status: backendRes.status });

    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }

    return res;
  } catch (err) {
    return NextResponse.json({ message: "Proxy error: Logout failed" }, { status: 500 });
  }
}


