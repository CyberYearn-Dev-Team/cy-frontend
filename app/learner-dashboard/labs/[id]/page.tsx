"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { FileText, Clapperboard } from "lucide-react";
import { completeLabGuide, getLabGuideStatus } from "@/lib/services/labGuideService";
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

const getFileUrl = (file: any) => {
  if (!file) return null;
  const directusUrl = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";
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
  completed: boolean;
}

export default function LabDetailPage() {
  const params = useParams();
  const labId = params?.id as string;

  const [lab, setLab] = useState<LabDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [issuePopupOpen, setIssuePopupOpen] = useState(false);

  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    if (typeof window !== 'undefined' && labId) {
      const saved = localStorage.getItem(`lab-${labId}-completed-steps`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && labId) {
      localStorage.setItem(`lab-${labId}-completed-steps`, JSON.stringify(completedSteps));
    }
  }, [completedSteps, labId]);

  const markAsCompleted = async () => {
    if (!lab) return;
    try {
      setIsSubmitting(true);
      if (lab.steps && completedSteps.length !== lab.steps.length) {
        toast.warning("Please complete all steps first");
        return;
      }
      
      // Call the complete lab guide endpoint
      const completionResponse = await completeLabGuide(lab.id.toString());
      if (completionResponse.status === 200) {
        // Fetch the updated status
        const statusResponse = await getLabGuideStatus(lab.id.toString());
        setLab(prev => prev ? { 
          ...prev, 
          completed: statusResponse.data.completed 
        } : null);
        toast.success('Lab marked as completed!');
      }
    } catch (error) {
      console.error('Error marking lab as completed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to mark lab as completed');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchLab() {
      try {
        const res = await fetch(`/api/lab-guides/${labId}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load lab");

        // Get the latest status from the API
        const statusResponse = await getLabGuideStatus(labId);
        const isCompleted = statusResponse.data?.completed || false;
        
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
          status: isCompleted ? "completed" : "not-started",
          completed: isCompleted,
        });

        // If lab is completed, mark all steps as completed
        if (isCompleted && json.data.steps?.length) {
          setCompletedSteps(Array.from({ length: json.data.steps.length }, (_, i) => i));
        }
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
                <BreadcrumbPage>{lab ? lab.title : "Loading..."}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="bg-yellow-50 mb-5 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This lab is for <strong>educational purposes only</strong>. Do not
              run commands on production systems. Proceed carefully.
            </p>
          </div>

          {loading && <LabDetailSkeleton />}
          {error && <div className="p-8 text-red-600">{error}</div>}

          {lab && (
            <>
              <div className={`${cardBg} shadow rounded-lg p-6 mb-6`}>
                <h1 className={`text-2xl font-bold ${textDark}`}>{lab.title}</h1>
                {lab.description ? (
                  <div
                    className="prose max-w-none mt-4 dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: lab.description }}
                  />
                ) : (
                  <div className={textLight + " mt-4"}>No description available</div>
                )}
              </div>

              {lab.steps && lab.steps.length > 0 && (
                <div className={`${cardBg} shadow rounded-lg p-6 mb-10`}>
                  <h2 className={`text-lg font-semibold mb-2 ${textDark}`}>Lab Steps</h2>
                  <p className={`${textMedium} mb-4`}>
                    {completedSteps.length} of {lab.steps.length} steps completed
                  </p>
                  <div className="space-y-4">
                    {lab.steps.map((step, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <p className="font-medium">Step {index + 1}: {step.title}</p>
                        <div
                          className={`${textMedium} mt-2 prose dark:prose-invert max-w-none`}
                          dangerouslySetInnerHTML={{ __html: step.text }}
                        />
                        <button
                          onClick={() => {
                            const newCompletedSteps = completedSteps.includes(index)
                              ? completedSteps.filter(i => i !== index)
                              : [...completedSteps, index];
                            setCompletedSteps(newCompletedSteps);
                            if (!completedSteps.includes(index)) {
                              toast.success(`Step ${index + 1} marked as completed!`);
                            }
                          }}
                          disabled={lab.completed}
                          className="mt-3 px-4 py-2 rounded-lg text-white cursor-pointer transition"
                          style={{ 
                            backgroundColor: completedSteps.includes(index) || lab.completed ? '#5a850d' : primary 
                          }}
                        >
                          {completedSteps.includes(index) || lab.completed ? "Step Completed" : "Mark Step as Completed"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-10">
                <h2 className={`text-lg font-semibold mb-2 ${textDark}`}>Lab Guide Video</h2>
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

              <div className="mb-10">
                <button
                  onClick={() => lab.pdf ? window.open(lab.pdf, "_blank") : toast.error("No PDF available")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#72a210] text-white rounded-lg cursor-pointer"
                > 
                  <FileText className="h-5 w-5" />
                  View Lab PDF
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-10">
                <button
                  onClick={markAsCompleted}
                  disabled={lab.completed || isSubmitting || lab.steps?.length === 0}
                  className={`flex-1 py-2.5 md:py-3 rounded-lg text-white text-base md:text-lg font-semibold shadow transition ${
                    ((lab.steps && completedSteps.length !== lab.steps.length) || lab.completed) && !isSubmitting ? 'opacity-50' : ''
                  }`}
                  style={{ backgroundColor: lab.completed ? '#5a850d' : primary }}
                >
                  {isSubmitting ? 'Updating...' : lab.completed ? 'Lab Completed' : 'Mark as Completed'}
                </button>

                <button
                  onClick={() => setIssuePopupOpen(true)}
                  className="flex-1 py-2.5 md:py-3 rounded-lg text-base md:text-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition cursor-pointer shadow-sm"
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