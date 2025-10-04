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
  X, // Added X for modal close button
} from "lucide-react";

import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import LearnerFooter from "@/components/ui/learner-footer";

// Theme Colors
const primary = "#72a210";
const secondary = "#507800";
const hover = "#5a850d";
// UPDATED BACKGROUNDS AND TEXT FOR DARK MODE SUPPORT
const bgLight = "bg-gray-50 dark:bg-gray-950"; // Main page background
const bgCard = "bg-white dark:bg-gray-900"; // Card background
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLight = "text-gray-500 dark:text-gray-300";

interface Track {
  id: string;
  title: string;
  description: string;
}

interface Mentor {
    id: number;
    name: string;
    title: string;
    avatar: string; // Kept avatar property, though currently using initials avatar
    isFollowing: boolean;
}

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
  <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
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
    // Primary: bg-[#72a210] hover:bg-[#507800]
    primary: `bg-[${primary}] hover:bg-[${secondary}] text-white focus:ring-[${primary}]`,
    // Secondary: bg-gray-100 hover:bg-gray-200 text-gray-700 -> UPDATED FOR DARK MODE
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

// Reusable Mentor Item Component (Refactored for requested layout)
const MentorListItem = ({ mentor }: { mentor: Mentor }) => (
    <div
        key={mentor.id}
        className="flex items-center justify-between group"
    >
        <div className="flex items-center space-x-3">
            {/* Profile Avatar (using initials) */}
            <div
                className={`w-11 h-11 rounded-full bg-gradient-to-br from-[${primary}] to-[${secondary}] flex items-center justify-center text-white font-semibold text-sm shadow-md`}
            >
                {mentor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
            </div>
            {/* User Name and Title */}
            <div>
                <p
                    className={`font-semibold text-sm ${textDark} group-hover:text-[${primary}] transition-colors`}
                >
                    {mentor.name}
                </p>
                <p className={`text-xs ${textLight}`}>
                    {mentor.title}
                </p>
            </div>
        </div>
        {/* The follow/following button is now removed as requested */}
    </div>
);

// See All Mentors Modal Component
const MentorModal = ({ mentors, isOpen, onClose }: { mentors: Mentor[], isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;

    // Use the same MentorListItem component for consistency
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex justify-center items-center p-4">
            <div className={`relative ${bgCard} rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto`}>
                <div className="sticky top-0 z-10 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-900">
                    <h2 className={`text-xl font-bold ${textDark}`}>All Mentors ({mentors.length})</h2>
                    <button onClick={onClose} className={`p-1 rounded-full ${textMedium} hover:text-[${secondary}] hover:bg-gray-100 dark:hover:bg-gray-800`}>
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {mentors.map((mentor) => (
                        <MentorListItem key={mentor.id} mentor={mentor} />
                    ))}
                </div>
            </div>
        </div>
    );
};


// Dashboard
export default function LearnerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // State for the Mentor Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data setup... (omitted for brevity)
  const continueWatchingItems = [
    {
      id: 1,
      title: "Beginner's Guide to Becoming a Professional Front-End Developer",
      instructor: "Bradlee Santos",
      instructorTitle: "Mentor",
      progress: 45,
      thumbnail: "/api/placeholder/280/160",
      category: "Frontend",
    },
    {
      id: 2,
      title: "Optimizing User Experience with the Best UI/UX Design",
      instructor: "Rebecca Kim",
      instructorTitle: "Instructor",
      progress: 70,
      thumbnail: "/api/placeholder/280/160",
      category: "Design",
    },
    {
      id: 3,
      title: "Reviving and Refresh Company Image Reviving and Refresh",
      instructor: "David Chen",
      instructorTitle: "Mentor",
      progress: 30,
      thumbnail: "/api/placeholder/280/160",
      category: "Branding",
    },
  ];

  const continueWatchingRef = useRef<HTMLDivElement | null>(null);
  const scrollBy = (delta: number) => {
    const el = continueWatchingRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };
  const scrollLeft = () => scrollBy(-300);
  const scrollRight = () => scrollBy(300);

  // Expanded Mentor List for Modal
  const allMentors: Mentor[] = [
    {
      id: 1,
      name: "Bradlee Santos",
      title: "Lead Developer",
      avatar: "/api/placeholder/40/40",
      isFollowing: true,
    },
    {
        id: 2,
        name: "Rebecca Kim",
        title: "UX Designer",
        avatar: "/api/placeholder/40/40",
        isFollowing: true,
      },
      {
        id: 3,
        name: "David Chen",
        title: "Branding Specialist",
        avatar: "/api/placeholder/40/40",
        isFollowing: false,
      },
    {
      id: 4,
      name: "Carlos Reyes",
      title: "Cloud Architect",
      avatar: "/api/placeholder/40/40",
      isFollowing: false,
    },
    {
        id: 5,
        name: "Aisha Hassan",
        title: "Data Scientist",
        avatar: "/api/placeholder/40/40",
        isFollowing: true,
      },
      {
        id: 6,
        name: "Gavin Smith",
        title: "Cyber Security Pro",
        avatar: "/api/placeholder/40/40",
        isFollowing: false,
      },
  ];

  // Limited list for display in the main card (limit to 4)
  const visibleMentors = allMentors.slice(0, 4);

  return (
    // APPLY MAIN BACKGROUND DARK MODE CLASS
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          />
        )}

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
                  {/* Card components now handle dark mode via their definitions */}
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

              {/* Continue Watching + Mentors Container */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content - 60% */}
                <div className="w-full lg:flex-[0.6] space-y-8">
                  <Card>
                    {/* Header: titles align flex-start on mobile, justify-between on desktop */}
                    <CardHeader className="flex sm:flex-row items-start sm:items-center justify-between">
                      <CardTitle className={`text-[${secondary}]`}>
                        Continue Watching
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <button onClick={scrollLeft}>
                          <ChevronLeft
                            className={`${textLight} hover:text-[${secondary}]`}
                          />
                        </button>
                        <button onClick={scrollRight}>
                          <ChevronRight
                            className={`${textLight} hover:text-[${secondary}]`}
                          />
                        </button>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div
                        ref={continueWatchingRef}
                        className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1 sm:px-2"
                      >
                        {continueWatchingItems.map((item) => (
                          <div
                            key={item.id}
                            className="group cursor-pointer min-w-[260px]"
                          >
                            <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                              <div className="aspect-video w-full bg-gradient-to-br from-gray-200 dark:from-gray-700 to-gray-300 dark:to-gray-800 flex items-center justify-center">
                                <Play className={`${textLight} h-8 w-8`} />
                              </div>
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-3">
                                  <Play
                                    className={`h-6 w-6 text-[${secondary}]`}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h3
                                className={`font-semibold text-sm leading-tight ${textDark} group-hover:text-[${primary}] transition-colors`}
                              >
                                {item.title}
                              </h3>
                              <div className={`flex items-center text-xs ${textLight}`}>
                                <span>{item.instructor}</span>
                                <span className="mx-2">•</span>
                                <span>{item.instructorTitle}</span>
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
                    </CardContent>
                  </Card>
                </div>

                {/* Mentors - 40% (Updated logic) */}
                <div className="w-full lg:flex-[0.4]">
                  <Card>
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                      <CardTitle className={`text-[${primary}]`}>
                        Your Mentors
                      </CardTitle>
                      {/* See All Button that opens the modal */}
                      {allMentors.length > 4 && (
                          <Button
                            variant="secondary"
                            onClick={() => setIsModalOpen(true)}
                            className={`text-[${primary}] text-sm px-3 py-1.5 h-auto mt-2 sm:mt-0 cursor-pointer`}
                          >
                            See All
                          </Button>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Render only the limited list of mentors (up to 4) */}
                      {visibleMentors.map((mentor) => (
                        <MentorListItem key={mentor.id} mentor={mentor} />
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <LearnerFooter />
        </div>
      </div>

      {/* Mentor Modal Component */}
      <MentorModal
          mentors={allMentors}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}