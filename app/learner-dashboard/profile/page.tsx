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
} from "lucide-react";

// Theme Constants from stored code
const primary = "#72a210";
const primaryDarker = "#507800";

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    username: "",
    role: "Learner",
    createdAt: "",
    lastLogin: "",
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
        console.error("Failed to load user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setProfileImage(dataUrl);
      console.log("🖼️ Uploaded avatar (dummy):", dataUrl);
      toast.success("Profile photo updated (mock)");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    try {
      console.log("Saving profile (dummy):", profile);
      toast.success("Profile saved successfully (mock)");
    } catch (err) {
      toast.error("Failed to save profile");
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
              {loading
                ? "Loading..."
                : profile.username
                ? `Welcome, ${profile.username}! 👋`
                : "Your Profile"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your personal information and account details
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture + Status */}
            <div className="lg:col-span-1">
              {/* Profile Picture Card */}
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
                      <div className={`w-32 h-32 rounded-full bg-[${primary}] flex items-center justify-center text-white text-4xl font-bold overflow-hidden`}>
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

              
            </div>

            {/* Basic Info */}
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                      <User className={`w-5 h-5 text-[${primary}]`} />
                    </div>
                    <div>
                      <CardTitle className="text-gray-900 dark:text-gray-100">
                        Basic Information
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Update your personal account details
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
                          placeholder="username"
                          className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[${primary}] focus:border-transparent text-gray-900 dark:text-gray-100 transition`}
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
                          placeholder="Enter your full name"
                          className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[${primary}] focus:border-transparent text-gray-900 dark:text-gray-100 transition`}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
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

                    {/* Save Button */}
                    <div className="flex items-center gap-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className={`flex items-center justify-center gap-2 px-6 py-3 bg-[${primary}] hover:bg-[${primaryDarker}] text-white rounded-lg font-semibold transition shadow-lg hover:shadow-xl cursor-pointer`}
                      >
                        <Save className="w-5 h-5" />
                        Save Changes
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