"use client";

import React from "react";
import { User, Mail, Calendar, Edit3 } from "lucide-react";

import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";

// Reusable Card components from your dashboard
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-md border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-gray-200">{children}</div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

const Button = ({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors 
      bg-[#72a210] hover:bg-[#507800] text-white focus:outline-none focus:ring-2 focus:ring-[#72a210] focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
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
          {/* Profile Information */}
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar + Basic Info */}
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">Alex Chen</p>
                  <p className="text-sm text-gray-600">Learner</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-700">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  alex.chen@email.com
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  Joined: January 2025
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <Button className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" /> Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
