"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FlaskConical, Clock, FileText, PlayCircle } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";

interface LabDetail {
  id: number;
  title: string;        // Directus
  description: string;  // Directus
  difficulty: string;   // Directus
  time: string;         // Directus
  xp: number;           // Directus
  videoUrl?: string;    // Directus (optional)
  pdfUrl?: string;      // Directus (optional)
  steps?: string[];     // Directus (optional rich text)
  status: "completed" | "in-progress" | "not-started"; // SQL
}

export default function LabDetailPage() {
  const params = useParams();
  const labId = params?.id;
  const [lab, setLab] = useState<LabDetail | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // TODO: replace with Directus + SQL
        // Example Directus endpoint: /items/lab_guides/{id}?fields=title,description,difficulty,time,xp,video,pdf,steps
        // Example SQL endpoint: /api/labs/{id}/status
        setLab({
          id: Number(labId),
          title: "Phishing Email Analysis",
          description: "Analyze a phishing email and identify red flags.",
          difficulty: "Beginner",
          time: "15 min",
          xp: 100,
          videoUrl: "https://example.com/demo-video.mp4",
          pdfUrl: "https://example.com/lab-guide.pdf",
          steps: [
            "Download the sample phishing email.",
            "Open in a safe environment.",
            "Identify suspicious elements.",
          ],
          status: "not-started", // SQL
        });
      } catch {
        setLab(null);
      }
    })();
  }, [labId]);

  if (!lab) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar sidebarOpen={false} setSidebarOpen={() => {}} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={() => {}} />

        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Title & Meta */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lab.title}</h1>
            <p className="text-gray-600">{lab.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              {lab.difficulty} • {lab.time} • {lab.xp} XP
            </p>
          </div>

          {/* Video */}
          {lab.videoUrl && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Demo Video</h2>
              <video controls className="w-full rounded-lg shadow">
                <source src={lab.videoUrl} type="video/mp4" />
              </video>
            </div>
          )}

          {/* PDF */}
          {lab.pdfUrl && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Lab Guide PDF</h2>
              <a
                href={lab.pdfUrl}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#72a210] text-white rounded-lg hover:bg-[#5a850d]"
              >
                <FileText className="h-4 w-4" /> View PDF
              </a>
            </div>
          )}

          {/* Steps */}
          {lab.steps && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Instructions</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                {lab.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Action */}
          {lab.status === "not-started" && (
            <button className="flex items-center gap-2 px-4 py-2 bg-[#72a210] text-white rounded-lg hover:bg-[#5a850d]">
              <PlayCircle className="h-4 w-4" /> Start Lab
            </button>
          )}
        </main>
      </div>
    </div>
  );
}
