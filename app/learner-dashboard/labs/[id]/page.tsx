"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FileText, PlayCircle } from "lucide-react";
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";

interface LabDetail {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  time: string;
  xp: number;
  video_url?: string;
  pdf_url?: string;
  steps?: { text: string }[];
  status: "completed" | "in-progress" | "not-started";
}

export default function LabDetailPage() {
  const params = useParams();
  const labId = params?.id as string;
  const [lab, setLab] = useState<LabDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLab() {
      try {
        const res = await fetch(`/api/lab-guides/${labId}`, { cache: "no-store" });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.error || "Failed to load lab");
        }

        const labData: LabDetail = {
          id: json.data.id,
          title: json.data.title,
          description: json.data.description,
          difficulty: json.data.difficulty,
          time: json.data.time,
          xp: json.data.xp,
          video_url: json.data.video_url,
          pdf_url: json.data.pdf_url,
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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar sidebarOpen={false} setSidebarOpen={() => {}} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={() => {}} />

        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Loading / Error / Empty states */}
          {loading && <div className="p-8 text-gray-700 dark:text-gray-300">Loading...</div>}
          {error && <div className="p-8 text-red-600">{`Error: ${error}`}</div>}
          {!loading && !error && !lab && (
            <div className="p-8 text-gray-700 dark:text-gray-300">Lab not found</div>
          )}

          {/* Render lab */}
          {lab && (
            <>
              {/* Title & Meta */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{lab.title}</h1>
                <p className="text-gray-700 dark:text-gray-300">{lab.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {lab.difficulty} • {lab.time} • {lab.xp} XP
                </p>
              </div>

              {/* Video */}
              {lab.video_url && (
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Demo Video</h2>
                  <video controls className="w-full rounded-lg shadow bg-black">
                    <source src={lab.video_url} type="video/mp4" />
                  </video>
                </div>
              )}

              {/* PDF */}
              {lab.pdf_url && (
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Lab Guide PDF</h2>
                  <a
                    href={lab.pdf_url}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#72a210] dark:bg-[#507800] text-white text-lg rounded-lg hover:bg-[#5a850d] dark:hover:bg-[#72a210] transition"
                  >
                    <FileText className="h-4 w-4" /> View PDF
                  </a>
                </div>
              )}

              {/* Steps */}
              {lab.steps && lab.steps.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Instructions</h2>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {lab.steps.map((step, i) => (
                      <li key={i}>{step.text}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Action button */}
              {lab.status === "not-started" && (
                <button className="flex items-center gap-2 px-4 py-2 bg-[#72a210] dark:bg-[#507800] text-white rounded-lg hover:bg-[#5a850d] dark:hover:bg-[#72a210] transition mt-4">
                  <PlayCircle className="h-4 w-4" /> Start Lab
                </button>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
