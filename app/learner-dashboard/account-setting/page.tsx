"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import Nav from "@/components/ui/learner-nav";
import { getCurrentUser } from "@/lib/api/auth";
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
} from "lucide-react";

// Theme Colors
const primary = "#72a210";
const primaryDarker = "#507800";

export default function AccountSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    username: "",
    role: "Learner",
    createdAt: "",
    lastLogin: "",
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
          fullName: `${u?.firstName || ""} ${u?.lastName || ""}`.trim(),
          email: u?.email || "",
          username: u?.username || "",
          role: u?.role || "Learner",
          createdAt: u?.createdAt || "",
          lastLogin: u?.lastLogin || "",
        });
      } catch (err) {
        console.error("❌ Failed to load user:", err);
        toast.error("Unable to load user info");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setProfileImage(dataUrl);
      toast.success("Profile photo updated (mock)");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      console.log("Saving profile:", profile);
      console.log("Updating password:", passwords);
      toast.success("Profile updated successfully (mock)");
    } catch (err) {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
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
                            {profile.fullName
                              ? profile.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
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
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-5 h-5 text-[${primary}]`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Email Verified
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
                      {profile.role}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Member Since
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 ml-6">
                      {profile.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Last Login
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 ml-6">
                      {profile.lastLogin
                        ? new Date(profile.lastLogin).toLocaleString()
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

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={(e) =>
                            setProfile({ ...profile, fullName: e.target.value })
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
                            type="password"
                            value={passwords.currentPassword}
                            onChange={(e) =>
                              setPasswords({
                                ...passwords,
                                currentPassword: e.target.value,
                              })
                            }
                            placeholder="Enter current password"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[${primary}] text-gray-900 dark:text-gray-100 transition`}
                          />
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
                            type="password"
                            value={passwords.newPassword}
                            onChange={(e) =>
                              setPasswords({
                                ...passwords,
                                newPassword: e.target.value,
                              })
                            }
                            placeholder="Enter new password"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[${primary}] text-gray-900 dark:text-gray-100 transition`}
                          />
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
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={(e) =>
                              setPasswords({
                                ...passwords,
                                confirmPassword: e.target.value,
                              })
                            }
                            placeholder="Confirm new password"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[${primary}] text-gray-900 dark:text-gray-100 transition`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center gap-3 pt-6">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className={`flex items-center justify-center gap-2 px-6 py-3 bg-[${primary}] hover:bg-[${primaryDarker}] text-white rounded-lg font-semibold transition shadow-lg hover:shadow-xl disabled:opacity-60`}
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
