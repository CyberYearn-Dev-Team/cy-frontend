import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin-dashboard")) {
    try {
      // Get cookies properly from Next.js RequestCookies API
      const cookieHeader = req.cookies.get("your_session_cookie_name")?.value;

      if (!cookieHeader) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      // Forward cookie to backend
      const res = await fetch("https://cy-backend.onrender.com/api/v1/auth/me", {
        headers: { cookie: `session=${cookieHeader}` }, // match your backend cookie name
      });

      const data = await res.json();
      const role = data?.data?.role;

      if (!role || role.toUpperCase() !== "ADMIN") {
        return NextResponse.redirect(new URL("/learner-dashboard/dashboard", req.url));
      }
    } catch (err) {
      console.error("Middleware auth error:", err);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-dashboard/:path*"],
};

