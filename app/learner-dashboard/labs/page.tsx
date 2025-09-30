"use client";

import React, { useEffect, useState } from "react";
import {
  FlaskConical,
  CheckCircle2,
  Clock,
  PlayCircle,
} from "lucide-react";
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
  <div
    className={`bg-white rounded-xl shadow-md border border-gray-200 ${className}`}
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
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLabs() {
      try {
        const res = await fetch("/api/lab-guides", { cache: "no-store" });
        const json = await res.json().catch(() => ({}));
        // API returns { data: LabGuide[] } on success, or { data: [], error } on failure
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
          {/* Safety & Ethics callout */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Labs must be performed on your{" "}
              <strong>own local virtual machine</strong>. Do not target external
              systems. Use these guides responsibly and ethically.
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
                <p className="text-sm text-gray-500">Loading labs...</p>
              ) : error ? (
                <p className="text-sm text-red-600">Error: {error}</p>
              ) : labs.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No lab guides available yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {labs.map((lab) => (
                    <div
                      key={lab.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      {/* Left section */}
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {lab.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {lab.description || "No description provided"}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
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
                        {!lab.status && (
                          <span className="flex items-center gap-1 text-gray-500 text-sm font-medium">
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
      </div>
    </div>
  );
}
