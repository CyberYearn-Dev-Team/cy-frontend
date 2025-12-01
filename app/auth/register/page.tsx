"use client"

import Link from "next/link"
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"  
import { registerUser } from "@/lib/api/auth"

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
const infoBg = "bg-yellow-50 dark:bg-yellow-950";
const infoBorder = "border-yellow-200 dark:border-yellow-800";


export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [understoodPurpose, setUnderstoodPurpose] = useState(false)
  const [form, setForm] = useState({
    username: "",
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
  e.preventDefault();
  setLoading(true);

  try {
    // Form validation
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    // Password validation
    const password = form.password;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (!hasLetter || !hasNumber) {
      toast.error("Password must include both letters and numbers.");
      setLoading(false);
      return;
    }

    // Prepare registration data
    const registrationData = {
      username: form.username,
      email: form.email,
      password: form.password,
      role: "user"
    };

    // Call the register API
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    let errorMessage = 'Registration failed. Please try again.';
    let data;
    
    try {
      data = await response.json();
    } catch (e) {
      // If response is not JSON, try to get text
      const text = await response.text().catch(() => '');
      if (response.status === 409) {
        errorMessage = 'This email is already registered or pending verification.';
      }
      throw new Error(text || errorMessage);
    }

    if (!response.ok) {
      if (response.status === 409) {
        errorMessage = data.message || 'This email is already registered or pending verification.';
      } else {
        errorMessage = data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Store pending registration data if needed
    if (data.pendingRegistration) {
      localStorage.setItem('pendingRegistration', JSON.stringify(data.pendingRegistration));
    }

    // Show success message
    toast.success("A verification email has been sent to your email address. Please check your inbox to verify your account.");
    
    // Reset form
    setForm({
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    
  } catch (error: any) {
    console.error('Registration error:', error);
    toast.error(error.message || "Registration failed. Please try again.");
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
          <Link href="/" className="flex justify-center mb-3">
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
                Create your account
              </CardTitle>
              {/* Applied dark mode text color */}
              <p className={`text-center ${textMedium} text-sm mt-2`}>
                Start your cybersecurity learning journey today
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <form className="space-y-5" onSubmit={handleSubmit}>

                {/* Username Field */}
                <div>
                  {/* Applied dark mode label text color */}
                  <Label htmlFor="username" className={`text-sm font-medium ${textLabel}`}>
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    // Applied dark mode input styles
                    className={`mt-1 h-11 ${inputBg} ${inputBorder} ${focusBorder} ${textDark} placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                    required
                    value={form.username}
                    onChange={handleChange}
                  />
                </div>

                {/* Email Field */}
                <div>
                  {/* Applied dark mode label text color */}
                  <Label htmlFor="email" className={`text-sm font-medium ${textLabel}`}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    // Applied dark mode input styles
                    className={`mt-1 h-11 ${inputBg} ${inputBorder} ${focusBorder} ${textDark} placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                    required
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Password Field */}
                <div>
                  {/* Applied dark mode label text color */}
                  <Label htmlFor="password" className={`text-sm font-medium ${textLabel}`}>
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      // Applied dark mode input styles
                      className={`h-11 ${inputBg} ${inputBorder} ${focusBorder} ${textDark} placeholder:text-gray-400 dark:placeholder:text-gray-500 pr-10`}
                      required
                      value={form.password}
                      onChange={handleChange}
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

                {/* Confirm Password Field */}
                <div>
                  {/* Applied dark mode label text color */}
                  <Label htmlFor="confirmPassword" className={`text-sm font-medium ${textLabel}`}>
                    Confirm Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      // Applied dark mode input styles
                      className={`h-11 ${inputBg} ${inputBorder} ${focusBorder} ${textDark} placeholder:text-gray-400 dark:placeholder:text-gray-500 pr-10`}
                      required
                      value={form.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {/* Applied dark mode icon color */}
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Educational Use Warning */}
                {/* Applied dark mode colors for alert/info box */}
                <div className={`${infoBg} ${infoBorder} border rounded-lg p-3`}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-medium text-yellow-800 dark:text-yellow-300">Educational Use Only:</span>
                      <span className="text-yellow-700 dark:text-yellow-400 ml-1">
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
  className={`
    mt-0.5 
    border-gray-400 
    data-[state=checked]:bg-[${primary}] 
    data-[state=checked]:text-white 
    dark:border-gray-600 
    dark:data-[state=checked]:bg-[${primaryDarker}] 
    dark:data-[state=checked]:text-white 
    data-[state=checked]:text-black
  `}
/>

                    {/* Applied dark mode text color and link theme color */}
                    <label htmlFor="terms" className={`text-sm ${textMedium} leading-5`}>
                      I agree to the{" "}
                      <Link 
                        href="/landing/legalpages/terms" 
                        className={`text-blue-600 dark:text-blue-400 hover:text-[${primary}] hover:underline`}
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link 
                        href="/landing/legalpages/privacy" 
                        className={`text-blue-600 dark:text-blue-400 hover:text-[${primary}] hover:underline`}
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
  id="educational"
  checked={understoodPurpose}
  onCheckedChange={(value) => setUnderstoodPurpose(value === true)}
  className={`
    mt-0.5 
    border-gray-400 
    data-[state=checked]:bg-[${primary}] 
    data-[state=checked]:text-black 
    dark:border-gray-600 
    dark:data-[state=checked]:bg-[${primaryDarker}] 
    dark:data-[state=checked]:text-white
  `}
/>

                    {/* Applied dark mode text color */}
                    <label htmlFor="educational" className={`text-sm ${textMedium} leading-5`}>
                      I understand this platform is for{" "}
                      <span className="font-medium">educational purposes only</span> and agree to use it responsibly
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  // Applied theme colors
                  className={`w-full h-11 bg-[${primary}] hover:bg-[${primaryDarker}] text-white font-medium cursor-pointer`}
                  disabled={!agreedToTerms || !understoodPurpose || loading}
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </form>

              {/* Sign In Link */}
              {/* Applied dark mode text color and link theme color */}
              <p className={`text-sm text-center ${textMedium} mt-6`}>
                Already have an account?{" "}
                <Link 
                  href="/auth/login" 
                  className={`text-blue-600 dark:text-blue-400 hover:text-[${primary}] hover:underline font-medium`}
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Footer Text */}
          <div className="mt-6 text-center space-y-2">
            {/* Applied dark mode text color */}
            <p className={`text-xs ${textLight}`}>
              By creating an account, you acknowledge that all activities are logged for educational and security purposes.
            </p>
            {/* Applied dark mode text color */}
            <p className={`text-xs ${textLight}`}>
              CyberYearn is committed to providing a safe learning environment.
            </p>
          </div>
        </div>
      </div>

      {/* importing footer from component */}
      <Footer />
    </div>
  )
}