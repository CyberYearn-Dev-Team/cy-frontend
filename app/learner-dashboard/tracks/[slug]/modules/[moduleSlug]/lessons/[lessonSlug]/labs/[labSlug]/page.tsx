"use client";

import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import Breadcrumb from "@/components/ui/breadcrumb";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LabGuide {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  xp: number;
  time: string;
  video_url?: string;
  pdf_url?: string;
}

export default function LabPage() {
  const { slug, moduleSlug, lessonSlug, labSlug } = useParams<{
    slug: string;
    moduleSlug: string;
    lessonSlug: string;
    labSlug: string;
  }>();

  const [lab, setLab] = useState<LabGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchLab() {
      try {
        const res = await fetch(
          `/api/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonSlug}/labs/${labSlug}`
        );
        const data = await res.json();
        setLab(data.lab || null);
      } catch (err) {
        console.error("Error fetching lab:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLab();
  }, [slug, moduleSlug, lessonSlug, labSlug]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Breadcrumb */}      
                      <Breadcrumb /> <br />
          {loading ? (
            <p className="text-gray-500">Loading lab...</p>
          ) : !lab ? (
            <p className="text-gray-500">Lab not found.</p>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 space-y-4">
              <h1 className="text-2xl font-bold">{lab.title}</h1>
              <p className="text-gray-600">{lab.description}</p>
              <p className="text-sm text-gray-500">
                XP: {lab.xp} - Time: {lab.time}
              </p>

              {lab.video_url && (
                <video controls className="w-full rounded-lg">
                  <source src={lab.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              {lab.pdf_url && (
                <a
                  href={lab.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-base px-5 py-2 rounded-lg bg-[#72a210] text-white hover:bg-[#5c880d]"
                >
                  View Lab Guide (PDF)
                </a>
              )}
            </div>
          )} <br />
          {/* Quizzes Button */}
          <div className="bg-white shadow rounded-lg p-3 sm:p-6 flex flex-col sm:flex-row justify-between items-center">
  <p className="text-gray-600 mb-3 sm:mb-0 sm:p-[10px]">
    Test your knowledge so far.
  </p>
  <Link
    href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonSlug}/labs/${labSlug}/quizzes`}
    className="w-full sm:w-auto text-base px-4 py-2 sm:px-5 sm:py-2 rounded-lg bg-[#72a210] text-white hover:bg-[#5c880d] text-center"
  >
    Take Lesson Quiz
  </Link>
</div>

        </main>
      </div>
    </div>
  );
}
