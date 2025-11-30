import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // const cookieStore = cookies();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - Token missing" },
        { status: 401 }
      );
    }

    const res = await fetch(
      "https://cy-backend.onrender.com/api/v1/me/gamification",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Error fetching gamification:", err);
    return NextResponse.json(
      { status: 500, message: "Failed to fetch gamification", data: {} },
      { status: 500 }
    );
  }
}
