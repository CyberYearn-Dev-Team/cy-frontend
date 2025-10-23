"use client";

import React, { useState, useRef } from "react";
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
  X,
  BookAIcon,
} from "lucide-react";

import Link from "next/link";
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import Nav from "@/components/ui/learner-nav";
import LearnerFooter from "@/components/ui/learner-footer";

// Theme Colors
const primary = "#72a210";
const secondary = "#507800";
const hover = "#5a850d";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLight = "text-gray-500 dark:text-gray-300";

interface Track {
  id: string;
  title: string;
  description: string;
}

// REMOVED: interface Mentor {} - No longer needed

// UI Helpers (same as your original code)
const Progress = ({ value }: { value: number }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
    <div
      className={`bg-[${primary}] h-2 rounded-full transition-all duration-300`}
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
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
  const variants = {
    primary: `bg-[${primary}] hover:bg-[${secondary}] text-white focus:ring-[${primary}]`,
    secondary: `bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 ${textMedium} focus:ring-gray-500`,
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// REMOVED: Reusable Mentor Item Component
// REMOVED: See All Mentors Modal Component

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
  <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500 dark:text-gray-400">
    <Icon className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
    <h4 className={`font-semibold ${textDark}`}>{title}</h4>
    <p className={`text-sm ${textMedium}`}>{message}</p>
  </div>
);

// Dashboard
export default function LearnerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // REMOVED: const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data is now initialized as empty arrays for a new user
  const continueWatchingItems: any[] = [];
  const suggestedItems: any[] = [];
  const becauseItems: any[] = [];
  const comingItems: any[] = [];
  // REMOVED: const allMentors: Mentor[] = [];

  // --- (MODIFIED) Mock Data: Set to empty array as requested ---
  const recentActivityItems: any[] = []; // Now empty
  const achievementItems: any[] = []; // Now empty
  // --- (END MODIFIED) Mock Data ---

  // Refs and scroll functions (no changes needed here)
  const continueWatchingRef = useRef<HTMLDivElement | null>(null);
  const scrollContinueBy = (delta: number) => {
    const el = continueWatchingRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };
  const scrollContinueLeft = () => scrollContinueBy(-300);
  const scrollContinueRight = () => scrollContinueBy(300);

  const suggestedRef = useRef<HTMLDivElement | null>(null);
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
  const scrollComingBy = (delta: number) => {
    const el = comingRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };
  const scrollComingLeft = () => scrollComingBy(-300);
  const scrollComingRight = () => scrollComingBy(300);

  // REMOVED: const visibleMentors = allMentors.slice(0, 5);

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
                    className={`bg-gradient-to-r from-[${primary}] via-[${hover}] to-[${secondary}] rounded-2xl p-8 text-white relative overflow-hidden h-full`}
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
                          className={`
                            bg-white text-[${secondary}] hover:bg-gray-100 cursor-pointer 
                            dark:bg-transparent dark:text-white dark:border dark:border-white dark:hover:bg-white dark:hover:text-black
                          `}
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
                <div className="w-full lg:flex-[0.3] grid grid-cols-2 gap-6">
                  <Card>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${textMedium}`}>
                            Current XP
                          </p>
                          <p className={`text-2xl font-bold ${textDark}`}>0</p>
                        </div>
                        <Zap className={`h-8 w-8 text-[${primary}]`} />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${textMedium}`}>
                            Level
                          </p>
                          <p className={`text-2xl font-bold ${textDark}`}>0</p>
                        </div>
                        <Trophy className={`h-8 w-8 text-[${primary}]`} />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${textMedium}`}>
                            Day Streak
                          </p>
                          <p className={`text-2xl font-bold ${textDark}`}>0</p>
                        </div>
                        <Target className={`h-8 w-8 text-[${secondary}]`} />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${textMedium}`}>
                            Rate
                          </p>
                          <p className={`text-2xl font-bold ${textDark}`}>0%</p>
                        </div>
                        <TrendingUp className={`h-8 w-8 text-[${primary}]`} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                      {continueWatchingItems.length > 0 && (
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
                    <CardContent className="h-full flex items-center justify-center">
                      {continueWatchingItems.length > 0 ? (
                        <div
                          ref={continueWatchingRef}
                          className="flex gap-4 overflow-x-auto overflow-y-hidden lg:overflow-x-hidden no-scrollbar py-2 px-1 sm:px-2 scroll-smooth snap-x snap-mandatory"
                        >
                          {continueWatchingItems.map((item: any) => (
                            <div
                              key={item.id}
                              className="group cursor-pointer min-w-[280px] max-w-[280px] flex-shrink-0 snap-start"
                            >
                              <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 h-[160px]">
                                <img
                                  src={item.thumbnail}
                                  alt={item.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <div className="space-y-2 h-[110px] flex flex-col justify-between">
                                <div>
                                  <h3
                                    className={`font-semibold text-sm leading-tight ${textDark} group-hover:text-[${primary}] transition-colors line-clamp-2`}
                                  >
                                    {item.title}
                                  </h3>
                                  <div
                                    className={`flex items-center text-xs ${textLight}`}
                                  >
                                    <span>{item.instructor}</span>
                                    <span className="mx-2">•</span>
                                    <span>{item.instructorTitle}</span>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <Progress value={item.progress} />
                                  <p className={`text-xs ${textLight}`}>
                                    {item.progress}% complete
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon={BookAIcon}
                          title="Start Your Journey"
                          message="Your active courses will appear here once you begin."
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* (MODIFIED) Recent Activity - 40% */}
                <div className="w-full lg:w-[40%] xl:w-[40%] min-w-0">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className={`h-5 w-5 ${textMedium}`} />
                        <span>Recent Activity</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent
                      className={
                        recentActivityItems.length > 0
                          ? "space-y-4"
                          : "h-full flex items-center justify-center"
                      }
                    >
                      {recentActivityItems.length > 0 ? (
                        recentActivityItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start space-x-3"
                          >
                            <item.icon
                              className={`h-5 w-5 mt-0.5 flex-shrink-0 ${item.iconClassName}`}
                              aria-hidden="true"
                            />
                            <div>
                              <p className={`font-medium text-sm ${textDark}`}>
                                {item.title}
                              </p>
                              <p className={`text-xs ${textLight}`}>
                                {item.status}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <EmptyState
                          icon={Clock}
                          title="Ready to Learn?"
                          // Cool message here:
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
                      {suggestedItems.length > 0 && (
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
                      {suggestedItems.length > 0 ? (
                        <div
                          ref={suggestedRef}
                          className="flex gap-4 overflow-x-auto overflow-y-hidden lg:overflow-x-hidden no-scrollbar py-2 px-1 sm:px-2 scroll-smooth snap-x snap-mandatory"
                        >
                          {suggestedItems.map((n) => (
                            <div
                              key={n}
                              className="group cursor-pointer min-w-[280px] max-w-[280px] flex-shrink-0 snap-start"
                            >
                              <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 h-[160px]">
                                <img
                                  src="/api/placeholder/280/160"
                                  alt={`Course Title ${n}`}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <h3
                                    className={`font-semibold text-sm leading-tight ${textDark} group-hover:text-[${primary}] transition-colors line-clamp-2`}
                                  >
                                    Course Title {n}
                                  </h3>
                                  <p
                                    className={`text-xs ${textLight} line-clamp-2`}
                                  >
                                    Short description goes here.
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon={Star}
                          title="Suggestions Coming Soon"
                          message="We'll recommend courses here based on your activity."
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* (MODIFIED) Achievements - 40% */}
                <div className="w-full lg:w-[40%] xl:w-[40%] min-w-0">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className={`h-5 w-5 ${textMedium}`} />
                        <span>Achievements</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent
                      className={
                        achievementItems.length > 0
                          ? "space-y-4"
                          : "h-full flex items-center justify-center"
                      }
                    >
                      {achievementItems.length > 0 ? (
                        <>
                          {achievementItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-start space-x-3"
                            >
                              <item.icon
                                className={`h-5 w-5 mt-0.5 flex-shrink-0 ${item.iconClassName}`}
                                aria-hidden="true"
                              />
                              <div>
                                <p
                                  className={`font-medium text-sm ${textDark}`}
                                >
                                  {item.title}
                                </p>
                                <p className={`text-xs ${textLight}`}>
                                  {item.status}
                                </p>
                              </div>
                            </div>
                          ))}
                          {/* "View All Achievements" button */}
                          <Link href="/learner-dashboard/achievements">
                            <div className="pt-2">
                              <Button
                                variant="secondary"
                                className="w-full"
                                onClick={() => {
                                  // Add navigation or modal logic here
                                }}
                              >
                                View All Achievements
                              </Button>
                            </div>
                          </Link>
                        </>
                      ) : (
                        <EmptyState
                          icon={Trophy}
                          title="Goals Await!"
                          // Cool message here:
                          message="Complete your first few steps to unlock your initial achievements."
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              {/* (END NEW) Suggested + Achievements Container */}

              {/* For a new user, this section doesn't make sense, so we hide it entirely unless there's data. */}
              {becauseItems.length > 0 && (
                <div className="w-full lg:w-[60%] xl:w-[72%]">
                  <Card>
                    <CardHeader className="flex sm:flex-row items-start sm:items-center justify-between">
                      <CardTitle className={`text-[${secondary}]`}>
                        Because You Took “Frontend Basics”
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <button onClick={scrollBecauseLeft}>
                          <ChevronLeft
                            className={`${textLight} hover:text-[${secondary}] cursor-pointer`}
                          />
                        </button>
                        <button onClick={scrollBecauseRight}>
                          <ChevronRight
                            className={`${textLight} hover:text-[${secondary}] cursor-pointer`}
                          />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div
                        ref={becauseRef}
                        className="flex gap-4 overflow-x-auto overflow-y-hidden lg:overflow-x-hidden no-scrollbar py-2 px-1 sm:px-2 scroll-smooth snap-x snap-mandatory"
                      >
                        {becauseItems.map((n) => (
                          <div
                            key={n}
                            className="group cursor-pointer min-w-[280px] max-w-[280px] flex-shrink-0 snap-start"
                          >
                            <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 h-[160px]">
                              <img
                                src="/api/placeholder/280/160"
                                alt={`Advanced Frontend ${n}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <div className="space-y-2">
                              <div>
                                <h3
                                  className={`font-semibold text-sm leading-tight ${textDark} group-hover:text-[${primary}] transition-colors line-clamp-2`}
                                >
                                  Advanced Frontend {n}
                                </h3>
                                <p
                                  className={`text-xs ${textLight} line-clamp-2`}
                                >
                                  Continue your journey with deeper concepts.
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Coming Soon */}
              <div className="w-full lg:w-[60%] xl:w-[72%]">
                <Card>
                  <CardHeader className="flex sm:flex-row items-start sm:items-center justify-between">
                    <CardTitle className={`text-[${secondary}]`}>
                      Coming Soon
                    </CardTitle>
                    {comingItems.length > 0 && (
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <button onClick={scrollComingLeft}>
                          <ChevronLeft
                            className={`${textLight} hover:text-[${secondary}] cursor-pointer`}
                          />
                        </button>
                        <button onClick={scrollComingRight}>
                          <ChevronRight
                            className={`${textLight} hover:text-[${secondary}] cursor-pointer`}
                          />
                        </button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {comingItems.length > 0 ? (
                      <div
                        ref={comingRef}
                        className="flex gap-4 overflow-x-auto overflow-y-hidden lg:overflow-x-hidden no-scrollbar py-2 px-1 sm:px-2 scroll-smooth snap-x snap-mandatory"
                      >
                        {comingItems.map((n) => (
                          <div
                            key={n}
                            className="group cursor-pointer min-w-[280px] max-w-[280px] flex-shrink-0 snap-start"
                          >
                            <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 h-[160px]">
                              <img
                                src="/api/placeholder/280/160"
                                alt={`Upcoming Course ${n}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <div className="space-y-2">
                              <div>
                                <h3
                                  className={`font-semibold text-sm leading-tight ${textDark} group-hover:text-[${primary}] transition-colors line-clamp-2`}
                                >
                                  Upcoming Course {n}
                                </h3>
                                <p
                                  className={`text-xs ${textLight} line-clamp-2`}
                                >
                                  Get ready for this new course!
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={BookOpen}
                        title="More Courses on the Horizon"
                        message="Check back soon for exciting new learning opportunities."
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* REMOVED: Top Mentors Card */}
            </div>
          </main>

       <Nav/>
          <LearnerFooter />
        </div>
      </div>
      {/* REMOVED: MentorModal */}
    </div>
  );
}