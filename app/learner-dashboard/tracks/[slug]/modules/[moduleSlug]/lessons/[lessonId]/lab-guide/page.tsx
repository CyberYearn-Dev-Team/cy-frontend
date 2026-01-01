"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/learner-sidebar";
import { completeLabGuide, getLabGuideStatus } from "@/lib/services/labGuideService";
import Header from "@/components/learner-header";
import Nav from "@/components/learner-nav";
import { toast } from "sonner";
import TechnicalIssuePopup from "@/components/ui/technical-issue-popup";
import { apiClient } from "@/lib/api/client";
import { LabDetailSkeleton } from "@/components/ui/LabDetailSkeleton";
import { FileText, Clapperboard } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import Link from "next/link";

const primary = "#72a210";
const primaryDarker = "#5c880d";
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

interface LabGuide {
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

export default function LabGuidePage() {
  const { slug, moduleSlug, lessonId } = useParams<{
    slug: string;
    moduleSlug: string;
    lessonId: string;
  }>();

  const [lab, setLab] = useState<LabGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issuePopupOpen, setIssuePopupOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [labId, setLabId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    if (typeof window !== 'undefined' && lessonId) {
      const saved = localStorage.getItem(`lab-guide-${lessonId}-completed-steps`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Save completed steps to local storage when they change
  useEffect(() => {
    if (typeof window !== 'undefined' && lessonId) {
      localStorage.setItem(`lab-guide-${lessonId}-completed-steps`, JSON.stringify(completedSteps));
    }
  }, [completedSteps, lessonId]);

  // Function to mark lab as completed
  const markAsCompleted = async () => {
    if (!lab || !labId) return;

    try {
      setIsSubmitting(true);

      // Check if all steps are completed if there are steps
      if (lab.steps && lab.steps.length > 0 && completedSteps.length !== lab.steps.length) {
        toast.warning("Please complete all steps first");
        return;
      }

      try {
        // First ensure the lab guide status is fetched (this will create the record if it doesn't exist)
        await getLabGuideStatus(labId);
        
        // Now mark it as completed
        const completionResponse = await completeLabGuide(labId);
        
        // Update local state
        setLab(prev => prev ? {
          ...prev,
          completed: true,
          status: "completed"
        } : null);
        
        setIsCompleted(true);
        toast.success('Lab marked as completed!');
      } catch (error: any) {
        console.error('Error in lab completion process:', error);
        throw error; // Re-throw to be caught by the outer catch
      }
    } catch (error: any) {
      console.error('Error marking lab as completed:', error);
      toast.error(error.message || 'Failed to mark lab as completed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch lab guide status and data on component mount
  useEffect(() => {
    const fetchLabData = async () => {
      try {
        setLoading(true);

        // 1. First, fetch the lab guide data
        const url = new URL(
          `/api/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonId}/lab_guide`,
          window.location.origin
        );

        // Add labGuideId from URL search params if it exists
        const searchParams = new URLSearchParams(window.location.search);
        const labGuideId = searchParams.get('labGuideId');
        if (labGuideId) {
          url.searchParams.set('labGuideId', labGuideId);
        }

        // First fetch the lab data
        const labRes = await fetch(url.toString());
        if (!labRes.ok) throw new Error("Failed to fetch lab guide");

        const json = await labRes.json();
        if (!json.lab) throw new Error("Lab guide not found");

        // Now that we have the lab ID, fetch the status
        const labId = json.lab?.id?.toString() || '';
        const statusRes = await getLabGuideStatus(labId);

        // Update state with the lab ID
        setLabId(labId);

        // Update state with lab data and completion status
        const labData = {
          ...json.lab,
          video: getFileUrl(json.lab.video),
          pdf: getFileUrl(json.lab.pdf),
          steps: json.lab.steps || [],
          completed: statusRes?.data?.completed || false,
          status: statusRes?.data?.completed ? "completed" : "not-started"
        };

        setLab({
          ...json.lab,
          id: json.lab.id,
          completed: statusRes?.data?.completed || false,
          status: statusRes?.data?.completed ? "completed" : "not-started"
        });
        
        setIsCompleted(statusRes?.data?.completed || false);

      } catch (err) {
        console.error('Error fetching lab data:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchLabData();
    }
  }, [lessonId, slug, moduleSlug]);

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <Sidebar sidebarOpen={false} setSidebarOpen={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={() => {}} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-30">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonId}`}
                >
                  Lesson
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Lab Guide</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Safety & Ethics Warning */}
          <div className="bg-yellow-50 mb-5 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This lab is for{" "}
              <strong>Educational Purposes Only</strong>. Do not run commands on production systems or systems you do not own. Proceed carefully.
            </p>
          </div>

          {/* Loading / Error */}
          {loading && <LabDetailSkeleton />}
          {error && <div className="p-8 text-red-600">{`Error: ${error}`}</div>}
          {!loading && !error && !lab && (
            <div className={textMedium}>No lab guide found.</div>
          )}

          {/* Lab Content */}
          {lab && (
            <>
              <div className={`${cardBg} shadow rounded-lg p-6`}>
                <h1 className={`text-2xl mb-2 font-bold ${textDark}`}>
                  {lab.title}
                </h1>

                {/* Full description from Directus */}
                {lab.description ? (
                  <div
                    className="prose dark:prose-invert max-w-none mb-4"
                    dangerouslySetInnerHTML={{ __html: lab.description }}
                  />
                ) : (
                  <div className={textLight}>No description available</div>
                )}

                {lab.levels && (
                  <p className={`${textMedium} mt-2`}>• {lab.levels} •</p>
                )}
              </div>

              {/* Lab Steps */}
              {lab.steps && lab.steps.length > 0 && (
                <div className={`${cardBg} shadow rounded-lg p-6 mt-6`}>
                  <h2 className={`text-lg font-semibold mb-2 ${textDark}`}>
                    Lab Steps
                  </h2>

                  <p className={`${textMedium} mb-4`}>
                    {completedSteps.length} of {lab.steps.length} steps completed
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
                            disabled={lab.status === 'completed'}
                            className="mt-3 px-4 py-2 rounded-lg text-white cursor-pointer transition"
                            style={{ 
                              backgroundColor: completed || lab.status === 'completed' ? '#5a850d' : primary 
                            }}
                          >
                            {completed || lab.status === 'completed' ? "Step Completed" : "Mark Step as Completed"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Video */}
              <div className="mt-6">
                <h2 className={`text-lg font-semibold mb-2 ${textDark}`}>
                  Lab Guide Video
                </h2>
                {lab.video ? (
                  <video controls className="w-full rounded-xl shadow bg-black">
                    <source src={lab.video} type="video/mp4" />
                  </video>
                ) : (
                  <div
                    className="w-full h-80 bg-gray-200 dark:bg-gray-900/80 
                    backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-5 text-gray-800 dark:text-white"
                  >
                    <Clapperboard className="w-16 h-16 text-[#72a210]" />
                    <p className="text-lg font-medium opacity-90">
                      No video uploaded yet
                    </p>
                  </div>
                )}
              </div>

              {/* PDF */}
              <div className="mt-6 mb-10">
                <h2 className={`text-lg font-semibold mb-2 ${textDark}`}>
                  Lab Guide PDF
                </h2>
                <button
                  onClick={() => {
                    if (!lab.pdf) {
                      toast.error("No PDF available", {
                        description:
                          "No PDF is uploaded yet for this lab guide.",
                      });
                    } else {
                      window.open(lab.pdf, "_blank");
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#72a210] text-white text-lg rounded-lg hover:bg-[#5a850d] transition cursor-pointer"
                >
                  <FileText className="h-5 w-5" /> View Lab PDF
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 mt-10">
                <button
                  onClick={markAsCompleted}
                  disabled={isCompleted || isSubmitting || (lab.steps && lab.steps.length > 0 && completedSteps.length !== lab.steps.length)}
                  className={`flex-1 py-2.5 md:py-3 rounded-lg text-white text-base md:text-lg font-semibold shadow transition ${
                    (isCompleted || (lab.steps && lab.steps.length > 0 && completedSteps.length !== lab.steps.length)) && !isSubmitting ? 'opacity-50' : ''
                  }`}
                  style={{ 
                    backgroundColor: isCompleted ? '#5a850d' : primary,
                    cursor: (isCompleted || isSubmitting || (lab.steps && lab.steps.length > 0 && completedSteps.length !== lab.steps.length)) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting 
                    ? 'Updating...' 
                    : isCompleted 
                      ? 'Lab Completed' 
                      : lab.steps && lab.steps.length > 0 
                        ? `Complete All Steps (${completedSteps.length}/${lab.steps.length})`
                        : 'Mark as Completed'}
                </button>

                <button
                  onClick={() => setIssuePopupOpen(true)}
                  className="flex-1 py-2.5 md:py-3 rounded-lg text-base md:text-lg font-semibold bg-red-500 text-white hover:bg-red-700 active:bg-red-800 transition cursor-pointer shadow-sm"
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
              try {
                await apiClient.post('/technical-issues', { message: msg });
                toast.success("Issue submitted successfully!");
                setIssuePopupOpen(false);
              } catch (error) {
                console.error("Error submitting technical issue:", error);
                toast.error("Failed to submit issue. Please try again.");
              } finally {
                setIssuePopupOpen(false);
              }
            }}
          />
        </main>

        <Nav />
      </div>
    </div>
  );
}