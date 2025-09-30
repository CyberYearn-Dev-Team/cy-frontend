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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center justify-center">
              <img
                src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/CyberYearn_OctaTech_Logo_Black.png"
                alt="Logo"
                className="h-12 sm:h-16 md:h-20 w-auto"
              />
            </div>
          </Link>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-6">
              <CardTitle className="text-center text-2xl font-bold text-gray-900">
                {step === "email" ? "Forgot Password" : "Enter 5-Digit Code"}
              </CardTitle>
              <p className="text-center text-gray-600 text-sm mt-2">
                {step === "email"
                  ? "Enter your email to receive a 5-digit verification code."
                  : "Enter the code sent to your email to reset your password."}
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              {step === "email" ? (
                <form className="space-y-5" onSubmit={handleEmailSubmit}>
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="mt-1 h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                      onChange={handleChange}
                      value={form.email}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-[#72a210] hover:bg-[#507800] text-white font-medium cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? "Sending code..." : "Send Code"}
                  </Button>
                </form>
              ) : (
                <form className="space-y-5" onSubmit={handleCodeSubmit}>
                  <div>
                    <Label
                      htmlFor="code"
                      className="text-sm font-medium text-gray-700"
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
                      className="mt-1 h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                      onChange={handleChange}
                      value={form.code}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-[#72a210] hover:bg-[#507800] text-white font-medium cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </Button>
                </form>
              )}

              <p className="text-sm text-center text-gray-600 mt-6">
                Remembered your password?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Login
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-500">
              By using this platform, you agree to our Terms of Service and
              Privacy Policy.
            </p>
            <p className="text-xs text-gray-500">
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
