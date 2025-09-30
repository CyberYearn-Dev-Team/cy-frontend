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
  title: string; // Directus
  description: string; // Directus
  level: TrackLevel; // Directus
  topic: string; // Directus
  modules: number; // Directus (relation count)
  duration: string; // Directus (estimated time)
  progress: number; // SQL (user-specific)
  buttonText?: string;
  buttonVariant?: "primary" | "secondary";
}

// UI Helpers
const Progress = ({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div
      className="bg-[#72a210] h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-[#72a210] hover:bg-[#5c880d] text-white focus:ring-[#72a210]",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-300",
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

const Badge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: TrackLevel | "default";
}) => {
  const variants: Record<string, string> = {
    default: "bg-gray-100 text-gray-700",
    beginner: "bg-green-100 text-green-700",
    fundamentals: "bg-blue-100 text-blue-700",
    intermediate: "bg-orange-100 text-orange-700",
    network: "bg-purple-100 text-purple-700",
    advanced: "bg-red-100 text-red-700",
    penetration: "bg-gray-100 text-gray-700",
    phishing: "bg-yellow-100 text-yellow-700",
    web: "bg-indigo-100 text-indigo-700",
    osint: "bg-teal-100 text-teal-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-5">
          <Badge variant={level}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Badge>
          <Badge variant={topic.toLowerCase().replace(" ", "") as TrackLevel}>
            {topic}
          </Badge>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Description with line clamp */}
      <p
        className={`text-sm text-gray-600 mb-2 ${
          showMore ? "" : "line-clamp-5"
        }`}
      >
        {description}
      </p>

      {/* Toggle button */}
      {description.length > 150 && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-xs font-semibold text-[#72a210] hover:underline mb-4 cursor-pointer"
        >
          {showMore ? "Show less" : "Read more"}
        </button>
      )}

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
        <span>{modules} modules</span>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{duration}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <Link href={`/learner-dashboard/tracks/${slug}`} passHref>
        <Button variant="primary" className="w-full cursor-pointer">
          {buttonText}
        </Button>
      </Link>
    </div>
  );
};

// Collapsible Section Component
const CollapsibleSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false); // collapsed by default
  return (
    <div className="border rounded-md bg-white">
      <button
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {open && <div className="p-3">{children}</div>}
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

  // Fetch tracks from Directus API
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/tracks");
        const data = await res.json();

        const safe = (v: unknown): Track => {
          const obj =
            v && typeof v === "object" ? (v as Record<string, unknown>) : {};
          const modulesVal = obj.modules;
          return {
            title: (obj.title as string) ?? "Untitled",
            slug: (obj.slug as string) ?? "",
            description: (obj.description as string) ?? "",
            level: ((obj.level as TrackLevel) ?? "beginner") as TrackLevel,
            topic: (obj.topic as string) ?? "Fundamentals",
            modules: Array.isArray(modulesVal)
              ? modulesVal.length
              : typeof modulesVal === "number"
              ? modulesVal
              : 0,
            duration: (obj.duration as string) ?? "",
            progress:
              typeof obj.progress === "number" ? (obj.progress as number) : 0,
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

  // Apply Filters
  const filteredTracks = tracksFromCMS.filter((track) => {
    const levelMatch =
      selectedLevel === "All Levels" ||
      track.level.toLowerCase() === selectedLevel.toLowerCase();
    const topicMatch =
      selectedTopic === "All Topics" ||
      track.topic.toLowerCase() === selectedTopic.toLowerCase();
    return levelMatch && topicMatch;
  });

  const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];
  const topics = [
    "All Topics",
    "Fundamentals",
    "Network Security",
    "Penetration Testing",
    "Phishing",
    "Web Security",
    "OSINT",
  ];

  // Render
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Learning Tracks
            </h1>
            <p className="text-gray-600">
              Choose your cybersecurity learning path and master essential
              skills through structured courses.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Filters:
              </span>
            </div>

            {/* Difficulty Filter */}
            <CollapsibleSection title="Difficulty">
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedLevel === level
                        ? "bg-[#72a210] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 cursor-pointer"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </CollapsibleSection>

            {/* Track Filter */}
            <CollapsibleSection title="Track">
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedTopic === topic
                        ? "bg-[#72a210] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 cursor-pointer"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </CollapsibleSection>
          </div>

          {/* Tracks Grid / Empty State */}
          {loading ? (
            <p className="text-gray-500">Loading tracks...</p>
          ) : filteredTracks.length === 0 ? (
            <div className="text-center py-20 bg-white border rounded-lg shadow-sm">
              <FileText className="mx-auto h-20 w-20 text-[#72a210] mb-4" />
              <h2 className="text-lg font-semibold text-gray-800">
                No Learning Tracks Yet
              </h2>
              <p className="text-gray-600 mt-2 px-4">
                Your instructors haven’t published any tracks. Please check back
                later.
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
      </div>
    </div>
  );
}
