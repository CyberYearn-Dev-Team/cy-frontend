"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Sidebar from "@/components/learner-sidebar";
import Header from "@/components/learner-header";
import Nav from "@/components/learner-nav";
import { getCurrentUser } from "@/lib/api/auth";
import { changePassword } from "@/lib/services/authService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Mail,
  AtSign,
  Camera,
  Save,
  Calendar,
  Clock,
  CheckCircle,
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";

// Theme Colors
const primary = "#72a210";
const primaryDarker = "#507800";

export default function AccountSettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  interface UserProfile {
    email: string;
    username: string;
    roles: string[];
    createdAt: string;
    lastLogin: string;
    profileImage?: string;
  }

  const [profile, setProfile] = useState<UserProfile>({
    email: "",
    username: "",
    roles: [],
    createdAt: "",
    lastLogin: "",
    profileImage: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        const u = res?.data || res;
        setProfile({
          email: u?.email || "",
          username: u?.username || "",
          roles: u?.roles || [], // <-- FIX HERE
          createdAt: u?.createdAt || "",
          lastLogin: u?.lastLogin || "",
        });
      } catch (err) {
        console.error("Failed to load user:", err);
        toast.error("Unable to load user info");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);


  const handleSaveProfile = async () => {
    setSaving(true);
    let toastId: string | number = '';

    try {
      // Check if we're trying to change the password
      const isPasswordChangeAttempt = 
        passwords.currentPassword ||
        passwords.newPassword ||
        passwords.confirmPassword;

      if (isPasswordChangeAttempt) {
        // Validate passwords
        if (!passwords.currentPassword) {
          throw new Error("Please enter your current password");
        }

        if (!passwords.newPassword) {
          throw new Error("Please enter a new password");
        }

        if (passwords.newPassword.length < 8) {
          throw new Error("New password must be at least 8 characters long");
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
          throw new Error("New passwords do not match");
        }

        // Show loading state
        toastId = toast.loading("Updating your password...");
        console.log('Attempting to change password...');

        try {
          // Call the password change API
          await changePassword(
            passwords.currentPassword,
            passwords.newPassword
          );

          // Clear password fields on success
          setPasswords({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });

          // Show success message
          toast.success("Password updated successfully!");
          console.log('Password updated successfully');
          
        } catch (error: any) {
          // Show error message from the API or validation
          console.error('Password change failed:', error);
          toast.error(error.message || 'Failed to update password. Please try again.');
          // Re-throw to be caught by the outer catch block
          throw error;
        } finally {
          // Dismiss the loading toast if it was created
          if (toastId) {
            toast.dismiss(toastId);
          }
        }
      }

      // Only proceed with profile update if there are changes (other than password)
      const hasProfileChanges = Object.keys(profile).some(
        (key) => profile[key as keyof typeof profile] !== ""
      );

      if (hasProfileChanges || profileImage) {
        const toastId = toast.loading("Updating profile...");

        try {
          // First check if we need to update the profile image
          if (profileImage) {
            const imageFormData = new FormData();
            // Convert profileImage URL to blob if it's not already a File object
            if (typeof profileImage === "string") {
              const imageResponse = await fetch(profileImage);
              const blob = await imageResponse.blob();
              const file = new File([blob], "profile-image.jpg", {
                type: "image/jpeg",
              });
              imageFormData.append("file", file);
            } else {
              imageFormData.append("file", profileImage);
            }

            // Upload the image first
            const uploadRes = await fetch("/api/upload", {
              method: "POST",
              body: imageFormData,
            });

            const uploadData = await uploadRes.json();

            if (!uploadRes.ok || !uploadData.url) {
              throw new Error(uploadData.error || "Failed to upload image");
            }

            // Update profile with the new image URL
            profile.profileImage = uploadData.url;
          }

          // Update user profile with the backend
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("cy_token")
              : null;
          if (!token) {
            throw new Error("Authentication required. Please log in again.");
          }

          // Debug: Log the request details
          console.log('Sending PATCH request to update profile with token:', token ? 'Token exists' : 'No token');
          
          try {
            console.log('Fetching user profile data...');
            
            const response = await fetch(
              "https://cy-backend.onrender.com/api/v1/me",
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                  "Accept": "application/json",
                },
                credentials: "include"
              }
            );
            
            // Log response status and headers for debugging
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
            
            // Handle response safely
            const responseText = await response.text();
            let data;
            try {
              data = responseText ? JSON.parse(responseText) : {};
              
              if (!response.ok) {
                const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`;
                console.error('Server responded with error:', errorMessage);
                throw new Error(errorMessage);
              }
              
              return data;
            } catch (parseError) {
              console.error('Failed to parse response:', responseText);
              throw new Error('Invalid server response');
            }
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            const errorName = error instanceof Error ? error.name : 'UnknownError';
            
            console.error('Fetch error:', {
              name: errorName,
              message: errorMessage,
              stack: error instanceof Error ? error.stack : undefined,
              type: typeof error,
            });
            
            // Check for specific error types
            if (errorName === 'TypeError' && errorMessage === 'Failed to fetch') {
              throw new Error('Failed to connect to the server. Please check your internet connection and try again.');
            }
            
            if (errorName === 'TypeError' && errorMessage.includes('NetworkError')) {
              throw new Error('Network error. Please check your connection and try again.');
            }
            
            throw new Error(errorMessage);
          }

          // If we get here, the request was successful
          toast.success("Profile updated successfully!");
        } catch (err: any) {
          console.error("Profile update failed:", err);
          throw err; // Re-throw to be caught by the outer catch block
        } finally {
          toast.dismiss(toastId);
        }
      }
    } catch (err: any) {
      console.error("Save error:", err);
      // Show more specific error messages based on error type
      let errorMessage = err.message || "Failed to save changes";

      // Handle network errors
      if (errorMessage.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your connection.";
      }

      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      toast.loading("Uploading image...");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Upload failed");
        return;
      }

      setProfileImage(data.url);
      toast.success("Profile photo uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Error uploading image");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Account Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your profile and password
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column — Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Picture */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    Profile Picture
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Upload your profile photo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div
                        className={`w-32 h-32 rounded-full bg-[${primary}] flex items-center justify-center text-white text-4xl font-bold overflow-hidden`}
                      >
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {profile.username
                              ? profile.username[0].toUpperCase()
                              : "U"}
                          </span>
                        )}
                      </div>
                      <label
                        htmlFor="profile-upload"
                        className={`absolute bottom-0 right-0 w-10 h-10 bg-[${primary}] hover:bg-[${primaryDarker}] rounded-full flex items-center justify-center cursor-pointer shadow-lg transition`}
                      >
                        <Camera className="w-5 h-5 text-white" />
                        <input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      Click the camera icon to upload a new photo
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 text-[${primary}]`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        User Email
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                      Verified
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Shield className={`w-5 h-5 text-[${primary}]`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Account Type
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                      {profile.roles?.length > 0
                        ? profile.roles.join(", ")
                        : "No roles"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className={`w-5 h-5 text-[${primary}]`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Member Since
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 ml-6">
                      {profile.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column — Editable Info */}
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                      <User className={`w-5 h-5 text-[${primary}]`} />
                    </div>
                    <div>
                      <CardTitle className="text-gray-900 dark:text-gray-100">
                        Account Details
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Update your personal info and password
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profile.username}
                          onChange={(e) =>
                            setProfile({ ...profile, username: e.target.value })
                          }
                          className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[${primary}] text-gray-900 dark:text-gray-100 transition`}
                        />
                      </div>
                    </div>

                    {/* Email (read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={profile.email}
                          disabled
                          className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Password Section */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-gray-500" />
                        Change Password
                      </h3>

                      {/* Current Password */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            value={passwords.currentPassword}
                            onChange={(e) =>
                              setPasswords({ ...passwords, currentPassword: e.target.value })
                            }
                            className={`w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[${primary}] text-gray-900 dark:text-gray-100 transition`}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={passwords.newPassword}
                            onChange={(e) =>
                              setPasswords({ ...passwords, newPassword: e.target.value })
                            }
                            className={`w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[${primary}] text-gray-900 dark:text-gray-100 transition`}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={passwords.confirmPassword}
                            onChange={(e) =>
                              setPasswords({ ...passwords, confirmPassword: e.target.value })
                            }
                            className={`w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[${primary}] text-gray-900 dark:text-gray-100 transition`}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center gap-3 pt-6">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className={`flex items-center justify-center gap-2 px-6 py-3 bg-[${primary}] hover:bg-[${primaryDarker}] text-white rounded-lg font-semibold transition shadow-lg hover:shadow-xl disabled:opacity-60 cursor-pointer`}
                      >
                        <Save className="w-5 h-5" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Nav />
      </div>
    </div>
  );
}
