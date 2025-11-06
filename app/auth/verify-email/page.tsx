"use client";

import Link from "next/link";
import Footer from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { Toaster, toast } from "sonner";

// Theme Constants (same as LoginPage)
const primary = "#72a210";
const primaryDarker = "#507800";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const cardBg = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-300";
const textLight = "text-gray-500 dark:text-gray-400";

export default function EmailVerificationPage() {
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    // Placeholder for API verification logic later
    setVerified(true);
  };

  const handleResendEmail = () => {
    // Replaced alert with Sonner toast
    toast.success("Verification email resent!");
  };

  const handleGoToDashboard = () => {
    //Show Sonner toast when clicking "Go to Dashboard"
    toast.success("Welcome to Cyber Learn");
  };

  return (
    <div>

      <div
        className={`flex min-h-screen items-center justify-center ${bgLight} px-4 py-8`}
      >
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

          {/* Verification Card */}
          <Card className={`${cardBg} shadow-lg border-gray-100 dark:border-gray-800`}>
            <CardHeader className="pb-6 text-center">
              <CardTitle className={`text-2xl font-bold ${textDark} cursor-pointer`}>
                {verified ? "Email Verified!" : "Verify Your Email"}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-4 text-center">
              {!verified ? (
                <>
                  <p className={`text-sm ${textMedium}`}>
                    Click the button below to verify your account.
                  </p>
                  <Button
                    onClick={handleVerify}
                    className={`w-full h-11 bg-[${primary}] hover:bg-[${primaryDarker}] text-white font-medium cursor-pointer`}
                  >
                    Verify Account
                  </Button>

                  {/* New Buttons Section */}
                  <div className="flex flex-col items-start w-full mt-3">
                    {/* Two buttons, 50% width each */}
                    <div className="flex w-full gap-2 sm:gap-5 mb-5">
                      <Button
                        variant="outline"
                        onClick={handleResendEmail}
                        className="h-11 text-sm font-medium flex-1 cursor-pointer"
                      >
                        Resend Email
                      </Button>

                      <Link href="/auth/register" className="flex-1">
                        <Button
                          variant="outline"
                          className="h-11 w-full text-sm font-medium cursor-pointer"
                        >
                          Re-register
                        </Button>
                      </Link>
                    </div>

                    {/* Go Home link at flex-start */}
                    <Link
                      href="/"
                      className={`text-sm font-medium ${textMedium} hover:underline cursor-pointer`}
                    >
                      Go Home
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <p className={`text-sm ${textMedium}`}>
                    Your account has been successfully verified.
                  </p>
                  {/*Toast trigger on Dashboard click */}
                  <Link
                    href="/learner-dashboard/dashboard"
                    onClick={handleGoToDashboard}
                    className={`w-full h-11 flex items-center justify-center rounded-md bg-[${primary}] hover:bg-[${primaryDarker}] text-white font-medium mt-3`}
                  >
                    Go to Dashboard
                  </Link>
                </>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 text-center space-y-2">
            <p className={`text-xs ${textLight}`}>
              If you didn&apos;t request this verification, please ignore this message.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
