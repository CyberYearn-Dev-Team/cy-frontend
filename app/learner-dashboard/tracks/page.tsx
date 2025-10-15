"use client";

import React, { useState, useEffect } from "react";
import { Clock, Filter, ChevronDown, FileText } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import Nav from "@/components/ui/learner-nav";
import LearnerFooter from "@/components/ui/learner-footer";

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#5a850d";
const primarySecondary = "#507800";

const bgLight = "bg-white dark:bg-gray-950";
const cardBg = "bg-gray-50 dark:bg-gray-900";

const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-700 dark:text-gray-300";
const textLight = "text-gray-500 dark:text-gray-400";

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
  thumbnail?: string | { id?: string };
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

// Badge
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[${primary}]/10 text-[${primarySecondary}] dark:bg-[${primary}]/20 dark:text-white`}
  >
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
  buttonText = "View Track",
  thumbnail,
}: Track) => {
  const imageUrl = thumbnail
    ? `${process.env.DIRECTUS_URL || "https://cy-directus.onrender.com"}/assets/${
        typeof thumbnail === "string" ? thumbnail : thumbnail.id
      }`
    : null;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-transform hover:scale-[1.02] duration-300 bg-white dark:bg-gray-900">
      {/* Image Header */}
      <div className="relative h-48 w-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-t-3xl" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-200">{topic}</p>
          </div>
          <Link href={`/learner-dashboard/tracks/${slug}`} passHref>
            <button className="bg-[#5a850d] text-white text-sm px-4 py-2 rounded-full hover:bg-[#72a210] focus:ring-2 focus:ring-[#72a210] transition cursor-pointer">
              {buttonText}
            </button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Badge>{level}</Badge>
          <span className="text-xs text-gray-500">{modules} Modules</span>
        </div>

        <p className={`text-sm ${textMedium} line-clamp-3`}>{description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
          <div className="flex items-center gap-1">
            <Clock className={`h-4 w-4 text-[${primary}]`} />
            <span>{duration}</span>
          </div>
          <span className="font-semibold">{progress}%</span>
        </div>

        <Progress value={progress} />
      </div>
    </div>
  );
};

// Page
export default function TracksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tracksFromCMS, setTracksFromCMS] = useState<Track[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/tracks");
        if (!res.ok) throw new Error(`API failed: ${res.status}`);
        const data = await res.json();

        const tracksData =
          data?.data || data?.tracks || (Array.isArray(data) ? data : []);

        const safe = (v: any): Track => ({
          title: v.title || "Untitled",
          slug: v.slug || "",
          description: v.description || "",
          level: v.level || "beginner",
          topic: v.topic || "General",
          modules: Array.isArray(v.modules)
            ? v.modules.length
            : typeof v.modules === "number"
            ? v.modules
            : 0,
          duration: v.duration || "",
          progress: typeof v.progress === "number" ? v.progress : 0,
          thumbnail: v.thumbnail || null,
          buttonText: "View Track",
        });

        setTracksFromCMS(tracksData.map(safe));
      } catch (err) {
        console.error(err);
        setTracksFromCMS([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Generate unique levels and topics from CMS
  const levels = React.useMemo(() => {
    const unique = Array.from(new Set(tracksFromCMS.map((t) => t.level)));
    return ["All Levels", ...unique.map((l) => l.charAt(0).toUpperCase() + l.slice(1))];
  }, [tracksFromCMS]);

  const topics = React.useMemo(() => {
    const unique = Array.from(new Set(tracksFromCMS.map((t) => t.topic)));
    return ["All Topics", ...unique.map((t) => t.charAt(0).toUpperCase() + t.slice(1))];
  }, [tracksFromCMS]);

  // Filter logic
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
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
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
                    className={`flex items-center justify-between w-40 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[${primary}] ${textMedium} ${cardBg}`}
                  >
                    {selectedLevel}
                    <ChevronDown className={`h-4 w-4 ml-2 ${textLight}`} />
                  </button>
                  {showLevelDropdown && (
                    <div
                      className={`absolute mt-1 w-40 ${cardBg} border rounded-lg shadow-lg z-10`}
                    >
                      {levels.map((level) => (
                        <button
                          key={level}
                          onClick={() => {
                            setSelectedLevel(level);
                            setShowLevelDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-[${primary}]/10 ${
                            selectedLevel === level
                              ? `bg-[${primary}]/20 text-[${primarySecondary}]`
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
                    className={`flex items-center justify-between w-40 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[${primary}] ${textMedium} ${cardBg}`}
                  >
                    {selectedTopic}
                    <ChevronDown className={`h-4 w-4 ml-2 ${textLight}`} />
                  </button>
                  {showTopicDropdown && (
                    <div
                      className={`absolute mt-1 w-40 ${cardBg} border rounded-lg shadow-lg z-10`}
                    >
                      {topics.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => {
                            setSelectedTopic(topic);
                            setShowTopicDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-[${primary}]/10 ${
                            selectedTopic === topic
                              ? `bg-[${primary}]/20 text-[${primarySecondary}]`
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
              <div
                className={`${cardBg} text-center py-20 border rounded-lg shadow-md`}
              >
                <FileText
                  className={`mx-auto h-20 w-20 text-[${primary}] mb-4`}
                />
                <h2 className={`text-lg font-semibold ${textDark}`}>
                  No Learning Tracks Found
                </h2>
                <p className={`${textMedium} mt-2 px-4`}>
                  Try adjusting your filters or check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTracks.map((track, i) => (
                  <TrackCard key={i} {...track} />
                ))}
              </div>
            )}
          </main>

          <Nav />
          <LearnerFooter />
        </div>
      </div>
    </div>
  );
}
