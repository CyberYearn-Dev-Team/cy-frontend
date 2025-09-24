"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import Breadcrumb from "@/components/ui/breadcrumb";



interface Lesson {
  id: number;
  title: string;
  slug: string;
  content: string;
  estimated_time: string;
  order?: number;
}

export default function LessonDetailPage() {
  const { slug, moduleSlug, lessonSlug } = useParams<{
    slug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await fetch(
          `/api/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonSlug}`
        );
        const data = await res.json();
        setLesson(data.lesson);
      } catch (err) {
        console.error("Error fetching lesson:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [slug, moduleSlug, lessonSlug]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

          {/* Breadcrumb */}
          <Breadcrumb /> <br />

          {loading ? (
            <p className="text-gray-500">Loading lesson...</p>
          ) : !lesson ? (
            <p className="text-gray-500">Lesson not found.</p>
          ) : (
            <div className="space-y-6">
              {/* Lesson Info */}
              <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
                <p className="text-gray-500 text-sm mb-4">
                  Estimated time: {lesson.estimated_time}
                </p>
                <div className="prose max-w-none">
                  {/* Assuming lesson.content is HTML or markdown */}
                  <div
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  />
                </div>
              </div>

              {/* Quizzes Button */}
              <div className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
                <p className="text-gray-600">
                  Test your knowledge from this lesson.
                </p>
                <Link
                  href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonSlug}/quizzes`}
                  className="px-4 py-2 rounded bg-[#72a210] text-white hover:bg-[#5c880d] text-sm font-medium"
                >
                  Take Quiz
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
