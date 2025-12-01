"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FileText } from "lucide-react";
import Sidebar from "@/components/learner-sidebar";
import Nav from "@/components/learner-nav";
import Header from "@/components/learner-header";
import TechnicalIssuePopup from "@/components/ui/technical-issue-popup";
import { LabDetailSkeleton } from "@/components/ui/LabDetailSkeleton";

import { Video, Film, Clapperboard } from "lucide-react";

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
const bgLight = "bg-gray-50 dark:bg-gray-950";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-700 dark:text-gray-300";
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
  steps?: { text: string }[];
  status: "completed" | "in-progress" | "not-started";
}

export default function LabDetailPage() {
  const params = useParams();
  const labId = params?.id as string;

  const [lab, setLab] = useState<LabDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [issuePopupOpen, setIssuePopupOpen] = useState(false);

  // Fetch lab detail
  useEffect(() => {
    async function fetchLab() {
      try {
        const res = await fetch(`/api/lab-guides/${labId}`, {
          cache: "no-store",
        });
        const json = await res.json();

        if (!res.ok) throw new Error(json?.error || "Failed to load lab");

        const labData: LabDetail = {
          id: json.data.id,
          title: json.data.title,
          description: json.data.description,
          levels: json.data.levels,
          time: json.data.time,
          xp: json.data.xp,
          video: json.data.video ? getFileUrl(json.data.video) : undefined,
          pdf: json.data.pdf ? getFileUrl(json.data.pdf) : undefined,
          steps: json.data.steps,
          status: "not-started",
        };

        setLab(labData);
      } catch (err) {
        console.error("Error fetching lab:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    if (labId) fetchLab();
  }, [labId]);

  // Make links in description clickable and styled
  useEffect(() => {
    if (!lab?.description) return;

    const container = document.querySelector(".lab-description");
    if (!container) return;

    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      const el = link as HTMLAnchorElement;
      if (!el.getAttribute("href") && el.textContent?.startsWith("http")) {
        el.setAttribute("href", el.textContent.trim());
      }
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
      el.style.color = primary;
      el.style.textDecoration = "underline";
    });
  }, [lab]);

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Breadcrumb */}
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

          {/* Loading / Error / Empty states */}
          {loading && <LabDetailSkeleton />}
          {error && <div className="p-8 text-red-600">{`Error: ${error}`}</div>}
          {!loading && !error && !lab && (
            <div className={`${textMedium}`}>Lab not found</div>
          )}

          {/* Lab content */}
          {lab && (
            <>
              <h1 className={`text-2xl mb-2 font-bold ${textDark}`}>
                {lab.title}
              </h1>

              {lab.description ? (
                <div
                  className="lab-description prose max-w-none space-y-6 dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: lab.description }}
                />
              ) : (
                <div className={textLight}>No description available</div>
              )}

              <p className={`${textMedium} mt-2`}>• {lab.levels} • </p>

              {/* -------------------- VIDEO SECTION -------------------- */}
              <div>
                <h2 className={`text-lg font-semibold mb-2 ${textDark}`}>
                  Lab Guide Video
                </h2>

                {lab.video ? (
                  <video controls className="w-full rounded-xl shadow bg-black">
                    <source src={lab.video} type="video/mp4" />
                  </video>
                ) : (
                  <div
                    className="w-full h-80 
    bg-gray-200 dark:bg-gray-900/80 
    backdrop-blur-sm 
    rounded-xl flex flex-col items-center justify-center gap-5 text-gray-800 dark:text-white"
                  >
                    <Clapperboard className="w-16 h-16 text-[#72a210]" />

                    <p className="text-lg font-medium opacity-90">
                      No video uploaded yet
                    </p>
                  </div>
                )}
              </div>

              {/* -------------------- PDF SECTION -------------------- */}
              <div className="mb-10">
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#72a210] dark:bg-[#72a210] text-white text-lg rounded-lg hover:bg-[#5a850d] dark:hover:bg-[#507800] transition cursor-pointer"
                >
                  <FileText className="h-5 w-5" /> View Lab PDF
                </button>
              </div>

              {/* -------------------- ACTION BUTTONS -------------------- */}
              <div className="flex flex-col md:flex-row gap-4 mt-10 pb-24">
                {/* Mark Completed Button */}
                <button
                  onClick={() => {
                    toast.success("Lab marked as completed!");
                  }}
                  className="flex-1 py-2.5 md:py-3 rounded-md text-white text-base md:text-lg font-semibold shadow cursor-pointer"
                  style={{ backgroundColor: primary }}
                >
                  Mark as Completed
                </button>

                {/* Technical Issues Button */}
                <button
                  onClick={() => setIssuePopupOpen(true)}
                  className="
    flex-1 
    py-2.5 md:py-3 
    rounded-lg
    text-base md:text-lg 
    font-semibold 
    bg-red-500 
    text-white
    hover:bg-red-700
    active:bg-red-800
    transition
    cursor-pointer
    shadow-sm
  "
                >
                  Technical Issues
                </button>
              </div>
            </>
          )}

          <TechnicalIssuePopup
            open={issuePopupOpen}
            onClose={() => setIssuePopupOpen(false)}
            onSubmit={(msg) => {
              toast.success("Issue submitted!");
              setIssuePopupOpen(false);

              // OPTIONAL: send to your backend
              // fetch("/api/issues", { method: "POST", body: JSON.stringify({ msg }) })
            }}
          />
        </main>

        <Nav />
      </div>
    </div>
  );
}
