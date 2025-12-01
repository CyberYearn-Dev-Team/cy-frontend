"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const cardBg = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";

export default function LabGuidePage() {
  const { slug, moduleSlug, lessonId } = useParams<{
    slug: string;
    moduleSlug: string;
    lessonId: string;
  }>();

  const [lab, setLab] = useState<any>(null);

  useEffect(() => {
    async function fetchLab() {
      const res = await fetch(
        `/api/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonId}/lab_guide`
      );
      const json = await res.json();
      setLab(json.lab);
    }

    fetchLab();
  }, [slug, moduleSlug, lessonId]);

  if (!lab) {
    return <p className="p-8 text-gray-500">No lab guide found.</p>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">{lab.title}</h1>

      <div
        className={`${cardBg} p-6 shadow rounded-lg prose dark:prose-invert`}
        dangerouslySetInnerHTML={{ __html: lab.description }}
      />

      {lab.video && (
        <div className="mt-6">
          <h2 className="text-xl mb-2 font-semibold">Video Walkthrough</h2>
          <iframe
            src={lab.video}
            className="w-full aspect-video rounded-lg shadow"
            allowFullScreen
          />
        </div>
      )}

      {lab.pdf && (
        <div className="mt-6">
          <a
            href={lab.pdf}
            target="_blank"
            className="px-4 py-2 bg-[#72a210] text-white rounded-lg"
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}
