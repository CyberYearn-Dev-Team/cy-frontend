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
      //   toast.success("Login successful")
      //   router.push("/dashboard")
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
                Welcome back
              </CardTitle>
              <p className="text-center text-gray-600 text-sm mt-2">
                Enter your credentials to access your learning dashboard
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
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

                {/* Password Field */}
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                      required
                      onChange={handleChange}
                      value={form.password}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Educational Use Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-medium text-yellow-800">Educational Use Only:</span>
                      <span className="text-yellow-700 ml-1">
                        This platform is designed for learning cybersecurity concepts in a safe, controlled environment.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-[#72a210] hover:bg-[#507800] text-white font-medium cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {/* Sign Up Link */}
              <p className="text-sm text-center text-gray-600 mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                  Sign up
                </Link>
              </p>

              {/* Forgot Password Link */}
              <p className="text-sm text-center">
                <Link href="/auth/forgot-password" className="text-gray-500 hover:text-gray-700 hover:underline">
                  Forgot your password?
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Footer Text */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy.
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
  )
}
