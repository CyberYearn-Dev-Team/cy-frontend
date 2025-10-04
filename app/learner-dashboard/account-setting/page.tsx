"use client";

import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, LogOut } from "lucide-react";

import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#507800";
const bgLight = "bg-gray-50 dark:bg-gray-950"; // Main page background
const cardBg = "bg-white dark:bg-gray-900"; // Card background
const textDark = "text-gray-900 dark:text-gray-100"; // Headings/Strong text
const textMedium = "text-gray-600 dark:text-gray-300"; // Body text
const textLabel = "text-gray-700 dark:text-gray-200"; // Label text
const textLight = "text-gray-500 dark:text-gray-400"; // Subtle/Icon text
const borderLight = "border-gray-200 dark:border-gray-700"; // Light border
const inputBg = "bg-white dark:bg-gray-800";
const inputBorder = "border-gray-300 dark:border-gray-600";
const focusRing = `focus-within:ring-2 focus-within:ring-[${primary}] dark:focus-within:ring-blue-400`;

// Reusable Card components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  // Applied dark mode background and border
  <div className={`${cardBg} rounded-xl shadow-md border ${borderLight} ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  // Applied dark mode border
  <div className={`px-6 py-4 border-b ${borderLight}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  // Applied dark mode text color
  <h3 className={`text-lg font-semibold ${textDark} ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";

  const variants = {
    // Applied theme colors
    primary: `bg-[${primary}] hover:bg-[${primaryDarker}] text-white focus:ring-[${primary}]`,
    // Applied dark mode colors for secondary button
    secondary: `${cardBg} hover:bg-gray-50 dark:hover:bg-gray-800 ${textLabel} border ${inputBorder} focus:ring-gray-300 dark:focus:ring-gray-600`,
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ icon: Icon, ...props }: { icon?: any } & React.InputHTMLAttributes<HTMLInputElement>) => (
  // Applied dark mode styles and focus ring
  <div className={`flex items-center border ${inputBorder} rounded-md px-3 py-2 ${focusRing} ${inputBg}`}>
    {/* Applied dark mode icon color */}
    {Icon && <Icon className={`h-4 w-4 ${textLight} mr-2`} />}
    {/* Applied dark mode text and placeholder color */}
    <input className={`flex-1 outline-none text-sm ${textDark} placeholder-gray-400 dark:placeholder-gray-500 ${inputBg}`} {...props} />
  </div>
);

const RadioGroup = ({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex gap-4">
    {options.map((option) => (
      <label key={option.value} className="flex items-center cursor-pointer">
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={(e) => onChange(e.target.value)}
          // Applied theme color to radio button
          className={`h-4 w-4 text-[${primary}] focus:ring-[${primary}] border-gray-300 dark:border-gray-600 dark:bg-gray-800`}
        />
        {/* Applied dark mode text color */}
        <span className={`ml-2 text-sm ${textLabel}`}>{option.label}</span>
      </label>
    ))}
  </div>
);

const MenuItem = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
}: {
  icon: any;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 text-left text-sm transition-colors ${
      isActive
        // Applied theme colors for active state
        ? `bg-[${primary}] text-white border-r-2 border-[${primary}]`
        // Applied dark mode colors for inactive state
        : `${textLabel} hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300`
    }`}>
    <Icon className="h-4 w-4 mr-3" />
    {label}
  </button>
);

export default function AccountSettingsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "Roland",
    lastName: "Donald",
    email: "rolanddonald@gmail.com",
    username: "roland_d",
  });

  // Password State
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePersonalInfoSave = () => {
    toast.success("Personal information saved");
  };

  const handlePasswordReset = () => {
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    toast.success("Password updated successfully");
    setPasswordInfo({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleLogout = () => {
    toast("You have been logged out", { description: "See you soon!" });

    // Clear auth state here if needed (e.g., remove token from localStorage or cookies)

    // Redirect to login page after short delay (so toast is visible)
    setTimeout(() => {
      router.push("/auth/login");
    }, 1000);
  };

  const renderPersonalInformation = () => (
    <div className="space-y-6">
      {/* Profile Image */}
      <div className="flex items-center space-x-4">
        {/* Applied theme color to avatar background */}
        <div className={`h-25 w-25 rounded-full bg-[${primary}] flex items-center justify-center overflow-hidden cursor-pointer`}>
          <img
            src="/api/placeholder/120/120"
            alt="Profile"
            className="w-15 h-15 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.nextElementSibling?.classList.remove("hidden");
            }}
          />
          <User className="h-14 w-14 text-white hidden" />
        </div>
        {/* Applied dark mode text color */}
        <div className={`text-xl font-semibold ${textDark}`}>
          {personalInfo.firstName} {personalInfo.lastName}
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {/* Applied dark mode label text color */}
          <label className={`block text-sm font-medium ${textLabel} mb-1`}>First Name</label>
          <Input
            type="text"
            value={personalInfo.firstName}
            onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
            placeholder="Enter first name"
          />
        </div>
        <div>
          {/* Applied dark mode label text color */}
          <label className={`block text-sm font-medium ${textLabel} mb-1`}>Last Name</label>
          <Input
            type="text"
            value={personalInfo.lastName}
            onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
            placeholder="Enter last name"
          />
        </div>
      </div>

      {/* Username */}
      <div>
        {/* Applied dark mode label text color */}
        <label className={`block text-sm font-medium ${textLabel} mb-1`}>Username</label>
        <Input
          type="text"
          value={personalInfo.username}
          onChange={(e) => setPersonalInfo({ ...personalInfo, username: e.target.value })}
          placeholder="Enter username"
        />
      </div>

      {/* Email */}
      <div className="relative">
        {/* Applied dark mode label text color */}
        <label className={`block text-sm font-medium ${textLabel} mb-1`}>Email</label>
        {/* Applied dark mode styles and focus ring */}
        <div className={`flex items-center border ${inputBorder} rounded-md px-3 py-2 ${focusRing} ${inputBg}`}>
          {/* Applied dark mode icon color */}
          <Mail className={`h-4 w-4 ${textLight} mr-2`} />
          <input
            // Applied dark mode text and placeholder color
            className={`flex-1 outline-none text-sm ${textDark} placeholder-gray-400 dark:placeholder-gray-500 ${inputBg}`}
            type="email"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
            placeholder="Enter email"
          />
          {/* Ensure Verified badge contrasts in dark mode */}
          <span className="ml-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/50 dark:text-green-400 px-2 py-1 rounded">
            Verified
          </span>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex pt-4">
        <Button onClick={handlePersonalInfoSave} className="flex-1 cursor-pointer">
          Save Changes
        </Button>
      </div>
    </div>
  );

  const renderLoginPassword = () => (
    <div className="space-y-6">
      {/* Current Password */}
      <div>
        {/* Applied dark mode label text color */}
        <label className={`block text-sm font-medium ${textLabel} mb-1`}>Current Password</label>
        {/* Applied dark mode styles and focus ring */}
        <div className={`flex items-center border ${inputBorder} rounded-md px-3 py-2 ${focusRing} ${inputBg}`}>
          {/* Applied dark mode icon color */}
          <Lock className={`h-4 w-4 ${textLight} mr-2`} />
          <input
            // Applied dark mode text and placeholder color
            className={`flex-1 outline-none text-sm ${textDark} placeholder-gray-400 dark:placeholder-gray-500 ${inputBg}`}
            type={showCurrentPassword ? "text" : "password"}
            value={passwordInfo.currentPassword}
            onChange={(e) => setPasswordInfo({ ...passwordInfo, currentPassword: e.target.value })}
            placeholder="Enter current password"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            // Applied dark mode button/icon colors
            className={`ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400`}
          >
            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        {/* Applied dark mode label text color */}
        <label className={`block text-sm font-medium ${textLabel} mb-1`}>New Password</label>
        {/* Applied dark mode styles and focus ring */}
        <div className={`flex items-center border ${inputBorder} rounded-md px-3 py-2 ${focusRing} ${inputBg}`}>
          {/* Applied dark mode icon color */}
          <Lock className={`h-4 w-4 ${textLight} mr-2`} />
          <input
            // Applied dark mode text and placeholder color
            className={`flex-1 outline-none text-sm ${textDark} placeholder-gray-400 dark:placeholder-gray-500 ${inputBg}`}
            type={showNewPassword ? "text" : "password"}
            value={passwordInfo.newPassword}
            onChange={(e) => setPasswordInfo({ ...passwordInfo, newPassword: e.target.value })}
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            // Applied dark mode button/icon colors
            className={`ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400`}
          >
            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        {/* Applied dark mode label text color */}
        <label className={`block text-sm font-medium ${textLabel} mb-1`}>Confirm New Password</label>
        <Input
          icon={Lock}
          type="password"
          value={passwordInfo.confirmPassword}
          onChange={(e) => setPasswordInfo({ ...passwordInfo, confirmPassword: e.target.value })}
          placeholder="Confirm new password"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button onClick={handlePasswordReset} className="flex-1 cursor-pointer">
          Reset Password
        </Button>
      </div>
    </div>
  );

  return (
    // Applied dark mode background to main container
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Settings Menu */}
              <div className="lg:col-span-1">
                <Card>
                  <div className="p-0 cursor-pointer">
                    <MenuItem
                      icon={User}
                      label="Personal Information"
                      isActive={activeSection === "personal"}
                      onClick={() => setActiveSection("personal")}
                    />
                    <MenuItem
                      icon={Lock}
                      label="Login & Password"
                      isActive={activeSection === "password"}
                      onClick={() => setActiveSection("password")}
                    />
                    {/* Applied dark mode text color to Logout button for consistency */}
                    <MenuItem
                      icon={LogOut}
                      label="Logout"
                      onClick={handleLogout}
                    />
                  </div>
                </Card>
              </div>

              {/* Settings Content */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {activeSection === "personal"
                        ? "Personal Information"
                        : activeSection === "password"
                        ? "Login & Password"
                        : ""}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activeSection === "personal"
                      ? renderPersonalInformation()
                      : activeSection === "password"
                      ? renderLoginPassword()
                      : null}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}