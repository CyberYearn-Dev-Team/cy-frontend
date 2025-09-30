"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Always start breadcrumb from "tracks"
  const startIndex = segments.indexOf("tracks");
  const slicedSegments =
    startIndex !== -1 ? segments.slice(startIndex) : segments;

  // Path builder
  let pathSoFar: string[] = ["learner-dashboard"];

  // Map fixed segments to display labels
  const labelMap: Record<string, string> = {
    tracks: "Tracks",
    modules: "Modules",
    lessons: "Lessons",
    labs: "Labs",
    quizzes: "Quizzes",
    result: "Result",
  };

  // Dynamic segments we want to skip from breadcrumb
  const dynamicSegments = ["slug", "moduleslug", "lessonslug", "labslug"];

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {slicedSegments.map((segment, idx) => {
          pathSoFar.push(segment);
          const href = "/" + pathSoFar.join("/");

          // Skip if it’s a dynamic slug
          if (dynamicSegments.includes(segment.toLowerCase())) {
            return null;
          }

          const isLast = idx === slicedSegments.length - 1;

          // Use labelMap if available, otherwise fallback to slug text
          const label =
            labelMap[segment.toLowerCase()] ??
            decodeURIComponent(segment.replace(/-/g, " "));

          return (
            <li key={href} className="flex items-center">
              {!isLast ? (
                <Link
                  href={href}
                  className={cn(
                    "px-2 py-1 rounded-md hover:bg-gray-100 hover:text-[#72a210]",
                    "capitalize"
                  )}
                >
                  {label}
                </Link>
              ) : (
                <span className="px-2 py-1 rounded-md bg-gray-200 font-semibold text-gray-800 capitalize">
                  {label}
                </span>
              )}
              {!isLast && <span className="mx-2">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
