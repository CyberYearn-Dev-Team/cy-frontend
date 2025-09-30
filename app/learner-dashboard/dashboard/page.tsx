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
} from "lucide-react";

import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";

interface Track {
  id: string;
  title: string;
  description: string;
}

// UI Helpers
const Progress = ({ value }: { value: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-[#72a210] h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
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
    className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}
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
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
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
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-gray-600 mt-1">{children}</p>
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
    primary: "bg-[#72a210] hover:bg-[#507800] text-white focus:ring-[#72a210]",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500",
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

// Dashboard
export default function LearnerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock tracks data
  const tracks = [
    {
      id: "1",
      title: "Frontend Development Bootcamp",
      description: "Learn React, Next.js, and modern frontend technologies",
    },
    {
      id: "2",
      title: "UI/UX Design Fundamentals",
      description:
        "Master design principles and user experience best practices",
    },
  ];

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

  // Ref for horizontal scrolling container
  const continueWatchingRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (delta: number) => {
    const el = continueWatchingRef.current;
    if (!el) return;
    // smooth scroll by delta pixels
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const scrollLeft = () => scrollBy(-300);
  const scrollRight = () => scrollBy(300);

  const mentors = [
    {
      id: 1,
      name: "Bradlee Santos",
      title: "Developer",
      avatar: "/api/placeholder/40/40",
      isFollowing: true,
    },
    {
      id: 2,
      name: "Zaka Hernandez",
      title: "Designer",
      avatar: "/api/placeholder/40/40",
      isFollowing: true,
    },
    {
      id: 3,
      name: "Aisha Malik",
      title: "Mentor",
      avatar: "/api/placeholder/40/40",
      isFollowing: true,
    },
    {
      id: 4,
      name: "Carlos Reyes",
      title: "Instructor",
      avatar: "/api/placeholder/40/40",
      isFollowing: true,
    },
    {
      id: 5,
      name: "Emily Park",
      title: "Coach",
      avatar: "/api/placeholder/40/40",
      isFollowing: false,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Hero + Stats Container */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Hero Banner - 70% */}
              <div className="w-full lg:flex-[0.8]">
                <div className="bg-gradient-to-r from-[#72a210] via-[#5a890d] to-[#507800] rounded-2xl p-8 text-white relative overflow-hidden h-full">
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
                      className="bg-white text-[#507800] hover:bg-gray-100 cursor-pointer"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Learning Now
                    </Button>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
                    <div className="w-full h-full bg-gradient-to-br from-white/40 to-transparent rounded-full transform translate-x-20 -translate-y-20"></div>
                  </div>
                </div>
              </div>
              {/* Stats Section - 30% */}
              <div className="w-full lg:flex-[0.3] grid grid-cols-2 gap-6">
                {" "}
                <Card>
                  {" "}
                  <CardContent>
                    {" "}
                    <div className="flex items-center justify-between">
                      {" "}
                      <div>
                        {" "}
                        <p className="text-sm font-medium text-gray-600">
                          Current XP
                        </p>{" "}
                        <p className="text-2xl font-bold text-gray-900">0</p>{" "}
                      </div>{" "}
                      <Zap className="h-8 w-8 text-[#72a210]" />{" "}
                    </div>{" "}
                  </CardContent>{" "}
                </Card>{" "}
                <Card>
                  {" "}
                  <CardContent>
                    {" "}
                    <div className="flex items-center justify-between">
                      {" "}
                      <div>
                        {" "}
                        <p className="text-sm font-medium text-gray-600">
                          Level
                        </p>{" "}
                        <p className="text-2xl font-bold text-gray-900">0</p>{" "}
                      </div>{" "}
                      <Trophy className="h-8 w-8 text-[#72a210]" />{" "}
                    </div>{" "}
                  </CardContent>{" "}
                </Card>{" "}
                <Card>
                  {" "}
                  <CardContent>
                    {" "}
                    <div className="flex items-center justify-between">
                      {" "}
                      <div>
                        {" "}
                        <p className="text-sm font-medium text-gray-600">
                          Day Streak
                        </p>{" "}
                        <p className="text-2xl font-bold text-gray-900">0</p>{" "}
                      </div>{" "}
                      <Target className="h-8 w-8 text-[#507800]" />{" "}
                    </div>{" "}
                  </CardContent>{" "}
                </Card>{" "}
                <Card>
                  {" "}
                  <CardContent>
                    {" "}
                    <div className="flex items-center justify-between">
                      {" "}
                      <div>
                        {" "}
                        <p className="text-sm font-medium text-gray-600">
                          Rate
                        </p>{" "}
                        <p className="text-2xl font-bold text-gray-900">0%</p>{" "}
                      </div>{" "}
                      <TrendingUp className="h-8 w-8 text-[#72a210]" />{" "}
                    </div>{" "}
                  </CardContent>{" "}
                </Card>{" "}
              </div>
            </div>

            {/* Continue Watching + Sidebar Content */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content - 70% */}
              <div className="w-full lg:flex-[0.7] space-y-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-[#507800]">
                      Continue Watching
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <button onClick={scrollLeft}>
                        <ChevronLeft className="h-5 w-5 text-gray-500 hover:text-[#507800]" />
                      </button>
                      <button onClick={scrollRight}>
                        <ChevronRight className="h-5 w-5 text-gray-500 hover:text-[#507800]" />
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
                          <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-100">
                            <div className="aspect-video w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <Play className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="bg-white/90 rounded-full p-3">
                                <Play className="h-6 w-6 text-[#507800]" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold text-sm leading-tight text-gray-900 group-hover:text-[#72a210] transition-colors">
                              {item.title}
                            </h3>
                            <div className="flex items-center text-xs text-gray-500">
                              <span>{item.instructor}</span>
                              <span className="mx-2">•</span>
                              <span>{item.instructorTitle}</span>
                            </div>
                            <div className="space-y-1">
                              <Progress value={item.progress} />
                              <p className="text-xs text-gray-500">
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

              {/* Sidebar Content - 30% */}
              <div className="w-full lg:flex-[0.3] space-y-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-[#507800]">
                      Your Mentor
                    </CardTitle>
                    <Button
                      variant="secondary"
                      className="text-[#507800] text-sm px-3 py-1 cursor-pointer"
                    >
                      See All
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mentors.map((mentor) => (
                      <div
                        key={mentor.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#72a210] to-[#507800] flex items-center justify-center text-white font-semibold text-sm">
                            {mentor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-900">
                              {mentor.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {mentor.title}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={mentor.isFollowing ? "primary" : "secondary"}
                          className={`text-xs px-3 py-1 ${
                            mentor.isFollowing
                              ? "bg-[#72a210] hover:bg-[#507800] text-white"
                              : "text-[#507800] border border-[#72a210] hover:bg-[#72a210]/10"
                          }`}
                        >
                          {mentor.isFollowing ? "Following" : "+ Follow"}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
