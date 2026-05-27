"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, Moon, Sun, Camera } from "lucide-react";
import { getCurrentUser } from "@/lib/api/auth";
import { updateUserProfile } from "@/lib/services/userService";
import { toast } from "sonner";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminHeader({ setSidebarOpen }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        // Set profile image if available
        if (userData?.data?.profileImage || userData?.profileImage) {
          setProfileImage(userData.data?.profileImage || userData.profileImage);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Theme toggle handler
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
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

      // Update profile with new image URL using the centralized service
      const updateData = await updateUserProfile({
        profileImage: uploadData.url,
      });

if (!updateData.success) {
        throw new Error(
          updateData.message ||
          updateData.error ||
          "Failed to update profile image"
        );
      }

      // Update both the profile and profileImage states
      setProfileImage(uploadData.url);
      setUser((prev: any) => ({
        ...prev,
        data: {
          ...prev?.data,
          profileImage: uploadData.url
        },
        profileImage: uploadData.url
      }));
      
      toast.success("Profile picture updated successfully!", { id: toastId });
    } catch (err: any) {
      console.error("Profile image update failed:", err);
      toast.error(err.message || "Failed to update profile image", { id: toastId });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="sticky top-0 z-20 flex items-center h-16 px-3 lg:px-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="flex w-full items-center justify-between">
        {/* Mobile sidebar toggle */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Admin Panel title */}
        {/* <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 hidden sm:block">
          Admin Panel
        </h1> */}

        {/* Right side controls */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-white cursor-pointer" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 cursor-pointer" />
            )}
          </button>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          
          {/* User Avatar & Name */}
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold tracking-tight leading-none text-gray-900 dark:text-gray-100">
                {loading
                  ? "Loading..."
                  : user?.data?.username ||
                    user?.username ||
                    "Admin"}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-normal tracking-tighter mt-1 truncate max-w-[140px]">
                {loading ? "" : user?.data?.email || user?.email || ""}
              </p>
            </div>
            <div className="relative group">
              <div className="w-10 h-10 bg-[#72a210] rounded-xl flex items-center justify-center text-white font-semibold text-[18px] overflow-hidden">
                {loading ? (
                  "..."
                ) : profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (user?.data?.email || user?.email)?.charAt(0).toUpperCase() || "A"
                )}
              </div>
              <button
                onClick={triggerFileInput}
                className="absolute -bottom-1 cursor-pointer -right-1 w-3 h-3 bg-[#72a210] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Change profile picture"
              >
                <Camera className="w-2 h-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
