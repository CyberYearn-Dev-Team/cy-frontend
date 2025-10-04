"use client";

import React, { useEffect, useState } from "react";
import {
  FlaskConical,
  CheckCircle2,
  Clock,
  PlayCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import LearnerFooter from "@/components/ui/learner-footer";

// Reusable Card
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) => (
  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
    {icon}
    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
      {title}
    </h2>
  </div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4">{children}</div>
);

export default function LabGuidesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLabs() {
      try {
        const res = await fetch("/api/lab-guides", { cache: "no-store" });
        const json = await res.json().catch(() => ({}));
        if (res.ok) {
          setLabs(Array.isArray(json?.data) ? json.data : []);
        } else {
          setError(json?.error || `Failed to load labs: ${res.status}`);
          setLabs(Array.isArray(json?.data) ? json.data : []);
        }
      } catch (err) {
        console.error("Failed to load lab guides", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    loadLabs();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
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
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Safety & Ethics callout */}
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Labs must be performed on your{" "}
                <strong>own local virtual machine</strong>. Do not target
                external systems. Use these guides responsibly and ethically.
              </p>
            </div>

            {/* Lab Guides List */}
            <Card>
              <CardHeader
                title="Lab Guides"
                icon={<FlaskConical className="h-5 w-5 text-[#72a210]" />}
              />
              <CardContent>
                {loading ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading labs...
                  </p>
                ) : labs.length === 0 ? (
                  // ✅ Empty state
                  <div className="text-center py-20 bg-white dark:bg-gray-900 border rounded-lg shadow-sm border-gray-200 dark:border-gray-700">
                    <FileText className="mx-auto h-20 w-20 text-[#72a210] mb-4" />
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      No Lab Guides Yet
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 px-4">
                      Your instructors haven’t published any labs. Please check
                      back later.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {labs.map((lab) => (
                      <div
                        key={lab.id}
                        className="flex items-center justify-between p-4 border rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        {/* Left section */}
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {lab.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {lab.description || "No description provided"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {lab.difficulty} • {lab.time} • {lab.xp} XP
                          </p>
                        </div>

                        {/* Right section */}
                        <div className="flex items-center gap-3">
                          {lab.status === "completed" && (
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                              <CheckCircle2 className="h-4 w-4" /> Completed
                            </span>
                          )}
                          {lab.status === "in-progress" && (
                            <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                              <Clock className="h-4 w-4" /> In Progress
                            </span>
                          )}
                          {!lab.status && (
                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm font-medium">
                              <Clock className="h-4 w-4" /> Not Started
                            </span>
                          )}

                          <Link href={`/learner-dashboard/labs/${lab.id}`}>
                            <button className="flex items-center gap-1 px-8 py-2.5 bg-[#72a210] text-white text-lg rounded-lg hover:bg-[#5a850d] transition cursor-pointer">
                              <PlayCircle className="h-4 w-4" /> Start
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </main>

          {/* Footer */}
          <LearnerFooter />
        </div>
      </div>
    </div>
  );
}
