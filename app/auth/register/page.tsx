"use client"

import Link from "next/link"
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [understoodPurpose, setUnderstoodPurpose] = useState(false)
  const [form, setForm] = useState({
    username: "",   // ✅ Added username
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match!")
        return
      }

      // ✅ Mock API call (replace with backend URL later)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // fake delay

      // const res = await axios.post("http://backend-url.com/api/register", {
      //   username: form.username,  // ✅ send username too
      //   email: form.email,
      //   password: form.password,
      // })

      if (form.username && form.email && form.password) {
        router.push("/learner-dashboard/dashboard")
      } else {
        alert("Registration failed (mocked)")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
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
                Create your account
              </CardTitle>
              <p className="text-center text-gray-600 text-sm mt-2">
                Start your cybersecurity learning journey today
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <form className="space-y-5" onSubmit={handleSubmit}>

                {/* ✅ Username Field */}
                <div>
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    className="mt-1 h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                    value={form.username}
                    onChange={handleChange}
                  />
                </div>

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
                    value={form.email}
                    onChange={handleChange}
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
                      placeholder="Create a strong password"
                      className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                      required
                      value={form.password}
                      onChange={handleChange}
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

                {/* Confirm Password Field */}
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                      required
                      value={form.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Educational Use Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-medium text-yellow-800">Educational Use Only:</span>
                      <span className="text-yellow-700 ml-1">
                        This platform is designed exclusively for learning cybersecurity concepts in a safe, controlled environment.
                        Any misuse is strictly prohibited.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(value) => setAgreedToTerms(value === true)}
                      className="mt-0.5"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 leading-5">
                      I agree to the{" "}
                      <Link href="/landing/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/landing/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="educational"
                      checked={understoodPurpose}
                      onCheckedChange={(value) => setUnderstoodPurpose(value === true)}
                      className="mt-0.5"
                    />
                    <label htmlFor="educational" className="text-sm text-gray-700 leading-5">
                      I understand this platform is for{" "}
                      <span className="font-medium">educational purposes only</span> and agree to use it responsibly
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-[#72a210] hover:bg-[#507800] text-white font-medium"
                  disabled={!agreedToTerms || !understoodPurpose || loading}
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </form>

              {/* Sign In Link */}
              <p className="text-sm text-center text-gray-600 mt-6">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Footer Text */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-500">
              By creating an account, you acknowledge that all activities are logged for educational and security purposes.
            </p>
            <p className="text-xs text-gray-500">
              CyberLearn is committed to providing a safe learning environment.
            </p>
          </div>
        </div>
      </div>

      {/* importing footer from component */}
      <Footer />
    </div>
  )
}
