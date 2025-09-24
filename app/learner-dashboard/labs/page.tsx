"use client";

import React, { useState } from "react";
import { FlaskConical, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";

// Reusable Card
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white rounded-xl shadow-md border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
    {icon}
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
  </div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4">{children}</div>
);

export default function LabGuidesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Example lab guides (later → fetch dynamically)
  const labs = [
    {
      id: 1,
      title: "Phishing Email Analysis",
      difficulty: "Beginner",
      time: "15 min",
      xp: 100,
      status: "completed",
    },
    {
      id: 2,
      title: "Password Cracking Demo",
      difficulty: "Intermediate",
      time: "20 min",
      xp: 150,
      status: "in-progress",
    },
    {
      id: 3,
      title: "SQL Injection Basics",
      difficulty: "Intermediate",
      time: "25 min",
      xp: 200,
      status: "not-started",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Safety & Ethics callout per PRD */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Labs must be performed on your own local virtual machine. Do not target external systems.
              Use these materials responsibly and ethically.
            </p>
          </div>
          <Card>
            <CardHeader
              title="Lab Guides"
              icon={<FlaskConical className="h-5 w-5 text-[#72a210]" />}
            />
            <CardContent>
              <div className="space-y-4">
                {labs.map((lab) => (
                  <div
                    key={lab.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    {/* Left section */}
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {lab.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {lab.difficulty} • {lab.time} • {lab.xp} XP
                      </p>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-3">
                      {lab.status === "completed" && (
                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                          <CheckCircle2 className="h-4 w-4" /> Completed
                        </span>
                      )}
                      {lab.status === "in-progress" && (
                        <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
                          <Clock className="h-4 w-4" /> In Progress
                        </span>
                      )}

{lab.status === "not-started" && (
<Link href={`/learner-dashboard/labs/${lab.id}`}>
    <button className="flex items-center gap-1 px-3 py-1.5 bg-[#72a210] text-white text-sm rounded-lg hover:bg-[#5a850d] transition cursor-pointer">
      <PlayCircle className="h-4 w-4" /> Start
    </button>
  </Link>
)}

                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
