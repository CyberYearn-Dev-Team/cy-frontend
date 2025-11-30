import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies(); // <-- FIX: await it
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - Token missing" },
        { status: 401 }
      );
    }

    const res = await fetch("https://cy-backend.onrender.com/api/v1/badges", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });

  } catch (err) {
    console.error("Error fetching badges:", err);
    return NextResponse.json(
      { status: 500, message: "Failed to fetch badges", data: {} },
      { status: 500 }
    );
  }
}
