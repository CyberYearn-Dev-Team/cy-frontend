"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Filter,
  ChevronDown,
  ChevronRight,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import Nav from "@/components/ui/learner-nav";
import LearnerFooter from "@/components/ui/learner-footer";

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#5a850d";
const primarySecondary = "#507800";

// SWAPPED COLORS
const bgLight = "bg-white dark:bg-gray-950";       // Main page background (now uses original card color)
const cardBg = "bg-gray-50 dark:bg-gray-900";     // Card/component background (now uses original page color)

const borderPrimary = `border-[${primary}]`;
const textDark = "text-gray-900 dark:text-gray-100"; // Headings
const textMedium = "text-gray-700 dark:text-gray-300"; // Body text
const textLight = "text-gray-500 dark:text-gray-400"; // Loading/placeholder text

// Types
type TrackLevel =
  | "beginner"
  | "fundamentals"
  | "intermediate"
  | "network"
  | "advanced"
  | "penetration"
  | "phishing"
  | "web"
  | "osint";

interface Track {
  slug: string;
  title: string;
  description: string;
  level: TrackLevel;
  topic: string;
  modules: number;
  duration: string;
  progress: number;
  buttonText?: string;
  buttonVariant?: "primary" | "secondary";
}

// Progress bar
const Progress = ({ value }: { value: number }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
    <div
      className={`bg-[${primary}] h-2 rounded-full transition-all duration-300`}
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

// Button
const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
}) => {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-950";
  const variants = {
    primary:
      `bg-[${primary}] text-white hover:bg-[${primaryDarker}] focus:ring-[${primary}]`,
    secondary:
      `bg-[${primarySecondary}] text-white hover:bg-[${primaryDarker}] focus:ring-[${primarySecondary}]`,
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Badge
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[${primary}]/10 text-[${primarySecondary}] dark:bg-[${primary}]/20 dark:text-white`}>
    {children}
  </span>
);

// Track Card
const TrackCard = ({
  title,
  slug,
  description,
  level,
  topic,
  modules,
  duration,
  progress,
  buttonText = "Continue Track",
  buttonVariant = "primary",
}: Track) => {
  const [showMore, setShowMore] = useState(false);

  return (
    // Card background is now the former page background (lighter)
    <div className={`${cardBg} rounded-2xl shadow-md ${borderPrimary} hover:shadow-lg transition-all p-6 flex flex-col`}>
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge>{level}</Badge>
        <Badge>{topic}</Badge>
      </div>

      {/* Title */}
      <h3 className={`text-lg font-semibold ${textDark} mb-2`}>{title}</h3>

      {/* Description */}
      <p
        className={`text-sm ${textMedium} mb-2 ${
          showMore ? "" : "line-clamp-4"
        }`}
      >
        {description}
      </p>

      {/* Toggle */}
      {description.length > 150 && (
        <button
          onClick={() => setShowMore(!showMore)}
          className={`text-xs font-semibold text-[${primary}] hover:text-[${primaryDarker}] hover:underline mb-3`}
        >
          {showMore ? "Show less" : "Read more"}
        </button>
      )}

      {/* Meta */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm ${textLight} mb-4 gap-2`}>
        <span>{modules} modules</span>
        <div className="flex items-center gap-1">
          <Clock className={`h-4 w-4 text-[${primary}]`} />
          <span>{duration}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2 mb-4">
        <div className={`flex justify-between text-sm ${textMedium}`}>
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Button */}
      <Link href={`/learner-dashboard/tracks/${slug}`} passHref>
        <Button variant={buttonVariant} className="w-full">
          {buttonText}
        </Button>
      </Link>
    </div>
  );
};

// Page
export default function TracksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [loading, setLoading] = useState(true);
  const [tracksFromCMS, setTracksFromCMS] = useState<Track[]>([]);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);

  useEffect(() => {
    (async () => {
      // Logic for fetching tracks remains the same
      try {
        const res = await fetch("/api/tracks");
        const data = await res.json();
        const safe = (v: unknown): Track => {
          const obj = v && typeof v === "object" ? (v as Record<string, unknown>) : {};
          const modulesVal = obj.modules;
          return {
            title: (obj.title as string) ?? "Untitled",
            slug: (obj.slug as string) ?? "",
            description: (obj.description as string) ?? "",
            level: ((obj.level as TrackLevel) ?? "beginner") as TrackLevel,
            topic: (obj.topic as string) ?? "General",
            modules: Array.isArray(modulesVal)
              ? modulesVal.length
              : typeof modulesVal === "number"
              ? modulesVal
              : 0,
            duration: (obj.duration as string) ?? "",
            progress: typeof obj.progress === "number" ? (obj.progress as number) : 0,
            buttonText: "View Track",
            buttonVariant: "secondary",
          };
        };
        const cmsTracks: Track[] = Array.isArray(data?.data)
          ? data.data.map((t: unknown) => safe(t))
          : [];
        setTracksFromCMS(cmsTracks);
      } catch {
        setTracksFromCMS([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function capitalizeFirstLetter(str: string) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const levels = React.useMemo(() => {
    const unique = Array.from(new Set(tracksFromCMS.map((t) => t.level)));
    return ["All Levels", ...unique.map((l) => capitalizeFirstLetter(l))];
  }, [tracksFromCMS]);

  const topics = React.useMemo(() => {
    const unique = Array.from(new Set(tracksFromCMS.map((t) => t.topic)));
    return ["All Topics", ...unique.map((t) => capitalizeFirstLetter(t))];
  }, [tracksFromCMS]);

  const filteredTracks = tracksFromCMS.filter((track) => {
    const levelMatch =
      selectedLevel === "All Levels" ||
      track.level.toLowerCase() === selectedLevel.toLowerCase();
    const topicMatch =
      selectedTopic === "All Topics" ||
      track.topic.toLowerCase() === selectedTopic.toLowerCase();
    return levelMatch && topicMatch;
  });

  return (
    // Main container background is now the former card background (white/dark-950)
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />


      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className={`text-2xl font-bold ${textDark} mb-2`}>
                Learning Tracks
              </h1>
              <p className={textMedium}>
                Choose your cybersecurity learning path and master essential
                skills through structured courses.
              </p>
            </div>

            {/* Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-2">
                <Filter className={`h-4 w-4 text-[${primary}]`} />
                <span className={`text-sm font-medium ${textMedium}`}>
                  Filters:
                </span>
              </div>

<div className="flex sm:flex-row sm:justify-between gap-2">
                {/* Level Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowLevelDropdown((prev) => !prev)}
                    // Dropdown button uses the lighter card background
                    className={`flex items-center justify-between w-40 border ${borderPrimary} dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[${primary}] ${textMedium} ${cardBg}`}
                  >
                    {selectedLevel}
                    <ChevronDown className={`h-4 w-4 ml-2 ${textLight}`} />
                  </button>
                  {showLevelDropdown && (
                    <div className={`absolute mt-1 w-40 ${cardBg} border ${borderPrimary} dark:border-gray-700 rounded-lg shadow-lg z-10`}>
                      {levels.map((level) => (
                        <button
                          key={level}
                          onClick={() => {
                            setSelectedLevel(level);
                            setShowLevelDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-[${primary}]/10 dark:hover:bg-gray-700 ${
                            selectedLevel === level
                              ? `bg-[${primary}]/20 text-[${primarySecondary}] dark:bg-[${primary}]/40 dark:text-white`
                              : textMedium
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Topic Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowTopicDropdown((prev) => !prev)}
                    // Dropdown button uses the lighter card background
                    className={`flex items-center justify-between w-40 border ${borderPrimary} dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[${primary}] ${textMedium} ${cardBg}`}
                  >
                    {selectedTopic}
                    <ChevronDown className={`h-4 w-4 ml-2 ${textLight}`} />
                  </button>
                  {showTopicDropdown && (
                    <div className={`absolute mt-1 w-40 ${cardBg} border ${borderPrimary} dark:border-gray-700 rounded-lg shadow-lg z-10`}>
                      {topics.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => {
                            setSelectedTopic(topic);
                            setShowTopicDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-[${primary}]/10 dark:hover:bg-gray-700 ${
                            selectedTopic === topic
                              ? `bg-[${primary}]/20 text-[${primarySecondary}] dark:bg-[${primary}]/40 dark:text-white`
                              : textMedium
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tracks Grid */}
            {loading ? (
              <p className={textLight}>Loading tracks...</p>
            ) : filteredTracks.length === 0 ? (
              // Empty State Updated for dark mode and theme
              <div className={`${cardBg} text-center py-20 border dark:border-gray-700 rounded-lg shadow-md`}>
                <FileText className={`mx-auto h-20 w-20 text-[${primary}] mb-4`} />
                <h2 className={`text-lg font-semibold ${textDark}`}>
                  No Learning Tracks Yet
                </h2>
                <p className={`${textMedium} mt-2 px-4`}>
                  Your instructors haven’t published any tracks. Please check
                  back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTracks.map((track, index) => (
                  <TrackCard key={index} {...track} />
                ))}
              </div>
            )}
          </main>

          {/* Navigation */}
          <Nav />

          <LearnerFooter />
        </div>
      </div>
    </div>
  );
}