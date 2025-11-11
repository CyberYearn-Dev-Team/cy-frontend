"use client";

import Link from "next/link";
import Footer from "@/components/ui/footer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // For notifications

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#507800";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const cardBg = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-300";
const textLabel = "text-gray-700 dark:text-gray-200";
const textLight = "text-gray-500 dark:text-gray-400";
const inputBg = "bg-gray-50 dark:bg-gray-800";
const inputBorder = "border-gray-200 dark:border-gray-700";
const focusBorder = "focus:border-blue-500 dark:focus:border-blue-400";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate backend call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("A reset password link has been sent to your email.");

      // Optional: Redirect automatically to reset password page
      // router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={`flex min-h-screen items-center justify-center ${bgLight} px-4 py-8`}>
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex justify-center mb-3">
            <div className="flex items-center gap-2">
              <img
                src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/dark%20logo.png"
                alt="Logo"
                className="h-10 sm:h-10 md:h-12 w-auto block dark:hidden"
              />
              <img
                src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/light%20logo.png"
                alt="Logo"
                className="h-10 sm:h-10 md:h-12 w-auto hidden dark:block"
              />
            </div>
          </Link>

          {/* Card */}
          <Card className={`${cardBg} shadow-lg border-gray-100 dark:border-gray-800`}>
            <CardHeader className="pb-6">
              <CardTitle className={`text-center text-2xl font-bold ${textDark}`}>
                Forgot Password
              </CardTitle>
              <p className={`text-center ${textMedium} text-sm mt-2`}>
                Enter your email and we’ll send you a link to reset your password.
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <form className="space-y-5" onSubmit={handleEmailSubmit}>
                <div>
                  <Label htmlFor="email" className={`text-sm font-medium ${textLabel}`}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className={`mt-1 h-11 ${inputBg} ${inputBorder} ${focusBorder} ${textDark} placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                <Button
                  type="submit"
                  className={`w-full h-11 bg-[${primary}] hover:bg-[${primaryDarker}] text-white font-medium cursor-pointer`}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              <p className={`text-sm text-center ${textMedium} mt-6`}>
                Remembered your password?{" "}
                <Link
                  href="/auth/login"
                  className={`text-blue-600 dark:text-blue-400 hover:text-[${primary}] hover:underline font-medium`}
                >
                  Login
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-6 text-center space-y-2">
            <p className={`text-xs ${textLight}`}>
              By using this platform, you agree to our Terms of Service and Privacy Policy.
            </p>
            <p className={`text-xs ${textLight}`}>
              All activities are logged for educational and security purposes.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
