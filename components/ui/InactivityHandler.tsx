"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export default function InactivityHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Routes where auto-logout should NOT trigger
    const publicRoutes = [
      "/",
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/landing/contact",
      "/landing/legalpages/privacy-policy",
      "/landing/legalpages/terms-of-service",
      "/landing/legalpages/cookie-policy",
      "/landing/legalpages/aup",
    ];

    // Skip inactivity tracking for public routes
    if (publicRoutes.includes(pathname)) return;

    const logoutUser = async () => {
      try {
        // Notify user
        toast.warning("You’ve been logged out due to inactivity.", {
          description: "Please log in again to continue.",
          duration: 4000,
        });

        // Small delay so user sees the toast
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Call backend logout endpoint
        await fetch("/api/v1/auth/logout", {
          method: "POST",
          credentials: "include",
        });

        // Clear local/session storage
        localStorage.clear();
        sessionStorage.clear();

        // Expire all cookies manually
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });

        //Redirect securely (can’t go back)
        router.replace("/auth/login");
      } catch (err) {
        console.error("Auto logout failed:", err);
        toast.error("Something went wrong during logout.");
      }
    };

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logoutUser, 30 * 60 * 1000); // 30 minutes inactivity
      // timer = setTimeout(logoutUser, 5000); // 5 seconds for testing
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Start the timer
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [router, pathname]);

  return null;
}
