"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/learner-sidebar";
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
  steps?: { text: string }[];
  status: "completed" | "in-progress" | "not-started";
}

export default function LabGuidePage() {
  const { slug, moduleSlug, lessonId } = useParams<{
    slug: string;
    moduleSlug: string;
    lessonId: string;
  }>();

  const [lab, setLab] = useState<LabGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [issuePopupOpen, setIssuePopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch lab guide
  useEffect(() => {
    async function fetchLab() {
      try {
        const res = await fetch(
          `/api/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonId}/lab_guide`
        );
        const json = await res.json();
        if (!res.ok) throw new Error("Failed to fetch lab guide");

        // Convert video/pdf to URL if Directus file object
        const labData = {
          ...json.lab,
          video: getFileUrl(json.lab?.video),
          pdf: getFileUrl(json.lab?.pdf),
        };

        setLab(labData);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchLab();
  }, [slug, moduleSlug, lessonId]);

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

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
                  onClick={() => toast.success("Lab marked as completed!")}
                  className="flex-1 py-2.5 md:py-3 rounded-[30px] text-white text-base md:text-lg font-semibold shadow cursor-pointer"
                  style={{ backgroundColor: primary }}
                >
                  Mark as Completed
                </button>

                <button
                  onClick={() => setIssuePopupOpen(true)}
                  className="flex-1 py-2.5 md:py-3 rounded-[30px] text-base md:text-lg font-semibold bg-red-500 text-white hover:bg-red-700 active:bg-red-800 transition cursor-pointer shadow-sm"
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
