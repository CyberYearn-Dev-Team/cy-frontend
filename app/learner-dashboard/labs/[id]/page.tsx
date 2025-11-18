// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { FileText } from "lucide-react";
// import Sidebar from "@/components/ui/learner-sidebar";
// import Nav from "@/components/ui/learner-nav";
// import Header from "@/components/ui/learner-header";

// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import Link from "next/link";

// // Convert Directus file object to public URL
// const getFileUrl = (file: any) => {
//   if (!file) return null;
//   const directusUrl = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";
//   return `${directusUrl}/assets/${file.id}`;
// };

// interface LabDetail {
//   id: number;
//   title: string;
//   description: string;
//   levels: string;
//   time: string;
//   xp: number;
//   video?: string | null;
//   pdf?: string | null;
//   steps?: { text: string }[];
//   status: "completed" | "in-progress" | "not-started";
// }

// export default function LabDetailPage() {
//   const params = useParams();
//   const labId = params?.id as string;

//   const [lab, setLab] = useState<LabDetail | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Sidebar state
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     async function fetchLab() {
//       try {
//         const res = await fetch(`/api/lab-guides/${labId}`, { cache: "no-store" });
//         const json = await res.json();

//         if (!res.ok) {
//           throw new Error(json?.error || "Failed to load lab");
//         }

//         const labData: LabDetail = {
//   id: json.data.id,
//   title: json.data.title,
//   description: json.data.description,
//   levels: json.data.levels,
//   time: json.data.time,
//   xp: json.data.xp,
//   video: json.data.video ? getFileUrl(json.data.video) : undefined,
//   pdf: json.data.pdf ? getFileUrl(json.data.pdf) : undefined,
//   steps: json.data.steps,
//   status: "not-started",
// };


//         setLab(labData);
//       } catch (err) {
//         console.error("Error fetching lab:", err);
//         setError(err instanceof Error ? err.message : String(err));
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (labId) fetchLab();
//   }, [labId]);

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
//       {/* Sidebar */}
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <Header setSidebarOpen={setSidebarOpen} />

//         <main className="flex-1 overflow-y-auto p-6 space-y-8">
//           {/* Breadcrumb inside scrollable content */}
//           <Breadcrumb className="mb-4">
//             <BreadcrumbList>
//               <BreadcrumbItem>
//                 <BreadcrumbLink asChild>
//                   <Link href="/learner-dashboard/labs">Labs</Link>
//                 </BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem>
//                 <BreadcrumbPage>{lab ? lab.title : "Loading..."}</BreadcrumbPage>
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>

//           {/* Loading / Error / Empty states */}
//           {loading && <div className="text-gray-700 dark:text-gray-300">Loading...</div>}
//           {error && <div className="p-8 text-red-600">{`Error: ${error}`}</div>}
//           {!loading && !error && !lab && (
//             <div className="p-8 text-gray-700 dark:text-gray-300">Lab not found</div>
//           )}

//           {/* Render lab */}
//           {lab && (
//             <>
//               <div>
//                 <h1 className="text-2xl mb-2 font-bold text-gray-900 dark:text-gray-100">{lab.title}</h1>
//                 <p className="text-gray-700 mb-2 dark:text-gray-300">{lab.description}</p>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                   {lab.levels} • {lab.time} • {lab.xp} XP
//                 </p>
//               </div>

//               {/* Video */}
//               {lab.video && (
//                 <div>
//                   <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Demo Video</h2>
//                   <video controls className="w-full rounded-lg shadow bg-black">
//                     <source src={lab.video} type="video/mp4" />
//                   </video>
//                 </div>
//               )}

//               {/* PDF */}
//               {lab.pdf && (
//                 <div className="mb-25">
//                   <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Lab Guide PDF</h2>
//                   <a
//                     href={lab.pdf}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center gap-2 px-4 py-2 bg-[#72a210] dark:bg-[#507800] text-white text-lg rounded-lg hover:bg-[#5a850d] dark:hover:bg-[#72a210] transition"
//                   >
//                     <FileText className="h-5 w-5" /> View Lab PDF
//                   </a>
//                 </div>
//               )}
//             </>
//           )}
//         </main>

//         {/* Navigation */}
//         <Nav />
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FileText } from "lucide-react";
import Sidebar from "@/components/ui/learner-sidebar";
import Nav from "@/components/ui/learner-nav";
import Header from "@/components/ui/learner-header";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

// Theme constants
const primary = "#72a210";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-700 dark:text-gray-300";
const textLight = "text-gray-500 dark:text-gray-400";

// Convert Directus file object to public URL
const getFileUrl = (file: any) => {
  if (!file) return null;
  const directusUrl = process.env.DIRECTUS_URL || "https://cy-directus.onrender.com";
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

  // Fetch lab detail
  useEffect(() => {
    async function fetchLab() {
      try {
        const res = await fetch(`/api/lab-guides/${labId}`, { cache: "no-store" });
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
                <BreadcrumbPage>{lab ? lab.title : "Loading..."}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Loading / Error / Empty states */}
          {loading && <div className={`${textMedium}`}>Loading...</div>}
          {error && <div className="p-8 text-red-600">{`Error: ${error}`}</div>}
          {!loading && !error && !lab && (
            <div className={`${textMedium}`}>Lab not found</div>
          )}

          {/* Lab content */}
          {lab && (
            <>
              <h1 className={`text-2xl mb-2 font-bold ${textDark}`}>{lab.title}</h1>
              {lab.description ? (
                <div
                  className="lab-description prose max-w-none space-y-6 dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: lab.description }}
                />
              ) : (
                <div className="text-light">No description available</div>
              )}

              <p className={`${textMedium} mt-2`}>
                {lab.levels} • {lab.time} • {lab.xp} XP
              </p>

              {/* Video */}
              {lab.video && (
                <div>
                  <h2 className={`text-lg font-semibold mb-2 ${textDark}`}>Demo Video</h2>
                  <video controls className="w-full rounded-lg shadow bg-black">
                    <source src={lab.video} type="video/mp4" />
                  </video>
                </div>
              )}

              {/* PDF */}
              {lab.pdf && (
                <div className="mb-25">
                  <h2 className={`text-lg font-semibold mb-2 ${textDark}`}>Lab Guide PDF</h2>
                  <a
                    href={lab.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#72a210] dark:bg-[#507800] text-white text-lg rounded-lg hover:bg-[#5a850d] dark:hover:bg-[#72a210] transition"
                  >
                    <FileText className="h-5 w-5" /> View Lab PDF
                  </a>
                </div>
              )}
            </>
          )}
        </main>

        <Nav />
      </div>
    </div>
  );
}
