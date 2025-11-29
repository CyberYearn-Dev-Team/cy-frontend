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
import Nav from "@/components/ui/learner-nav";
import LearnerFooter from "@/components/ui/learner-footer";

// --- Helper Function for Description Truncation ---
const truncateDescription = (text: string | null | undefined, maxLength: number = 100) => {
  if (!text) return "No description provided";
  // Strip potential HTML tags like <p> if present
  const plainText = text.replace(/<[^>]*>/g, '').trim(); 
  if (plainText.length <= maxLength) {
    return plainText;
  }
  // Find the last space before the limit to avoid cutting a word
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace === -1 || lastSpace < maxLength * 0.8) {
    // If no space or space is too early, just cut
    return truncated + '...'; 
  }
  
  return truncated.substring(0, lastSpace) + '...';
};


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

  // --- API Fetching Logic (Intact) ---
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
  // ------------------------------------

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
                    Loading labs Guides...
                  </p>
                ) : labs.length === 0 ? (
                  // Empty state
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
                  // Applied 2-2 grid structure
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {labs.map((lab) => (
                      <div
                        key={lab.id}
                        // Added h-full to make card heights equal in the grid
                        className="flex flex-col p-4 border rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer h-full"
                      >
                        {/* Left section - Lab Info (Takes available space) */}
                        <div className="mb-4 flex-grow">
                          {/* Title - KEEP CODE INTACT */}
                          <h3 className="text-base mb-2 font-semibold text-gray-900 dark:text-gray-100">
                            {lab.title}
                          </h3>
                          {/* Applied Truncation */}
                          <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
                            {truncateDescription(lab.description, 300)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            • <span className="font-semibold uppercase">{lab.levels}</span> •
                          </p>
                        </div>



                        {/* Right section - Status and Button (Updated for mobile full-width) */}
                        <div 
                          // flex-col-reverse (button on bottom on mobile), w-full on mobile, sm:flex-row to return to row on medium+
                          className="flex flex-col w-full sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 ml-auto"
                        >
                          {/* Status Display - Status appears above button on mobile */}
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
                            // Not Started status
                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm font-medium">
                              <Clock className="h-4 w-4" /> Not Started
                            </span>
                          )}
                          
                          {/* Start Button - w-full on mobile */}
                          <Link href={`/learner-dashboard/labs/${lab.id}`} className="w-full sm:w-auto">
                            <button className="flex items-center justify-center w-full gap-1 px-4 sm:px-8 py-2.5 bg-[#72a210] text-white text-base rounded-lg hover:bg-[#5a850d] transition cursor-pointer">
                              Start Lab Guide
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

          {/* Navigation */}
          <Nav />

          {/* Footer */}
          <LearnerFooter />
        </div>
      </div>
    </div>
  );
}