"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Sidebar from "@/components/learner-sidebar";
import Header from "@/components/learner-header";
import Nav from "@/components/learner-nav";
import { getCurrentUser } from "@/lib/services/authService";
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
  Download,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle,
  Shield,
  Calendar,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

// Theme Constants
const primary = "#72a210";

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  // ✅ Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        const userData = res?.data || res;
        setProfile({
          email: userData?.email || "",
          username: userData?.username || "",
          roles: userData?.roles || [],
          createdAt: userData?.createdAt || "",
          lastLogin: userData?.lastLogin || "",
          profileImage: userData?.profileImage || "",
        });
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

  // ✅ Handle Data Export
  const handleExportData = async () => {
    setExporting(true);
    // Simulate API call
    setTimeout(() => {
      setExporting(false);
      toast.success(
        "Your data export has started. You will receive an email shortly."
      );
    }, 2000);
  };

  // ✅ Handle Account Deletion
  const handleDeleteAccount = async () => {
    setDeleting(true);
    // Simulate API call
    setTimeout(() => {
      setDeleting(false);
      toast.error("Account deleted successfully.");
      // Logic for redirecting to logout/home would go here
    }, 2000);
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
                ? `Hi, ${profile.username}`
                : "Your Profile"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your personal information and account details
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture */}
            <div className="lg:col-span-1 space-y-6">
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
                        className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold overflow-hidden"
                        style={{ backgroundColor: primary }}
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

            {/* Basic Info & Privacy Controls */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5" style={{ color: primary }} />
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

              {/* SECTION 1: DATA EXPORT */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    Data Export
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Request a copy of all your personal data, progress, and
                    account history.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleExportData}
                    disabled={exporting}
                    className="flex items-center gap-2 text-white cursor-pointer"
                    style={{ backgroundColor: primary }}
                  >
                    {exporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {exporting ? "Exporting..." : "Export my data"}
                  </Button>
                </CardContent>
              </Card>

              {/* SECTION 2: ACCOUNT DELETION */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-500 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Permanently delete your account and all associated data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete my account
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="bg-white dark:bg-gray-900">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                          This action is <strong>irreversible</strong>. Deleting
                          your account will remove all your progress,
                          certificates, and personal data from our systems.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        >
                          {deleting ? "Deleting..." : "Yes, delete my account"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
