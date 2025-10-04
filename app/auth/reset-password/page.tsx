"use client";

import Link from "next/link";
import Footer from "@/components/ui/footer";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
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

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // ✅ Mock API: simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Password reset successfully. Redirecting to login...");

      // Delay a little before redirecting
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch {
      toast.error("Failed to reset password. Try again.");
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
                Reset Password
              </CardTitle>
              {/* Applied dark mode text color for description */}
              <p className={`text-center ${textMedium} text-sm mt-2`}>
                Enter a new password for{" "}
                <span className={`font-medium ${textDark}`}>{email}</span>
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* New Password */}
                <div>
                  {/* Applied dark mode label text color */}
                  <Label
                    htmlFor="password"
                    className={`text-sm font-medium ${textLabel}`}
                  >
                    New Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      // Applied dark mode input styles
                      className={`h-11 ${inputBg} ${inputBorder} ${focusBorder} ${textDark} placeholder:text-gray-400 dark:placeholder:text-gray-500 pr-10`}
                      required
                      onChange={handleChange}
                      value={form.password}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {/* Applied dark mode icon color */}
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  {/* Applied dark mode label text color */}
                  <Label
                    htmlFor="confirmPassword"
                    className={`text-sm font-medium ${textLabel}`}
                  >
                    Confirm Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      // Applied dark mode input styles
                      className={`h-11 ${inputBg} ${inputBorder} ${focusBorder} ${textDark} placeholder:text-gray-400 dark:placeholder:text-gray-500 pr-10`}
                      required
                      onChange={handleChange}
                      value={form.confirmPassword}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {/* Applied dark mode icon color */}
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  // Applied theme colors
                  className={`w-full h-11 bg-[${primary}] hover:bg-[${primaryDarker}] text-white font-medium cursor-pointer`}
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}