"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/services/authService";
import Sidebar from "@/components/learner-sidebar";
import Header from "@/components/learner-header";
import Nav from "@/components/learner-nav";
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
  const [isUsernameModified, setIsUsernameModified] = useState(false);
  const [originalUsername, setOriginalUsername] = useState("");

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
        const username = u?.username || "";
        setOriginalUsername(username);
        setProfile({
          email: u?.email || "",
          username: username,
          roles: u?.roles || [],
          createdAt: u?.createdAt || "",
          lastLogin: u?.lastLogin || "",
          profileImage: u?.profileImage || "",
        });
        // Set the profile image state if available
        if (u?.profileImage) {
          setProfileImage(u.profileImage);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        toast.error("Unable to load user info");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);


  const handleUpdateUsername = async () => {
    if (!profile.username) {
      toast.error("Username cannot be empty");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Updating username...");

    try {
      const updateRes = await fetch(
        "https://cy-backend.onrender.com/api/v1/me/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: profile.username,
          }),
        }
      );

      const updateData = await updateRes.json();

      if (!updateRes.ok) {
        throw new Error(
          updateData.message ||
            updateData.error ||
            "Failed to update username"
        );
      }

      setOriginalUsername(profile.username);
      setIsUsernameModified(false);
      toast.success("Username updated successfully!");
    } catch (err: any) {
      console.error("Username update failed:", err);
      toast.error(err.message || "Failed to update username");
      throw err;
    } finally {
      toast.dismiss(toastId);
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    let toastId: string | number = "";

    try {
      // PASSWORD CHANGE LOGIC
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

      toastId = toast.loading("Updating your password...");
      console.log("Attempting to change password...");

      try {
        await changePassword(
          passwords.currentPassword,
          passwords.newPassword
        );

        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        toast.success("Password updated successfully!");
        console.log("Password updated successfully");
      } catch (error: any) {
        console.error("Password change failed:", error);
        toast.error(
          error.message ||
            "Failed to update password. Please try again."
        );
        throw error;
      } finally {
        if (toastId) toast.dismiss(toastId);
      }

    // Handle profile image upload if needed
    if (profileImage) {
      const toastId = toast.loading("Uploading profile image...");
      
      try {
        const imageFormData = new FormData();
        let finalImageUrl = profileImage;

        if (typeof profileImage === "string") {
          const imgRes = await fetch(profileImage);
          const blob = await imgRes.blob();
          const file = new File([blob], "profile-image.jpg", {
            type: "image/jpeg",
          });
          imageFormData.append("file", file);
        } else {
          imageFormData.append("file", profileImage);
        }

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.url) {
          throw new Error(uploadData.error || "Failed to upload image");
        }

        finalImageUrl = uploadData.url;

        // Update profile with new image
        const updateRes = await fetch(
          "https://cy-backend.onrender.com/api/v1/me/update",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              profileImage: finalImageUrl,
            }),
          }
        );

        const updateData = await updateRes.json();

        if (!updateRes.ok) {
          throw new Error(
            updateData.message ||
              updateData.error ||
              "Failed to update profile image"
          );
        }

        setProfile(prev => ({ ...prev, profileImage: finalImageUrl }));
        toast.success("Profile image updated successfully!");
      } catch (err: any) {
        console.error("Profile image update failed:", err);
        toast.error(err.message || "Failed to update profile image");
        throw err;
      } finally {
        toast.dismiss(toastId);
      }
    }
  } catch (err: any) {
    console.error("Save error:", err);

    let errorMessage = err.message || "Failed to save changes";

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

    const toastId = toast.loading("Uploading image...");
    
    try {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size should be less than 5MB");
      }

      // Check file type
      if (!file.type.match('image.*')) {
        throw new Error("Only image files are allowed");
      }

      const formData = new FormData();
      formData.append("file", file);

      // Upload the image
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || "Failed to upload image");
      }

      // Update profile with new image URL
      const updateRes = await fetch(
        "https://cy-backend.onrender.com/api/v1/me/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            profileImage: uploadData.url,
          }),
        }
      );

      const updateData = await updateRes.json();

      if (!updateRes.ok) {
        throw new Error(
          updateData.message ||
          updateData.error ||
          "Failed to update profile image"
        );
      }

      // Update both the profile and profileImage states
      setProfile(prev => ({ ...prev, profileImage: uploadData.url }));
      setProfileImage(uploadData.url);
      
      toast.success("Profile picture updated successfully!", { id: toastId });
    } catch (err: any) {
      console.error("Profile image update failed:", err);
      toast.error(err.message || "Failed to update profile image", { id: toastId });
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
                      <div className="relative flex items-center gap-2">
                        <div className="relative flex-1">
                          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={profile.username}
                            onChange={(e) => {
                              const newUsername = e.target.value;
                              setProfile({ ...profile, username: newUsername });
                              setIsUsernameModified(newUsername !== originalUsername);
                            }}
                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[${primary}] text-gray-900 dark:text-gray-100 transition`}
                          />
                        </div>
                        {isUsernameModified && (
                          <button
                            onClick={handleUpdateUsername}
                            disabled={saving}
                            className={`px-4 py-3 bg-[${primary}] hover:bg-[${primaryDarker}] text-white rounded-lg font-medium text-sm transition whitespace-nowrap ${saving ? 'opacity-60 cursor-not-allowed cursor-pointer ' : 'cursor-pointer'}`}
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                        )}
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

                    {/* Save Password Button */}
                    <div className="flex items-center gap-3 pt-6">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving || (!passwords.currentPassword && !passwords.newPassword && !passwords.confirmPassword)}
                        className={`flex items-center justify-center gap-2 px-6 py-3 bg-[${primary}] hover:bg-[${primaryDarker}] text-white rounded-lg font-semibold transition shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer`}
                      >
                        <Save className="w-5 h-5" />
                        {saving ? "Saving..." : "Update Password"}
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
