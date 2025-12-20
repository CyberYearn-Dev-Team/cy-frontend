"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { FileText, Clapperboard } from "lucide-react";
import Sidebar from "@/components/learner-sidebar";
import Nav from "@/components/learner-nav";
import Header from "@/components/learner-header";
import TechnicalIssuePopup from "@/components/ui/technical-issue-popup";
import { LabDetailSkeleton } from "@/components/ui/LabDetailSkeleton";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import Link from "next/link";
import { toast } from "sonner";

// Theme constants
const primary = "#72a210";
const bgLight = "bg-gray-100 dark:bg-gray-950";
const cardBg = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-300";
const textLight = "text-gray-500 dark:text-gray-400";

// Convert Directus file object to public URL
const getFileUrl = (file: any) => {
  if (!file) return null;
  const directusUrl =
    process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";
  return `${directusUrl}/assets/${file.id}`;
};

interface LabDetail {
  id: number;
  title: string;
  description?: string | null;
  levels: string;
  time: string;
  xp: number;
  video?: string | null;
  pdf?: string | null;
  steps?: {
    text: string;
    title: string;
  }[];
  status: "completed" | "in-progress" | "not-started";
}

export default function LabDetailPage() {
  const params = useParams();
  const labId = params?.id as string;

  const [lab, setLab] = useState<LabDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ REQUIRED: step completion state
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [issuePopupOpen, setIssuePopupOpen] = useState(false);

  useEffect(() => {
    async function fetchLab() {
      try {
        const res = await fetch(`/api/lab-guides/${labId}`, {
          cache: "no-store",
        });
        const json = await res.json();

        if (!res.ok) throw new Error(json?.error || "Failed to load lab");

        setLab({
          id: json.data.id,
          title: json.data.title,
          description: json.data.description,
          levels: json.data.levels,
          time: json.data.time,
          xp: json.data.xp,
          video: json.data.video ? getFileUrl(json.data.video) : undefined,
          pdf: json.data.pdf ? getFileUrl(json.data.pdf) : undefined,
          steps: json.data.steps?.map((s: any) => ({
            title: s.lab_guide_steps_id?.title || "Untitled Step",
            text: s.lab_guide_steps_id?.text || "",
          })) || [],
          status: "not-started",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    if (labId) fetchLab();
  }, [labId]);

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-30">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/learner-dashboard/labs">Labs</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {lab ? lab.title : "Loading..."}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* REQUIRED: Safety Banner */}
          <div className="bg-yellow-50 mb-5 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This lab is for <strong>educational purposes only</strong>. Do not
              run commands on production systems or systems you do not own.
              Proceed carefully.
            </p>
          </div>

          {loading && <LabDetailSkeleton />}
          {error && <div className="p-8 text-red-600">{error}</div>}

          {lab && (
            <>
              <div className={`${cardBg} shadow rounded-lg p-6 mb-6`}>
                <h1 className={`text-2xl font-bold ${textDark}`}>
                  {lab.title}
                </h1>

                {lab.description ? (
                  <div
                    className="prose max-w-none mt-4 dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: lab.description }}
                  />
                ) : (
                  <div className={textLight}>No description available</div>
                )}
              </div>

              {/* ✅ REQUIRED: Step-Based Structure + Checkpoints */}
              {lab.steps && lab.steps.length > 0 && (
                <div className={`${cardBg} shadow rounded-lg p-6 mb-10`}>
                  <h2 className={`text-lg font-semibold mb-2 ${textDark}`}>
                    Lab Steps
                  </h2>

                  {/* ✅ REQUIRED: Progress Indicator */}
                  <p className={`${textMedium} mb-4`}>
                    {completedSteps.length} of {lab.steps.length} steps
                    completed
                  </p>

                  <div className="space-y-4">
                    {lab.steps.map((step, index) => {
                      const completed = completedSteps.includes(index);

                      return (
                        <div key={index} className="border rounded-lg p-4">
                          <p className="font-medium">
                            Step {index + 1}: {step.title}
                          </p>

                          <div
                            className={`${textMedium} mt-2 prose dark:prose-invert max-w-none`}
                            dangerouslySetInnerHTML={{ __html: step.text }}
                          />

                          {/* ✅ REQUIRED: Manual Verification */}
                          <button
                            onClick={() =>
                              setCompletedSteps((prev) =>
                                prev.includes(index) ? prev : [...prev, index]
                              )
                            }
                            disabled={completed}
                            className="mt-3 px-4 py-2 rounded text-white disabled:opacity-50 cursor-pointer"
                            style={{ backgroundColor: primary }}
                          >
                            {completed
                              ? "Step Completed"
                              : "Mark Step as Completed"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Video */}
              <div className="mb-10">
                <h2 className={`text-lg font-semibold mb-2 ${textDark}`}>
                  Lab Guide Video
                </h2>

                {lab.video ? (
                  <video controls className="w-full rounded-xl shadow bg-black">
                    <source src={lab.video} type="video/mp4" />
                  </video>
                ) : (
                  <div className="w-full h-80 bg-gray-200 dark:bg-gray-900 rounded-xl flex flex-col items-center justify-center">
                    <Clapperboard className="w-16 h-16 text-[#72a210]" />
                    <p>No video uploaded yet</p>
                  </div>
                )}
              </div>

              {/* PDF */}
              <div className="mb-10">
                <button
                  onClick={() =>
                    lab.pdf
                      ? window.open(lab.pdf, "_blank")
                      : toast.error("No PDF available")
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#72a210] text-white rounded-lg cursor-pointer"
                > 
                  <FileText className="h-5 w-5" />
                  View Lab PDF
                </button>
              </div>

              {/* ✅ Final Action Buttons */}
              <div className="flex gap-2 mt-10">
                <button
                  disabled={
                    lab.steps && completedSteps.length !== lab.steps.length
                  }
                  onClick={() => toast.success("Lab marked as completed!")}
                  className="flex-1 py-3 rounded-lg text-white font-semibold disabled:opacity-50 cursor-pointer"
                  style={{ backgroundColor: primary }}
                >
                  Mark as Completed
                </button>

                <button
                  onClick={() => setIssuePopupOpen(true)}
                  className="flex-1 py-3 rounded-lg bg-red-500 text-white font-semibold cursor-pointer"
                >
                  Technical Issues
                </button>
              </div>
            </>
          )}

          <TechnicalIssuePopup
            open={issuePopupOpen}
            onClose={() => setIssuePopupOpen(false)}
            onSubmit={async (msg) => {
              await apiClient.post("/technical-issues", { message: msg });
              toast.success("Technical issue submitted successfully!");
              setIssuePopupOpen(false);
            }}
          />
        </main>

        <Nav />
      </div>
    </div>
  );
}
