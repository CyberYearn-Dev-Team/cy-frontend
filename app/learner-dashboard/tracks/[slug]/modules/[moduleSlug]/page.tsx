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
  description: string;
  estimated_time: string;
  order?: number;
}

interface Module {
  id: number;
  title: string;
  slug: string;
  description: string;
  lessons: Lesson[];
}

export default function ModuleDetailPage() {
  const { slug, moduleSlug } = useParams<{
    slug: string;
    moduleSlug: string;
  }>();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchModule() {
      try {
        const res = await fetch(
          `/api/tracks/${slug}/modules/${moduleSlug}/lessons`
        );
        const data = await res.json();
        setModule(data.module);
      } catch (err) {
        console.error("Error fetching module:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchModule();
  }, [slug, moduleSlug]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Breadcrumb */}
          <Breadcrumb /> <br />
          {loading ? (
            <p className="text-gray-500">Loading module...</p>
          ) : !module ? (
            <p className="text-gray-500">Module not found.</p>
          ) : (
            <div className="space-y-6">
              {/* Module Info */}
              <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-2">{module.title}</h1>
                <p className="text-gray-600">{module.description}</p>
              </div>

              {/* Lessons List */}
<div className="lg:bg-white lg:shadow lg:rounded-lg lg:p-6">

                <h2 className="text-xl font-semibold mb-2">Lessons</h2>
                {module.lessons.length === 0 ? (
                  <p className="text-gray-500">No lessons yet.</p>
                ) : (
                  <div className="space-y-4">
                    {module.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                          <span className="text-sm font-medium">
                            {index + 1}
                          </span>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold">{lesson.title}</h3>
                          <p className="text-sm text-gray-600">
                            {lesson.description}
                          </p>
                          <span className="text-xs text-gray-500">
                            {lesson.estimated_time}
                          </span>
                        </div>

                        <Link
                          href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lesson.slug}`}
                          className="w-full sm:w-auto text-base px-5 py-2 rounded-lg bg-[#72a210] text-white hover:bg-[#5c880d] text-center">
                          Start Lesson
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
