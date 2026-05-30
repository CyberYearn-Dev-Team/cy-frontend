"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";
import { getCurrentUser } from "@/lib/api/auth";
import { getGamificationData } from "@/lib/services/gamificationService";
import { getRewards } from "@/lib/services/gamificationService";
import { progressService } from "@/lib/api/progress";
import ComingSoonSection from "@/components/ui/ComingSoonSection";
import {
  ContinueLearningSkeleton,
  RecentActivitySkeleton,
  AchievementsSkeleton,
  SuggestedForYouSkeleton,
} from "@/components/ui/DashboardSkeletons";
import DashboardStatsSkeleton from "@/components/ui/DashboardStatsSkeleton";
import {
  BookOpen,
  FlaskConical,
  Trophy,
  Zap,
  Clock,
  Target,
  TrendingUp,
  Play,
  BarChart3,
  Users,
  Plus,
  MoreHorizontal,
  Star,
  ChevronLeft,
  ChevronRight,
  Award,
  Flame,
  ArrowRight,
  X,
  BookAIcon,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import Sidebar from "@/components/learner-sidebar";
import Header from "@/components/learner-header";
import Nav from "@/components/learner-nav";
import LearnerFooter from "@/components/learner-footer";
import {
  getContinueLearning,
  ContinueLearningItem,
} from "@/lib/services/ContinueLearningService";

// Theme Colors
const primary = "#72a210";
const secondary = "#507800";
const hover = "#5a850d";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLight = "text-gray-500 dark:text-gray-300";

interface TrackProgress {
  trackId: string;
  title: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  progress: number;
  level: string;
  completedLessons: number;
  totalLessons: number;
  thumbnail?: string;
  description?: string;
  slug?: string;
  track?: {
    slug?: string;
    thumbnail?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface Track {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  slug: string;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  status: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";
  type: "track" | "module" | "lesson";
  progress: number;
  timestamp?: Date;
  trackTitle?: string;
}

// UI Helpers
const Progress = ({ value }: { value: number }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
    <div
      className="h-2 rounded-full transition-all duration-300"
      style={{
        width: `${Math.min(100, Math.max(0, value))}%`,
        backgroundColor: primary,
      }}
    />
  </div>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 ${textMedium}`}
  >
    {children}
  </span>
);

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`${bgCard} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}
  >
    {children}
  </div>
);

const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3 className={`text-lg font-semibold ${textDark} ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className={`text-sm ${textMedium} mt-1`}>{children}</p>
);

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`px-6 py-4 ${className}`}>{children}</div>;

const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClass =
    variant === "secondary"
      ? `bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 ${textMedium} focus:ring-gray-500`
      : `text-white`;

  const style =
    variant === "primary"
      ? { backgroundColor: primary, borderColor: primary, color: "#fff" }
      : undefined;

  return (
    <button
      className={`${baseClasses} ${variantClass} ${className}`}
      style={style}
      {...(props as any)}
    >
      {children}
    </button>
  );
};

const EmptyState = ({
  icon: Icon,
  title,
  message,
}: {
  icon: React.ElementType;
  title: string;
  message: string;
}) => (
  <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500 dark:text-gray-400">
    <Icon className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
    <h4 className={`font-semibold ${textDark}`}>{title}</h4>
    <p className={`text-sm ${textMedium}`}>{message}</p>
  </div>
);

// Dashboard
export default function LearnerDashboard() {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badgesCount, setBadgesCount] = useState(0);
  const [badges, setBadges] = useState<
    Array<{
      code: string;
      name: string;
      description: string;
      awardedAt: string;
    }>
  >([]);

  // Refs for carousels
  const suggestedRef = useRef<HTMLDivElement>(null);
  const comingSoonRef = useRef<HTMLDivElement>(null);

  // Scroll handlers for suggested tracks carousel
  const scrollSuggestedLeft = () => {
    if (suggestedRef.current) {
      suggestedRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollSuggestedRight = () => {
    if (suggestedRef.current) {
      suggestedRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  // Scroll handlers for coming soon carousel
  const scrollComingSoonLeft = () => {
    if (comingSoonRef.current) {
      comingSoonRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollComingSoonRight = () => {
    if (comingSoonRef.current) {
      comingSoonRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading((prev) => ({ ...prev, achievements: false }));
    }, 500);
    return () => clearTimeout(timer);
  }, [xp, level, streak, badgesCount]);

  useEffect(() => {
    async function loadGamification() {
      try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.email) {
          console.warn("No user email found — skipping gamification fetch");
          return;
        }

        const response = await getGamificationData();

        if (response?.data) {
          const {
            totalXp = 0,
            badges = [],
            streak = { currentDays: 0 },
          } = response.data;

          setXp(totalXp);
          setLevel(Math.floor(totalXp / 100));
          setStreak(streak.currentDays || 0);
          setBadgesCount(badges.length);
          setBadges(badges);

          // Update loading state
          setIsLoading((prev) => ({ ...prev, achievements: false }));
        }
      } catch (err) {
        console.error("Error loading gamification data:", err);
        // Ensure loading state is updated even on error
        setIsLoading((prev) => ({ ...prev, achievements: false }));
      }
    }

    loadGamification();
  }, []);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const currentUser = await getCurrentUser();
      // console.log("Current User:", currentUser);
    };

    loadCurrentUser();
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [continueLearning, setContinueLearning] = useState<
    ContinueLearningItem[]
  >([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [suggestedTracks, setSuggestedTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState({
    continueLearning: true,
    recentActivities: true,
    achievements: true,
    suggestedTracks: true,
  });

  // NEW: Separate state to know if we have finished checking for data
  const [hasCheckedContinueLearning, setHasCheckedContinueLearning] =
    useState(false);

  useEffect(() => {
    const fetchAndProcessProgress = async () => {
      try {
        const data = await progressService.getProgressSummary();

        if (data?.data?.trackProgress) {
          const trackProgress: TrackProgress[] = data.data.trackProgress;

          // Build Continue Learning from IN_PROGRESS tracks
          const continueLearningItems = trackProgress
            .filter((t) => t.status === "IN_PROGRESS")
            .map((t) => ({
              id: t.trackId,
              title: t.title,
              description: t.description || "",
              thumbnail: t.thumbnail || "/placeholder.png",
              progress: t.progress || 0,
              instructor: "Instructor Name",
              instructorTitle: "Instructor",
              slug: t.slug || t.trackId,
            }));

          setContinueLearning(continueLearningItems);
          setIsLoading((prev) => ({ ...prev, continueLearning: false }));
          setHasCheckedContinueLearning(true); // We have data now

          // ... rest of your existing logic for suggestions and recent activities (unchanged)
          const inProgressTracks = trackProgress.filter(
            (t: TrackProgress) => t.status === "IN_PROGRESS",
          );

          let mainTrack = inProgressTracks.sort(
            (a: TrackProgress, b: TrackProgress) => b.progress - a.progress,
          )[0];

          const notStartedTracks = trackProgress.filter(
            (t: TrackProgress) => t.status === "NOT_STARTED",
          );

          let suggestions: TrackProgress[] = [];

          if (mainTrack) {
            const sameLevelTracks = notStartedTracks.filter(
              (t: TrackProgress) => t.level === mainTrack.level,
            );

            if (sameLevelTracks.length > 0) {
              suggestions = sameLevelTracks.sort(
                (a: TrackProgress, b: TrackProgress) => b.progress - a.progress,
              );
            } else {
              suggestions = [...notStartedTracks].sort(
                (a: TrackProgress, b: TrackProgress) => b.progress - a.progress,
              );
            }
          } else {
            suggestions = notStartedTracks.sort(
              (a: TrackProgress, b: TrackProgress) => b.progress - a.progress,
            );
          }

          setSuggestedTracks(
            suggestions.map((t: any) => ({
              id: t.trackId,
              title: t.title,
              description: `Start learning ${t.title}`,
              thumbnail: t.thumbnail || "",
              slug: t.slug || t.trackId,
            })),
          );
          setIsLoading((prev) => ({ ...prev, suggestedTracks: false }));

          // Recent activities
          const activities: ActivityItem[] = [];
          trackProgress.forEach((track: TrackProgress) => {
            if (
              track.status === "IN_PROGRESS" ||
              track.status === "COMPLETED"
            ) {
              const statusText =
                track.status === "COMPLETED" ? "Completed" : "In Progress";
              activities.push({
                id: `track-${track.trackId}`,
                title: `${statusText}: ${track.title}`,
                description: `Progress: ${track.progress}% • ${track.completedLessons} of ${track.totalLessons || "?"} lessons`,
                status: track.status,
                type: "track",
                progress: track.progress,
                trackTitle: track.title,
                timestamp: new Date(),
              });
            }
          });

          setRecentActivities(
            activities
              .sort(
                (a, b) =>
                  (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0),
              )
              .slice(0, 5),
          );
          setIsLoading((prev) => ({ ...prev, recentActivities: false }));
        } else {
          // No trackProgress data at all → no in-progress items
          setContinueLearning([]);
          setIsLoading((prev) => ({ ...prev, continueLearning: false }));
          setHasCheckedContinueLearning(true);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
        setContinueLearning([]);
        setIsLoading((prev) => ({
          ...prev,
          continueLearning: false,
          recentActivities: false,
          suggestedTracks: false,
        }));
        setHasCheckedContinueLearning(true);
      }
    };

    const fetchData = async () => {
      try {
        // We no longer rely on getContinueLearning() for the list
        // Everything comes from progress summary
        await fetchAndProcessProgress();
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        toast.error("Failed to load dashboard data. Please try again.");
        setIsLoading({
          continueLearning: false,
          recentActivities: false,
          achievements: false,
          suggestedTracks: false,
        });
        setHasCheckedContinueLearning(true);
      }
    };

    fetchData();
  }, []);

  const becauseItems: any[] = [];
  const comingItems: any[] = [];
  const achievementItems: any[] = [];

  // Refs and scroll functions (unchanged)
  const continueWatchingRef = useRef<HTMLDivElement | null>(null);
  const scrollContinueWatchingBy = (delta: number) => {
    const el = continueWatchingRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };
  const scrollContinueLeft = () => scrollContinueWatchingBy(-300);
  const scrollContinueRight = () => scrollContinueWatchingBy(300);

  // ... other scroll refs unchanged ...

  const router = useRouter();

  const handleContinueTrack = async (
    e: React.MouseEvent,
    trackId: string,
    trackSlug: string,
  ) => {
    e.stopPropagation();
    const toastId = toast.loading("Loading track...");

    try {
      const { data } = await apiClient.post(`/tracks/${trackId}/start`);
      toast.success(data.message || "Track loaded successfully!", {
        id: toastId,
      });
    } catch (error) {
      console.error("Error starting track:", error);
      toast.dismiss(toastId);
      toast.error("Failed to start track. Please try again.");
    } finally {
      if (trackSlug) {
        router.push(`/learner-dashboard/tracks/${trackSlug}`);
      }
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 mb-20">
            <div className="max-w-7xl mx-auto space-y-10">
              {/* Hero + Stats Container */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Hero Banner */}
                <div className="w-full lg:flex-[0.8]">
                  <div
                    className={`rounded-2xl p-5 lg:p-6 text-white relative overflow-hidden h-full`}
                    style={{
                      background: `linear-gradient(90deg, ${primary}, ${hover}, ${secondary})`,
                    }}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                          ONLINE COURSE
                        </span>
                      </div>
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 drop-shadow-sm">
                        Sharpen Your Skills with <br />
                        Professional Online Courses
                      </h1>
                      <Link href="/learner-dashboard/tracks">
                        <button
                          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2
      px-6 py-3 rounded-full font-bold text-sm mt-5
      bg-white text-black hover:bg-gray-100 cursor-pointer shadow-md
      dark:bg-white dark:text-black `}
                        >
                          <Play className="h-4 w-4" />
                          Start Learning Now
                        </button>
                      </Link>
                    </div>
                    <div className="absolute top-12 right-15 w-50 h-50 opacity-90 hidden sm:block">
                      <img
                        src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/CyberYearn_favicon.png"
                        alt="Hero decoration"
                        className="w-full h-full object-contain transform translate-x-10 -translate-y-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Section */}
                {isLoading.achievements ? (
                  <DashboardStatsSkeleton />
                ) : (
                  <div className="w-full lg:flex-[0.3] grid grid-cols-2 gap-4">
                    <Link
                      href="#"
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-5 py-3 rounded-2xl group hover:border-[#72a210] dark:hover:border-[#a3e635] transition-all"
                    >
                      <div className="flex justify-between items-start mb-3 lg:mb-1">
                        <div className="p-2 bg-[#72a210]/10 dark:bg-[#a3e635]/10 rounded-lg group-hover:bg-[#72a210]/20 dark:group-hover:bg-[#a3e635]/20 transition-colors">
                          <Zap className="w-5 h-5 text-[#72a210] dark:text-[#a3e635]" />
                        </div>
                        {/* <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
                      </div>
                      <p className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter mb-1 text-gray-900 dark:text-gray-100">
                        {xp || 0}
                      </p>
                      <p className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 tracking-widest">
                        Total XP
                      </p>
                    </Link>

                    <Link
                      href="#"
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-5 py-3 rounded-2xl group hover:border-[#72a210] dark:hover:border-[#a3e635] transition-all"
                    >
                      <div className="flex justify-between items-start mb-3 lg:mb-1">
                        <div className="p-2 bg-[#72a210]/10 dark:bg-[#a3e635]/10 rounded-lg group-hover:bg-[#72a210]/20 dark:group-hover:bg-[#a3e635]/20 transition-colors">
                          <Star className="w-5 h-5 text-[#72a210] dark:text-[#a3e635]" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter mb-1 text-gray-900 dark:text-gray-100">
                        {level || 0}
                      </p>
                      <p className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 tracking-widest">
                        Level (XP)
                      </p>
                    </Link>

                    <Link
                      href="#"
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-5 py-3 rounded-2xl group hover:border-[#72a210] dark:hover:border-[#a3e635] transition-all"
                    >
                      <div className="flex justify-between items-start mb-3 lg:mb-1">
                        <div className="p-2 bg-[#507800]/10 dark:bg-[#72a210]/10 rounded-lg group-hover:bg-[#507800]/20 dark:group-hover:bg-[#72a210]/20 transition-colors">
                          <Flame className="w-5 h-5 text-[#507800] dark:text-[#72a210]" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter mb-1 text-gray-900 dark:text-gray-100">
                        {streak || 0}
                      </p>
                      <p className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 tracking-widest">
                        Streak
                      </p>
                    </Link>

                    <Link
                      href="#"
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-5 py-3 rounded-2xl group hover:border-[#72a210] dark:hover:border-[#a3e635] transition-all"
                    >
                      <div className="flex justify-between items-start mb-3 lg:mb-1">
                        <div className="p-2 bg-[#72a210]/10 dark:bg-[#a3e635]/10 rounded-lg group-hover:bg-[#72a210]/20 dark:group-hover:bg-[#a3e635]/20 transition-colors">
                          <Award className="w-5 h-5 text-[#72a210] dark:text-[#a3e635]" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter mb-1 text-gray-900 dark:text-gray-100">
                        {badgesCount || 0}
                      </p>
                      <p className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 tracking-widest">
                        Badges
                      </p>
                    </Link>
                  </div>
                )}
              </div>



              {/* Continue Learning + Recent Activity */}
              <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
                <div className="w-full lg:w-[60%] xl:w-[110%] min-w-0 space-y-8">
                  <Card className="h-full">
                    <CardHeader className="flex sm:flex-row items-start sm:items-center justify-between">
                      <CardTitle className={`text-[${secondary}]`}>
                        Continue Learning
                      </CardTitle>
                      {continueLearning.length > 0 && (
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <button onClick={scrollContinueLeft}>
                            <ChevronLeft
                              className={`${textLight} hover:text-[${secondary}] cursor-pointer`}
                            />
                          </button>
                          <button onClick={scrollContinueRight}>
                            <ChevronRight
                              className={`${textLight} hover:text-[${secondary}] cursor-pointer`}
                            />
                          </button>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="h-full">
                      {/* FIXED CONDITION: Show empty state only AFTER we have checked the data */}
                      {isLoading.continueLearning ? (
                        <ContinueLearningSkeleton />
                      ) : hasCheckedContinueLearning &&
                        continueLearning.length === 0 ? (
                        <EmptyState
                          icon={BookOpen}
                          title="Start Your Learning Journey"
                          message="Once you start learning, you can track your progress and continue from where you left off right here."
                        />
                      ) : (
                        <div
                          ref={continueWatchingRef}
                          className="flex gap-4 overflow-x-auto overflow-y-hidden lg:overflow-x-hidden no-scrollbar py-2 px-1 sm:px-2 scroll-smooth snap-x snap-mandatory"
                        >
                          {continueLearning.map((item: any) => (
                            <div
                              key={item.id}
                              className="group min-w-[280px] max-w-[280px] flex-shrink-0 snap-start"
                            >
                              <div
                                className="relative mb-3 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 h-[160px] cursor-pointer"
                                onClick={() =>
                                  router.push(
                                    `/learner-dashboard/tracks/${item.slug}`,
                                  )
                                }
                              >
                                <img
                                  src={
                                    item.thumbnail
                                      ? item.thumbnail
                                      : "/placeholder.png"
                                  }
                                  alt={item.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <div className="space-y-2 h-[140px] flex flex-col justify-between">
                                <div>
                                  <h3
                                    className={`font-semibold text-sm leading-tight ${textDark} group-hover:text-[${primary}] transition-colors line-clamp-3`}
                                  >
                                    {item.title}
                                  </h3>
                                  <p
                                    className={`text-xs ${textLight} line-clamp-2 mt-1`}
                                    dangerouslySetInnerHTML={{
                                      __html: item.description,
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <p className={`text-xs ${textLight}`}>
                                    {item.progress}% complete
                                  </p>
                                  <Progress value={item.progress} />
                                  <button
                                    onClick={(e) =>
                                      handleContinueTrack(e, item.id, item.slug)
                                    }
                                    className={`w-full text-center text-xs font-medium py-1.5 px-3 rounded-md transition-colors cursor-pointer`}
                                    style={{
                                      backgroundColor: primary,
                                      color: "white",
                                      border: `1px solid ${primary}`,
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor =
                                        hover;
                                      e.currentTarget.style.borderColor = hover;
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor =
                                        primary;
                                      e.currentTarget.style.borderColor =
                                        primary;
                                    }}
                                  >
                                    Continue Learning
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity (unchanged) */}
                <div className="w-full lg:w-[40%] xl:w-[40%] min-w-0">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className={`h-5 w-5 ${textMedium}`} />
                        <span>Recent Activity</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 max-h-[450px] overflow-y-auto">
                      {isLoading.recentActivities ? (
                        <RecentActivitySkeleton />
                      ) : recentActivities.length > 0 ? (
                        <div className="space-y-4">
                          {recentActivities.slice(0, 4).map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {activity.title}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                  {typeof activity.progress === "number" && (
                                    <span className="ml-0 text-xs text-gray-500 dark:text-gray-400">
                                      {Math.round(activity.progress)}%
                                    </span>
                                  )}
                                  <div className="flex justify-end">
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        activity.status === "COMPLETED"
                                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                      }`}
                                    >
                                      {activity.status === "COMPLETED"
                                        ? "Completed"
                                        : "In Progress"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon={BookAIcon}
                          title="Ready to Learn?"
                          message="Your recent activities will appear here once you start exploring the platform."
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>



              {/* Suggested + Achievements (rest of component unchanged) */}
              {/* Suggested + Achievements Container */}
              <div className="flex flex-col lg:flex-row lg:items-stretch gap-6 w-full">
                {/* Main Content - 60% */}
                <div className="w-full lg:w-[60%] xl:w-[110%] min-w-0 space-y-8">
                  <Card className="h-full">
                    <CardHeader className="flex sm:flex-row items-start sm:items-center justify-between">
                      <CardTitle className={`text-[${secondary}]`}>
                        Suggested for You
                      </CardTitle>
                      {suggestedTracks.length > 0 && (
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <button onClick={scrollSuggestedLeft}>
                            <ChevronLeft
                              className={`${textLight} hover:text-[${secondary}] cursor-pointer`}
                            />
                          </button>
                          <button onClick={scrollSuggestedRight}>
                            <ChevronRight
                              className={`${textLight} hover:text-[${secondary}] cursor-pointer`}
                            />
                          </button>
                        </div>
                      )}
                    </CardHeader>

                    <CardContent>
                      {isLoading.suggestedTracks ? (
                        <SuggestedForYouSkeleton />
                      ) : suggestedTracks.length > 0 ? (
                        <div
                          ref={suggestedRef}
                          className="flex gap-4 overflow-x-auto overflow-y-hidden lg:overflow-x-hidden no-scrollbar py-2 px-1 sm:px-2 scroll-smooth snap-x snap-mandatory"
                        >
                          {suggestedTracks.map((track) => (
                            <div
                              key={track.id}
                              className="group cursor-pointer min-w-[280px] max-w-[280px] flex-shrink-0 snap-start"
                            >
                              <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 h-[160px]">
                                <img
                                  src={
                                    track.thumbnail
                                      ? track.thumbnail
                                      : "/placeholder.png"
                                  }
                                  alt={track.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <h3
                                    className={`font-semibold text-sm leading-tight ${textDark} group-hover:text-[${primary}] transition-colors line-clamp-2`}
                                  >
                                    {track.title}
                                  </h3>
                                  <p
                                    className={`text-xs ${textLight} line-clamp-2`}
                                  >
                                    {track.description}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) =>
                                    handleContinueTrack(e, track.id, track.slug)
                                  }
                                  className={`mt-2 w-full flex items-center justify-center gap-1 text-xs font-medium py-1.5 px-3 rounded-md transition-colors cursor-pointer`}
                                  style={{
                                    backgroundColor: primary,
                                    color: "white",
                                    border: `1px solid ${primary}`,
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      hover;
                                    e.currentTarget.style.borderColor = hover;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      primary;
                                    e.currentTarget.style.borderColor = primary;
                                  }}
                                >
                                  View Track
                                  <ArrowRight className="w-3 h-3 ml-1" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon={BookOpen}
                          title="No Recommendations Yet"
                          message="Complete more lessons to get personalized track recommendations."
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>



                {/* Achievements Section */}
                <div className="w-full lg:w-[40%] xl:w-[40%] min-w-0">
                  <Card className="h-full flex flex-col overflow-hidden">
                    <CardHeader className="flex-shrink-0 border-b dark:border-gray-800 pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Trophy className={`h-5 w-5 ${textMedium}`} />
                        <span>Your Achievements</span>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col justify-between py-6 space-y-8">
                      {isLoading.achievements ? (
                        // AchievementsSkeleton is imported and expected to render an appropriate skeleton
                        <AchievementsSkeleton />
                      ) : (
                        <div className="text-center">
                          {/* Count + header (THEMED) */}
                          <div
                            className="inline-flex items-center gap-2 font-semibold text-sm"
                            style={{ color: primary }}
                          >
                            <Award className="h-5 w-5" />
                            <span>Achievements</span>
                            <span
                              className="ml-2 px-3 py-0.5 rounded-full text-xs font-bold"
                              style={{
                                backgroundColor: "#72a21020",
                                color: primary,
                              }}
                            >
                              {badgesCount} unlocked
                            </span>
                          </div>

                          {/* Beautiful circular preview – THEMED GRADIENT */}
                          {badges.length > 0 ? (
                            <div className="flex justify-center">
                              <div className="flex -space-x-4">
                                {[...Array(Math.min(3, badges.length))].map(
                                  (_, i) => (
                                    <div
                                      key={i}
                                      className="w-18 h-18 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-gray-900 hover:scale-110 transition-transform cursor-pointer"
                                      style={{
                                        background:
                                          "linear-gradient(135deg, #72a210, #507800)",
                                      }}
                                    >
                                      <Trophy className="h-7 w-7 text-white" />
                                    </div>
                                  ),
                                )}

                                {badges.length > 3 && (
                                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-white dark:border-gray-900 text-xs font-bold text-gray-700 dark:text-gray-300">
                                    +{badges.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <EmptyState
                                icon={Trophy}
                                title="Your Achievements Await"
                                message="Complete lessons and earn badges"
                              />
                            </div>
                          )}

                          {/* Dynamic badge tags */}
                          {badges.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
                              {badges.map((badge, index) => (
                                <div
                                  key={badge.code || index}
                                  className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                                  title={badge.description}
                                >
                                  {badge.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>




              {/* Coming Soon Section */}
              <div className="w-full lg:w-[60%] xl:w-[72%]">
                <Card>
                  <CardHeader className="flex sm:flex-row items-start sm:items-center justify-between">
                    <CardTitle className={`text-[${secondary}]`}>
                      Coming Soon
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <button onClick={scrollComingSoonLeft}>
                        <ChevronLeft
                          className={`${textLight} hover:text-[${secondary}] cursor-pointer`}
                        />
                      </button>
                      <button onClick={scrollComingSoonRight}>
                        <ChevronRight
                          className={`${textLight} hover:text-[${secondary}] cursor-pointer`}
                        />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ComingSoonSection ref={comingSoonRef} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>

          <Nav />
          <LearnerFooter />
        </div>
      </div>
    </div>
  );
}
