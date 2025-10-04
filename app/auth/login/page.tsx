"use client"

import axios from "axios"
import Link from "next/link"
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Info } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner" 

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#507800";
const bgLight = "bg-gray-50 dark:bg-gray-950"; // Main page background
const cardBg = "bg-white dark:bg-gray-900"; // Card background
const textDark = "text-gray-900 dark:text-gray-100"; // Headings/Strong text
const textMedium = "text-gray-600 dark:text-gray-300"; // Body text
const textLight = "text-gray-500 dark:text-gray-400"; // Subtle/Link text
const inputBg = "bg-gray-50 dark:bg-gray-800";
const inputBorder = "border-gray-200 dark:border-gray-700";
const focusBorder = "focus:border-blue-500 dark:focus:border-blue-400";
const infoBg = "bg-yellow-50 dark:bg-yellow-950";
const infoBorder = "border-yellow-200 dark:border-yellow-800";


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // ✅ Mock API call (fake delay, always success for now)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // // 🔒 Real API call (uncomment later when backend is ready)
      // const res = await axios.post("http://backend-url.com/api/login", form)
      // if (res.status === 200) {
      // 	toast.success("Login successful")
      // 	router.push("/dashboard")
      // }

      // For now, just simulate success
      toast.success("Login successful")
      router.push("/learner-dashboard/dashboard")
    } catch (error) {
      console.error(error)
      toast.error("Login failed! Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Applied dark mode background */}
      <div className={`flex min-h-screen items-center justify-center ${bgLight} px-4 py-8`}>
        <div className="w-full max-w-md">
          {/* Logo */}
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
              {/* Applied dark mode text color */}
              <CardTitle className={`text-center text-2xl font-bold ${textDark}`}>
                Welcome back
              </CardTitle>
              {/* Applied dark mode text color */}
              <p className={`text-center ${textMedium} text-sm mt-2`}>
                Enter your credentials to access your learning dashboard
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div>
                  {/* Applied dark mode text color */}
                  <Label htmlFor="email" className={`text-sm font-medium ${textDark}`}>
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

                {/* Password Field */}
                <div>
                  {/* Applied dark mode text color */}
                  <Label htmlFor="password" className={`text-sm font-medium ${textDark}`}>
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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

                {/* Educational Use Notice */}
                {/* Applied dark mode colors for alert/info box */}
                <div className={`${infoBg} ${infoBorder} border rounded-lg p-3`}>
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-medium text-yellow-800 dark:text-yellow-300">Educational Use Only:</span>
                      <span className="text-yellow-700 dark:text-yellow-400 ml-1">
                        This platform is designed for learning cybersecurity concepts in a safe, controlled environment.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  // Applied theme colors
                  className={`w-full h-11 bg-[${primary}] hover:bg-[${primaryDarker}] text-white font-medium cursor-pointer`}
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {/* Sign Up Link */}
              {/* Applied dark mode text color and theme color to link */}
              <p className={`text-sm text-center ${textMedium} mt-6`}>
                Don&apos;t have an account?{" "}
                <Link 
                  href="/auth/register" 
                  className={`text-blue-600 dark:text-blue-400 hover:text-[${primary}] hover:underline font-medium`}
                >
                  Sign up
                </Link>
              </p>

              {/* Forgot Password Link */}
              {/* Applied dark mode text color */}
              <p className="text-sm text-center">
                <Link href="/auth/forgot-password" className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:underline`}>
                  Forgot your password?
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Footer Text */}
          <div className="mt-6 text-center space-y-2">
            {/* Applied dark mode text color */}
            <p className={`text-xs ${textLight}`}>
              By signing in, you agree to our Terms of Service and Privacy Policy.
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
  )
}