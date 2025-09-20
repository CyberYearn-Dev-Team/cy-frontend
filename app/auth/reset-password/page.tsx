"use client"

import Link from "next/link"
import Footer from "@/components/ui/footer";
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [form, setForm] = useState({ password: "", confirmPassword: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      // ✅ Mock API: simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccessMessage("Password reset successfully. Redirecting to login...")

      // Delay a little before redirecting
      setTimeout(() => {
        router.push("/auth/login")
      }, 1500)
    } catch {
      setError("Failed to reset password. Try again.")
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
              Reset Password
            </CardTitle>
            <p className="text-center text-gray-600 text-sm mt-2">
              Enter a new password for <span className="font-medium">{email}</span>
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* New Password */}
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  New Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
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
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    required
                    onChange={handleChange}
                    value={form.confirmPassword}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-[#72a210] hover:bg-[#507800] text-white font-medium"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-gray-500">
            By using this platform, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="text-xs text-gray-500">
            All activities are logged for educational and security purposes.
          </p>
        </div>
      </div>
    </div>

    {/* inporting footer drom component */}
          <Footer />
        </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
