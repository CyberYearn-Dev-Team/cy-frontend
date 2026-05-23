"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Lock } from "lucide-react";
import { getBadges, getGamificationData } from "@/lib/services/gamificationService";

interface Badge {
  id: string;
  code: string;
  name: string;
  description: string;
  unlocked: boolean;
  image: string;
  [key: string]: any; // For any additional properties that might exist
}
import { Skeleton } from "@/components/ui/skeleton";

import Sidebar from "@/components/learner-sidebar";
import Header from "@/components/learner-header";
import Nav from "@/components/learner-nav";
import LearnerFooter from "@/components/learner-footer";

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
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const badgeImages = [
    "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%201.png",
    "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%202.png",
    "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%203.png",
    "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%204.png",
    "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%205.png",
    "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%206.png",
    "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%202.png",
    "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%201.png",
    "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/achievement%204.png",
  ];

   useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch badges and gamification data in parallel
        const [badgesResult, gamificationResult] = await Promise.all([
          getBadges(),
          getGamificationData()
        ]);

        const backendBadges = badgesResult?.data ?? [];
        const unlockedBadgeCodes = (gamificationResult?.data?.badges || []).map((b: any) => b.code);

        // Map badges with their unlocked status
        const normalizedBadges = backendBadges
          .map((badge: any, index: number) => ({
            ...badge,
            unlocked: unlockedBadgeCodes.includes(badge.code),
            image: badgeImages[index % badgeImages.length],
          }))
          // Sort to show unlocked badges first
          .sort((a: Badge, b: Badge) => 
            (b.unlocked ? 1 : 0) - (a.unlocked ? 1 : 0)
          );

        setBadges(normalizedBadges);
      } catch (err) {
        console.error("Error fetching badges:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch badges"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);



  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 space-y-8 mb-20">
            <Card>
              <CardHeader
                title="Your Achievements"
                icon={<Trophy className="h-5 w-5 text-[#72a210]" />}
              />
              <CardContent>
                {error && (
                  <p className="text-red-600 dark:text-red-400">
                    {error}. Please try again later.
                  </p>
                )}

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center space-y-3 p-6 w-full"
                      >
                        <Skeleton className="h-20 w-full" />{" "}
                        {/* image placeholder as rectangle */}
                        <Skeleton className="h-5 w-3/4" />{" "}
                        {/* title placeholder */}
                        <Skeleton className="h-4 w-full" />{" "}
                        {/* description placeholder */}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {badges.map((b) => (
                      <div
                        key={b.id}
                        className={`relative flex flex-col items-center text-center p-6 rounded-xl border border-[#72a210]
                        transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer
                        ${
                          b.unlocked
                            ? "opacity-100 grayscale-0"
                            : "opacity-60 grayscale"
                        }`}
                      >
                        <img
                          src={b.image}
                          alt={b.name}
                          className="w-22 h-20 transition-all duration-300"
                        />

                        {!b.unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                            <Lock className="h-8 w-8 text-white opacity-80" />
                          </div>
                        )}

                        <p className="font-semibold text-gray-900 dark:text-gray-100 mt-3 text-base">
                          {b.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {b.description || b.desciption}
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
