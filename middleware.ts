import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin-dashboard routes
  if (pathname.startsWith("/admin-dashboard")) {
    try {
      const res = await fetch(`${req.nextUrl.origin}/api/v1/auth/me`, {
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      });

      const data = await res.json();
      const role = data?.data?.role;

      if (role !== "admin") {
        // Not admin → redirect to learner dashboard or login
        return NextResponse.redirect(new URL("/learner-dashboard/dashboard", req.url));
      }
    } catch (err) {
      console.error("Middleware auth error:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Otherwise continue as normal
  return NextResponse.next();
}

// Apply middleware only to /admin-dashboard routes
export const config = {
  matcher: ["/admin-dashboard/:path*"],
};
