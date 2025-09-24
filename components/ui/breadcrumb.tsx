"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // always start breadcrumb from "tracks"
  const startIndex = segments.indexOf("tracks");
  const slicedSegments =
    startIndex !== -1 ? segments.slice(startIndex) : segments;

  // keep track of full path including learner-dashboard
  const prefix = "/learner-dashboard";

  // hide these segments from breadcrumb labels
  const ignored = ["modules", "lessons"];

  let pathSoFar: string[] = ["learner-dashboard"];

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {slicedSegments.map((segment, idx) => {
          pathSoFar.push(segment);
          const href = "/" + pathSoFar.join("/");

          // skip ignored segments in display, but still advance pathSoFar
          if (ignored.includes(segment.toLowerCase())) {
            return null;
          }

          const isLast = idx === slicedSegments.length - 1;

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
                  {decodeURIComponent(segment.replace(/-/g, " "))}
                </Link>
              ) : (
                <span className="px-2 py-1 rounded-md bg-gray-200 font-semibold text-gray-800 capitalize">
                  {decodeURIComponent(segment.replace(/-/g, " "))}
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
