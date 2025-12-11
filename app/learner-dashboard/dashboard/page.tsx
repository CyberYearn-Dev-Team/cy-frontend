"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/api/auth";
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
import { getRewards } from "@/lib/services/gamificationService";
import {
  getContinueLearning,
  ContinueLearningItem,
} from "@/lib/services/ContinueLearningService";
import AchievementsSection from "@/components/ui/AchievementsSection";

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
}

interface Track {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
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

// UI Helpers (same as your original code)
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

// A reusable placeholder for empty sections 
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
  const [badges, setBadges] = useState<Array<{code: string; name: string; description: string; awardedAt: string}>>([]);

  // Update achievements loading state when gamification data is loaded
  useEffect(() => {
    // Set loading to false once we have the gamification data
    const timer = setTimeout(() => {
      setIsLoading((prev) => ({ ...prev, achievements: false }));
    }, 500); // Small delay to ensure smooth transition
    
    return () => clearTimeout(timer);
  }, [xp, level, streak, badgesCount]);

  useEffect(() => {
    async function loadGamification() {
      try {
        const currentUser = await getCurrentUser();
        const email = currentUser?.email || "";

        if (!email) {
          console.warn("No user email found — skipping gamification fetch");
          return;
        }

        const res = await getRewards(email);

        if (res?.data) {
          const totalXp = res.data.totalXp || 0;
          setXp(totalXp);
          setLevel(Math.floor(totalXp / 100));
          setStreak(res.data.streak?.currentDays || 0);
          setBadgesCount(res.data.badges?.length || 0);
          setBadges(res.data.badges || []);
        }
      } catch (err) {
        console.error("Gamification error:", err);
      }
    }

    loadGamification();
  }, []);

  // Add your new useEffect here
  useEffect(() => {
    const loadCurrentUser = async () => {
      const currentUser = await getCurrentUser();
      console.log("Current User:", currentUser);
    };

    loadCurrentUser();
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [continueLearning, setContinueLearning] = useState<
    ContinueLearningItem[]
  >([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState({
    continueLearning: true,
    recentActivities: true,
    achievements: true,
  });

  useEffect(() => {
    const fetchAndProcessProgress = async () => {
    try {
      const response = await fetch("https://cy-backend.onrender.com/api/v1/me/progress/summary", {
        credentials: "include"
      });
      const data = await response.json();
      
      if (data?.data?.trackProgress) {
        const trackProgress: TrackProgress[] = data.data.trackProgress;
        
        // Find main track (IN_PROGRESS with highest progress)
        const inProgressTracks = trackProgress.filter(
          (t: TrackProgress) => t.status === "IN_PROGRESS"
        );
        
        let mainTrack = inProgressTracks.sort(
          (a: TrackProgress, b: TrackProgress) => b.progress - a.progress
        )[0];

        // Get all NOT_STARTED tracks
        const notStartedTracks = trackProgress.filter(
          (t: TrackProgress) => t.status === "NOT_STARTED"
        );

        let suggestions: TrackProgress[] = [];

        if (mainTrack) {
          // Filter by same level
          const sameLevelTracks = notStartedTracks.filter(
            (t: TrackProgress) => t.level === mainTrack.level
          );
          
          if (sameLevelTracks.length > 0) {
            // Show all same level tracks, sorted by progress
            suggestions = sameLevelTracks
              .sort((a: TrackProgress, b: TrackProgress) => b.progress - a.progress);
          } else {
            // Fallback: all NOT_STARTED sorted by progress
            suggestions = [...notStartedTracks]
              .sort((a: TrackProgress, b: TrackProgress) => b.progress - a.progress);
          }
        } else {
          // No main track, get all NOT_STARTED sorted by progress
          suggestions = notStartedTracks
            .sort((a: TrackProgress, b: TrackProgress) => b.progress - a.progress);
        }

        // Map to Track format expected by the UI
        setSuggestedTracks(
          suggestions.map((t: TrackProgress) => ({
            id: t.trackId,
            title: t.title,
            description: `Start learning ${t.title}`,
            thumbnail: t.thumbnail || "",
          }))
        );

        // Process recent activities
        const activities: ActivityItem[] = [];
        trackProgress.forEach((track: TrackProgress) => {
          if (track.status === "IN_PROGRESS" || track.status === "COMPLETED") {
            const statusText = track.status === "COMPLETED" ? "Completed" : "In Progress";
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
            .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
            .slice(0, 5)
        );
        setIsLoading(prev => ({ ...prev, recentActivities: false }));
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      setIsLoading(prev => ({ ...prev, recentActivities: false }));
    }
  };

  const fetchData = async () => {
      try {
        const [continueData] = await Promise.all([
          getContinueLearning()
        ]);

        setContinueLearning(continueData || []);
        setIsLoading((prev) => ({ ...prev, continueLearning: false }));
        
        // Fetch and process progress data
        await fetchAndProcessProgress();
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        // Ensure loaders are turned off to avoid infinite spinners
        setIsLoading({
          continueLearning: false,
          recentActivities: false,
          achievements: false,
        });
      }
    };

    fetchData();
  }, []);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [suggestedTracks, setSuggestedTracks] = useState<Track[]>([]);
  const becauseItems: any[] = [];
  const comingItems: any[] = [];
  const achievementItems: any[] = []; // Now empty

  // Refs and scroll functions
  const continueWatchingRef = useRef<HTMLDivElement | null>(null);
  const scrollContinueWatchingBy = (delta: number) => {
    const el = continueWatchingRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };
  // Provide the names the JSX expects (wrappers)
  const scrollContinueLeft = () => scrollContinueWatchingBy(-300);
  const scrollContinueRight = () => scrollContinueWatchingBy(300);

  const continueLearningRef = useRef<HTMLDivElement | null>(null);
  const scrollContinueLearningBy = (delta: number) => {
    if (continueLearningRef.current) {
      continueLearningRef.current.scrollLeft += delta;
    }
  };
  const scrollContinueLearningLeft = () => scrollContinueLearningBy(-300);
  const scrollContinueLearningRight = () => scrollContinueLearningBy(300);

  const suggestedRef = useRef<HTMLDivElement>(null);
  const scrollSuggestedBy = (delta: number) => {
    const el = suggestedRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };
  const scrollSuggestedLeft = () => scrollSuggestedBy(-300);
  const scrollSuggestedRight = () => scrollSuggestedBy(300);

  const becauseRef = useRef<HTMLDivElement | null>(null);
  const scrollBecauseBy = (delta: number) => {
    const el = becauseRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };
  const scrollBecauseLeft = () => scrollBecauseBy(-300);
  const scrollBecauseRight = () => scrollBecauseBy(300);

  const comingRef = useRef<HTMLDivElement | null>(null);
  const recentActivitiesRef = useRef<HTMLDivElement | null>(null);
  const scrollComingBy = (delta: number) => {
    const el = comingRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };
  const scrollComingLeft = () => scrollComingBy(-300);
  const scrollComingRight = () => scrollComingBy(300);

  const router = useRouter();

  const handleContinueTrack = async (e: React.MouseEvent, trackId: string, trackSlug: string) => {
    e.stopPropagation();
    const toastId = toast.loading('Loading track...');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      if (apiUrl) {
        await fetch(`${apiUrl}/tracks/${trackId}/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        toast.success('Track loaded successfully!', { id: toastId });
      }
    } catch (error) {
      console.error('Error starting track:', error);
      toast.dismiss(toastId);
    } finally {
      router.push(`/learner-dashboard/tracks/${trackSlug}`);
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="max-w-7xl mx-auto space-y-10">
              {/* Hero + Stats Container */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Hero Banner - 70% */}
                <div className="w-full lg:flex-[0.8]">
                  <div
                    className={`rounded-2xl p-8 text-white relative overflow-hidden h-full`}
                    style={{
                      background: `linear-gradient(90deg, ${primary}, ${hover}, ${secondary})`,
                    }}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                          ONLINE COURSE
                        </span>
                      </div>
                      <h1 className="text-3xl font-bold mb-4 leading-snug">
                        Sharpen Your Skills with <br />
                        Professional Online Courses
                      </h1>
                      <Link href="/learner-dashboard/tracks">
                        <Button
                          variant="secondary"
                          className={`bg-white text-[${secondary}] hover:bg-gray-100 cursor-pointer 
                            dark:bg-transparent dark:text-white dark:border dark:border-white dark:hover:bg-white dark:hover:text-black`}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Learning Now
                        </Button>
                      </Link>
                    </div>
                    <div className="absolute top-12 right-15 w-55 h-55 opacity-90 hidden sm:block">
                      <img
                        src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/CyberYearn_favicon.png"
                        alt="Hero decoration"
                        className="w-full h-full object-contain transform translate-x-10 -translate-y-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Section - 30% */}
                {isLoading.achievements ? (
                  <DashboardStatsSkeleton />
                ) : (
                  <div className="w-full lg:flex-[0.3] grid grid-cols-2 gap-6">
                    <Card>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-4">
                            <p className={`text-sm font-medium ${textMedium}`}>
                              Total XP
                            </p>
                            <p className={`text-2xl font-bold ${textDark}`}>
                              {xp || 0}
                            </p>
                          </div>
                          <Zap
                            className={`h-8 w-8`}
                            style={{ color: primary }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-4">
                            <p className={`text-sm font-medium ${textMedium}`}>
                              Level (XP)
                            </p>
                            <p className={`text-2xl font-bold ${textDark}`}>
                              {level || 0}
                            </p>
                          </div>
                          <Star
                            className={`h-8 w-8`}
                            style={{ color: primary }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-4">
                            <p className={`text-sm font-medium ${textMedium}`}>
                              Streak
                            </p>
                            <p className={`text-2xl font-bold ${textDark}`}>
                              {streak || 0}
                            </p>
                          </div>
                          <Flame
                            className={`h-8 w-8`}
                            style={{ color: secondary }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-4">
                            <p className={`text-sm font-medium ${textMedium}`}>
                              Badges
                            </p>
                            <p className={`text-2xl font-bold ${textDark}`}>
                              {badgesCount || 0}
                            </p>
                          </div>
                          <Award
                            className={`h-8 w-8`}
                            style={{ color: primary }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Continue Watching + Recent Activity Container */}
              <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
                {/* Main Content - 60% */}
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
                      {isLoading.continueLearning ? (
                        <ContinueLearningSkeleton />
                      ) : continueLearning.length > 0 ? (
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
                                onClick={() => router.push(`/learner-dashboard/tracks/${item.slug}`)}
                              >
                                <img
                                  src={
                                    item.thumbnail
                                      ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${item.thumbnail}`
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
                                    onClick={(e) => handleContinueTrack(e, item.id, item.slug)}
                                    className={`w-full text-center text-xs font-medium py-1.5 px-3 rounded-md transition-colors cursor-pointer`}
                                    style={{
                                      backgroundColor: primary,
                                      color: 'white',
                                      border: `1px solid ${primary}`,
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = hover;
                                      e.currentTarget.style.borderColor = hover;
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = primary;
                                      e.currentTarget.style.borderColor = primary;
                                    }}
                                  >
                                    Continue Learning
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon={BookOpen}
                          title="Start Your Learning Journey"
                          message="Once you start learning, you can track your progress and continue from where you left off right here."
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity - 40% */}
                <div className="w-full lg:w-[40%] xl:w-[40%] min-w-0">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className={`h-5 w-5 ${textMedium}`} />
                        <span>Recent Activity</span>
                      </CardTitle>
                    </CardHeader>

                    {/* ADDED max-h + scroll here */}
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
                                  {typeof activity.progress === 'number' && (
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
                      {suggestedTracks.length > 0 ? (
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
                                      ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${track.thumbnail}`
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
                                  <p className={`text-xs ${textLight} line-clamp-2`}>
                                    {track.description}
                                  </p>
                                </div> 
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/learner-dashboard/tracks?highlight=${track.id}`);
                                  }}
                                  className={`mt-2 w-full flex items-center justify-center gap-1 text-xs font-medium py-1.5 px-3 rounded-md transition-colors cursor-pointer`}
                                  style={{
                                    backgroundColor: primary,
                                    color: 'white',
                                    border: `1px solid ${primary}`,
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = hover;
                                    e.currentTarget.style.borderColor = hover;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = primary;
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
                        <SuggestedForYouSkeleton />
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
                                  )
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
                  <CardHeader>
                    <CardTitle className={`text-[${secondary}]`}>
                      Coming Soon
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ComingSoonSection />
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