"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Sidebar from "@/components/learner-sidebar";
import Header from "@/components/learner-header";
import Nav from "@/components/learner-nav";
import { getCurrentUser } from "@/lib/api/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, AtSign } from "lucide-react"; // Removed Camera icon

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#507800"; // This constant is now unused but kept for integrity

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  // const [uploading, setUploading] = useState(false); // Removed state
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    username: "",
    role: "Learner",
    createdAt: "",
    lastLogin: "",
  });

  // ✅ Fetch user data from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        const userData = res?.data || res;
        setProfile({
          fullName: userData?.username || "",
          email: userData?.email || "",
          username: userData?.username || "",
          role: userData?.roles?.[0] || "Learner",
          createdAt: userData?.createdAt || "",
          lastLogin: "",
        });
        // Set profile image if it exists in the response
        if (userData?.profileImage) {
          setProfileImage(userData.profileImage);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Removed handleImageUpload function entirely

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
                ? `Hi, ${profile.username}`
                : "Your Profile"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your personal information and account details
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture */}
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    Profile Picture
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Your current profile photo
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
                    </div>
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
                        Your personal account details
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Username (read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profile.username}
                          disabled
                          className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Email (read-only) */}
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