// "use client";

// import React, { useState } from "react";
// import { Trophy, Lock } from "lucide-react";

// import Sidebar from "@/components/ui/learner-sidebar";
// import Header from "@/components/ui/learner-header";
// import Nav from "@/components/ui/learner-nav";
// import LearnerFooter from "@/components/ui/learner-footer";

// // Reusable Card Wrapper
// const Card = ({
//   children,
//   className = "",
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => (
//   <div
//     className={`bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 ${className}`}
//   >
//     {children}
//   </div>
// );

// const CardHeader = ({
//   title,
//   icon,
// }: {
//   title: string;
//   icon: React.ReactNode;
// }) => (
//   <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
//     {icon}
//     <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//       {title}
//     </h2>
//   </div>
// );

// const CardContent = ({ children }: { children: React.ReactNode }) => (
//   <div className="px-6 py-4">{children}</div>
// );

// export default function AchievementsPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // 🔹 Now includes 9 total achievements
//   const achievements = [
//     {
//       id: 1,
//       name: "First Steps",
//       description: "Completed your first lesson",
//       image:
//         "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%201.png",
//       unlocked: false,
//     },
//     {
//       id: 2,
//       name: "Quiz Master",
//       description: "Scored 90%+ on 5 quizzes",
//       image:
//         "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%202.png",
//       unlocked: false,
//     },
//     {
//       id: 3,
//       name: "Lab Explorer",
//       description: "Completed 5 lab guides",
//       image:
//         "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%203.png",
//       unlocked: false,
//     },
//     {
//       id: 4,
//       name: "Streak Keeper",
//       description: "Maintained a 7-day streak",
//       image:
//         "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%204.png",
//       unlocked: false,
//     },
//     {
//       id: 5,
//       name: "XP Collector",
//       description: "Earned 1000 XP",
//       image:
//         "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%205.png",
//       unlocked: false,
//     },
//     {
//       id: 6,
//       name: "Champion",
//       description: "Top 1 in leaderboard",
//       image:
//         "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%206.png",
//       unlocked: false,
//     },
//     {
//       id: 7,
//       name: "Bug Bounty Hunter",
//       description: "Reported your first security flaw",
//       image:
//         "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%202.png",
//       unlocked: false,
//     },
//     {
//       id: 8,
//       name: "Course Finisher",
//       description: "Completed an entire track",
//       image:
//         "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%201.png",
//       unlocked: false,
//     },
//     {
//       id: 9,
//       name: "Mentor in Training",
//       description: "Helped 3 other learners",
//       image:
//         "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%204.png",
//       unlocked: false,
//     },
//   ];

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
//       {/* Sidebar */}
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       {/* Main Content Layout */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <Header setSidebarOpen={setSidebarOpen} />

//         {/* Page Content + Footer Wrapper */}
//         <div className="flex-1 flex flex-col justify-between overflow-y-auto">
//           <main className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 space-y-8">
//             {/* Achievements Grid */}
//             <Card>
//               <CardHeader
//                 title="Your Achievements"
//                 icon={<Trophy className="h-5 w-5 text-[#72a210]" />}
//               />
//               <CardContent>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                   {achievements.map((a) => (
//                     <div
//                       key={a.id}
//                       className={`relative flex flex-col items-center text-center p-6 rounded-xl border border-[#72a210]
//                         bg-[#72a210]/10 dark:bg-[#72a210]/20 transition-all duration-300
//                         hover:scale-105 hover:shadow-lg cursor-pointer
//                         ${!a.unlocked ? "opacity-60 grayscale hover:grayscale-0" : ""}`}
//                     >
//                       {/* Image */}
//                       <img
//                         src={a.image}
//                         alt={a.name}
//                         className={`w-22 h-20 transition-all duration-300 ${
//                           !a.unlocked ? "grayscale" : ""
//                         }`}
//                       />

//                       {/* Lock Overlay for Locked Achievements */}
//                       {!a.unlocked && (
//                         <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
//                           <Lock className="h-8 w-8 text-white opacity-80" />
//                         </div>
//                       )}

//                       {/* Text */}
//                       <p className="font-semibold text-gray-900 dark:text-gray-100 mt-3 text-base">
//                         {a.name}
//                       </p>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">
//                         {a.description}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </main>

//           <Nav />

//           {/* Footer */}
//           <LearnerFooter />
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Lock } from "lucide-react";

import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import Nav from "@/components/ui/learner-nav";
import LearnerFooter from "@/components/ui/learner-footer";

// Reusable Card Wrapper
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) => (
  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
    {icon}
    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
      {title}
    </h2>
  </div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4">{children}</div>
);

export default function AchievementsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://cy-backend.onrender.com/api/v1/badges");

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const json = await res.json();

        if (json.data) {
          const mapped = json.data.map((badge: any, index: number) => ({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            image: `https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%20${index + 1}.png`,
            unlocked: false, // TODO: update with actual user data
          }));

          setAchievements(mapped);
          setError(null);
        } else {
          throw new Error("Invalid data from server");
        }
      } catch (err: any) {
        console.error("Failed to load achievements:", err);
        setError(err.message || "Failed to load achievements");
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 space-y-8">
            <Card>
              <CardHeader
                title="Your Achievements"
                icon={<Trophy className="h-5 w-5 text-[#72a210]" />}
              />
              <CardContent>
                {loading && <p className="text-gray-600 dark:text-gray-400">Loading achievements...</p>}

                {error && (
                  <p className="text-red-600 dark:text-red-400">
                    {error}. Please try again later.
                  </p>
                )}

                {!loading && !error && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {achievements.map((a) => (
                      <div
                        key={a.id}
                        className={`relative flex flex-col items-center text-center p-6 rounded-xl border border-[#72a210]
                          bg-[#72a210]/10 dark:bg-[#72a210]/20 transition-all duration-300
                          hover:scale-105 hover:shadow-lg cursor-pointer
                          ${!a.unlocked ? "opacity-60 grayscale hover:grayscale-0" : ""}`}
                      >
                        <img
                          src={a.image}
                          alt={a.name}
                          className={`w-22 h-20 transition-all duration-300 ${
                            !a.unlocked ? "grayscale" : ""
                          }`}
                        />
                        {!a.unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                            <Lock className="h-8 w-8 text-white opacity-80" />
                          </div>
                        )}
                        <p className="font-semibold text-gray-900 dark:text-gray-100 mt-3 text-base">
                          {a.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {a.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </main>

          <Nav />
          <LearnerFooter />
        </div>
      </div>
    </div>
  );
}
