"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import { Toaster, toast } from "sonner";
// import { authService } from "@/lib/api/auth";
import Footer from "@/components/ui/footer";

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#507800";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const cardBg = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-300";
const textLight = "text-gray-500 dark:text-gray-400";

export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (emailParam && tokenParam) {
      setEmail(emailParam);
      setToken(tokenParam);
      handleVerify(emailParam, tokenParam);
    } else {
      // Fallback: check localStorage for pending registration
      const pending = localStorage.getItem("pendingRegistration");
      if (pending) {
        const { email: storedEmail } = JSON.parse(pending);
        setEmail(storedEmail);
      } else {
        router.push("/auth/login");
      }
    }
  }, [searchParams, router]);

  const handleVerify = async (email: string, token: string) => {
    if (!email || !token) {
      toast.error("Invalid verification link");
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://cy-backend.onrender.com/api/v1";
      const response = await fetch(`${apiUrl}/auth/verify-complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        if (process.env.NODE_ENV === "development") {
          console.log("Verification response:", data);
        }

        toast.success(
          "Your email has been successfully verified. Redirecting to your dashboard..."
        );
        localStorage.removeItem("pendingRegistration");

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        const error = await response.json();
        throw new Error(error.message || "Verification failed");
      }
    } catch (error: any) {
      toast.error(
        "Email verification failed. Please try again or request a new verification link."
      );
    } finally {
      setIsLoading(false);
    }
  };

const handleResendEmail = async () => {
  if (!email) {
    toast.error("No email found to resend verification");
    return;
  }

  setResendLoading(true);
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://cy-backend.onrender.com/api/v1";
    const response = await fetch(`${apiUrl}/auth/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });

    if (!response.ok) {
      // try parsing server error; if fetch fails, fall through to catch
      let errorMsg = "Failed to resend verification email";
      try {
        const error = await response.json();
        errorMsg = error.message || errorMsg;
      } catch (_) {}
      throw new Error(errorMsg);
    }

    toast.success("Verification email resent successfully!");
  } catch (error: any) {
    // Only show Sonner toast (red bg)
    toast.error(
      error?.message === "Failed to fetch"
        ? "Unable to reach the server. Please check your connection."
        : error.message || "Failed to resend verification email"
    );
  } finally {
    setResendLoading(false);
  }
};


  return (
    <div className={`min-h-screen flex flex-col ${bgLight}`}>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <img
                src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/dark%20logo.png"
                alt="Logo"
                className="h-10 w-auto block dark:hidden"
              />
              <img
                src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/light%20logo.png"
                alt="Logo"
                className="h-10 w-auto hidden dark:block"
              />
            </div>
          </Link>

          {/* Card */}
          <div className={`${cardBg} rounded-xl shadow-lg p-8`}>
            {isVerified ? (
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h2 className={`text-2xl font-bold ${textDark} mb-2`}>
                  Email Verified!
                </h2>
                <p className={`${textMedium} mb-6`}>
                  Your email has been successfully verified. Redirecting to your
                  dashboard...
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#72a210]" />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-[#d9f7c4] dark:bg-green-900/30 p-3 rounded-full">
                    <Mail className="w-12 h-12 text-[#72a210] dark:text-[#72a210]" />
                  </div>
                </div>
                <h2 className={`text-2xl font-bold ${textDark} mb-2`}>
                  {isLoading ? "Verifying..." : "Verify Your Email"}
                </h2>
                <p className={`${textMedium} mb-6`}>
                  We've sent a verification link to{" "}
                  <span className="font-medium">{email}</span>. Please check
                  your inbox and click the link to verify your account.
                </p>

                <button
                  onClick={handleResendEmail}
                  disabled={resendLoading || isLoading}
                  className={`w-full flex justify-center items-center px-4 py-2 rounded-md cursor-pointer ${
                    resendLoading
                      ? "bg-gray-300"
                      : `bg-[${primary}] hover:bg-[${primaryDarker}]`
                  } text-white font-medium transition-colors`}
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Sending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </button>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 mt-4">
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-[#72a210] hover:underline"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Support Footer */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${textLight}`}>
              Didn't receive the email? Check your spam folder
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
