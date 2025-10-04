"use client";

import Link from "next/link";
import Footer from "@/components/ui/footer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // ✅ Import Sonner

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#507800";
const bgLight = "bg-gray-50 dark:bg-gray-950"; // Main page background
const cardBg = "bg-white dark:bg-gray-900"; // Card background
const textDark = "text-gray-900 dark:text-gray-100"; // Headings/Strong text
const textMedium = "text-gray-600 dark:text-gray-300"; // Body text
const textLabel = "text-gray-700 dark:text-gray-200"; // Label text
const textLight = "text-gray-500 dark:text-gray-400"; // Subtle/Link text
const inputBg = "bg-gray-50 dark:bg-gray-800";
const inputBorder = "border-gray-200 dark:border-gray-700";
const focusBorder = "focus:border-blue-500 dark:focus:border-blue-400";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [form, setForm] = useState({ email: "", code: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers for code and max length 5
    if (e.target.id === "code") {
      const value = e.target.value.replace(/\D/g, "").slice(0, 5);
      setForm({ ...form, code: value });
    } else {
      setForm({ ...form, [e.target.id]: e.target.value });
    }
  };

  // Step 1: Mock sending email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // fake delay

      toast.success("Check your email for the 5-digit code");
      setStep("code");
    } catch {
      toast.error("Failed to send code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Mock verifying code (auto navigate for testing)
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // fake delay

      toast.success("Code verified! Redirecting...");
      router.push(`/auth/reset-password?email=${encodeURIComponent(form.email)}`);
    } catch {
      toast.error("Invalid code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Applied dark mode background */}
      <div className={`flex min-h-screen items-center justify-center ${bgLight} px-4 py-8`}>
        <div className="w-full max-w-md">
{/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            {/* Light mode logo */}
            <img
              src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/dark%20logo.png"
              alt="Logo"
              className="h-10 sm:h-10 md:h-12 w-auto block dark:hidden"
            />
            {/* Dark mode logo */}
            <img
              src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/light%20logo.png"
              alt="Logo"
              className="h-10 sm:h-10 md:h-12 w-auto hidden dark:block"
            />
          </div>
        </Link>


          {/* Applied dark mode card background and border */}
          <Card className={`${cardBg} shadow-lg border-gray-100 dark:border-gray-800`}>
            <CardHeader className="pb-6">
              {/* Applied dark mode text color for title */}
              <CardTitle className={`text-center text-2xl font-bold ${textDark}`}>
                {step === "email" ? "Forgot Password" : "Enter 5-Digit Code"}
              </CardTitle>
              {/* Applied dark mode text color for description */}
              <p className={`text-center ${textMedium} text-sm mt-2`}>
                {step === "email"
                  ? "Enter your email to receive a 5-digit verification code."
                  : "Enter the code sent to your email to reset your password."}
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              {step === "email" ? (
                <form className="space-y-5" onSubmit={handleEmailSubmit}>
                  <div>
                    {/* Applied dark mode label text color */}
                    <Label
                      htmlFor="email"
                      className={`text-sm font-medium ${textLabel}`}
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      // Applied dark mode input styles
                      className={`mt-1 h-11 ${inputBg} ${inputBorder} ${focusBorder} ${textDark} placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                      required
                      onChange={handleChange}
                      value={form.email}
                    />
                  </div>

                  <Button
                    type="submit"
                    // Applied theme colors
                    className={`w-full h-11 bg-[${primary}] hover:bg-[${primaryDarker}] text-white font-medium cursor-pointer`}
                    disabled={loading}
                  >
                    {loading ? "Sending code..." : "Send Code"}
                  </Button>
                </form>
              ) : (
                <form className="space-y-5" onSubmit={handleCodeSubmit}>
                  <div>
                    {/* Applied dark mode label text color */}
                    <Label
                      htmlFor="code"
                      className={`text-sm font-medium ${textLabel}`}
                    >
                      5-Digit Code
                    </Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter code"
                      maxLength={5}
                      inputMode="numeric"
                      pattern="\d{5}"
                      // Applied dark mode input styles
                      className={`mt-1 h-11 ${inputBg} ${inputBorder} ${focusBorder} ${textDark} placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                      required
                      onChange={handleChange}
                      value={form.code}
                    />
                  </div>

                  <Button
                    type="submit"
                    // Applied theme colors
                    className={`w-full h-11 bg-[${primary}] hover:bg-[${primaryDarker}] text-white font-medium cursor-pointer`}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </Button>
                </form>
              )}

              {/* Applied dark mode text color and link theme color */}
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
            {/* Applied dark mode text color */}
            <p className={`text-xs ${textLight}`}>
              By using this platform, you agree to our Terms of Service and
              Privacy Policy.
            </p>
            {/* Applied dark mode text color */}
            <p className={`text-xs ${textLight}`}>
              All activities are logged for educational and security purposes.
            </p>
          </div>
        </div>
      </div>
      {/* importing footer from component */}
      <Footer />
    </div>
  );
}