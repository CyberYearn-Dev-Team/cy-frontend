"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import Sidebar from "@/components/learner-sidebar";
import Header from "@/components/learner-header";
import Nav from "@/components/learner-nav";
import LearnerFooter from "@/components/learner-footer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Star,
  Search,
  Flag,
  CheckCircle2,
  Award,
  ChevronDown,
  ThumbsUp,
} from "lucide-react";

// Theme Colors copied exactly from your dashboard layout
const primary = "#72a210";
const secondary = "#507800";
const hover = "#5a850d";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLight = "text-gray-500 dark:text-gray-300";

// Mock Data structure reflecting verified real customers, ratings, and analytics counters
const staticBreakdown = [
  { stars: 5, count: 120, percentage: 68 },
  { stars: 4, count: 40, percentage: 22 },
  { stars: 3, count: 12, percentage: 7 },
  { stars: 2, count: 4, percentage: 2 },
  { stars: 1, count: 1, percentage: 1 },
];

const initialReviewsData = [
  {
    id: "rev-1",
    name: "Sarah Jenkins",
    isAnonymous: false,
    rating: 5,
    subject: "Phenomenal UI and Structured Learning Paths",
    text: "The platform design completely changed how I interact with the study modules. Complex database architectures are broken down into bite-sized interactive pieces. Highly recommend to any engineering student!",
    date: "May 18, 2026",
    category: "UI/Design",
    isVerified: true,
    isFeatured: true,
    helpfulCount: 42,
    hasLiked: false,
  },
  {
    id: "rev-2",
    name: "Anonymous Learner",
    isAnonymous: true,
    rating: 4,
    subject: "Solid content but video loading lags sometimes",
    text: "The curriculum quality is deep and accurate. My only minor critique is performance during peak evening hours; video streaming buffers occasionally on mobile browsers. Still entirely worth the subscription.",
    date: "May 14, 2026",
    category: "Performance",
    isVerified: true,
    isFeatured: false,
    helpfulCount: 19,
    hasLiked: false,
  },
  {
    id: "rev-3",
    name: "Marcus Aurelius",
    isAnonymous: false,
    rating: 5,
    subject: "Outstanding response times from Customer Support",
    text: "Ran into an account billing edge case midway through a certification block. The technical account team cleared it up manually in under fifteen minutes. Zero-friction operations are rare these days.",
    date: "May 10, 2026",
    category: "Customer Support",
    isVerified: true,
    isFeatured: true,
    helpfulCount: 31,
    hasLiked: false,
  },
  {
    id: "rev-4",
    name: "Alex Rivera",
    isAnonymous: false,
    rating: 3,
    subject: "Good material but lacks advanced content mapping",
    text: "Great for fundamentals and intermediate tracks, but the advanced architectural modules feel shallow. Hopefully, more comprehensive backend tutorials are coming soon.",
    date: "May 02, 2026",
    category: "Content Quality",
    isVerified: false,
    isFeatured: false,
    helpfulCount: 8,
    hasLiked: false,
  },
  {
    id: "rev-5",
    name: "Emily Chen",
    isAnonymous: false,
    rating: 5,
    subject: "Best investment for my career",
    text: "I completed three certifications in six months. The hands-on labs are incredibly practical and directly applicable to real-world scenarios. Got promoted shortly after!",
    date: "April 28, 2026",
    category: "Content Quality",
    isVerified: true,
    isFeatured: false,
    helpfulCount: 56,
    hasLiked: false,
  },
  {
    id: "rev-6",
    name: "James Wilson",
    isAnonymous: false,
    rating: 4,
    subject: "Great community support",
    text: "The forums are active and helpful. When I got stuck on a complex problem, other learners and mentors responded within hours. The collaborative environment is fantastic.",
    date: "April 25, 2026",
    category: "Customer Support",
    isVerified: true,
    isFeatured: false,
    helpfulCount: 23,
    hasLiked: false,
  },
  {
    id: "rev-7",
    name: "Anonymous Learner",
    isAnonymous: true,
    rating: 5,
    subject: "Perfect for busy professionals",
    text: "The bite-sized lessons fit perfectly into my schedule. I can learn during lunch breaks or commute. The mobile app is smooth and syncs progress seamlessly.",
    date: "April 20, 2026",
    category: "UI/Design",
    isVerified: true,
    isFeatured: false,
    helpfulCount: 34,
    hasLiked: false,
  },
  {
    id: "rev-8",
    name: "Maria Garcia",
    isAnonymous: false,
    rating: 4,
    subject: "Comprehensive curriculum",
    text: "Covered everything from basics to advanced topics. The structured learning path kept me on track. Some modules could use more practice exercises though.",
    date: "April 15, 2026",
    category: "Content Quality",
    isVerified: true,
    isFeatured: false,
    helpfulCount: 18,
    hasLiked: false,
  },
  {
    id: "rev-9",
    name: "David Kim",
    isAnonymous: false,
    rating: 5,
    subject: "Excellent instructor quality",
    text: "The instructors are industry experts who explain complex concepts clearly. Their real-world examples make abstract topics easy to understand.",
    date: "April 10, 2026",
    category: "Content Quality",
    isVerified: true,
    isFeatured: false,
    helpfulCount: 45,
    hasLiked: false,
  },
  {
    id: "rev-10",
    name: "Sophie Turner",
    isAnonymous: false,
    rating: 4,
    subject: "Good value for money",
    text: "Compared to other platforms, this offers the best bang for buck. The quality of content justifies the price. Would recommend to anyone serious about learning.",
    date: "April 05, 2026",
    category: "Performance",
    isVerified: true,
    isFeatured: false,
    helpfulCount: 29,
    hasLiked: false,
  },
  {
    id: "rev-11",
    name: "Anonymous Learner",
    isAnonymous: true,
    rating: 3,
    subject: "Needs more mobile optimization",
    text: "Desktop experience is flawless, but the mobile interface has some quirks. Navigation can be tricky on smaller screens. Hopefully this improves soon.",
    date: "March 30, 2026",
    category: "UI/Design",
    isVerified: false,
    isFeatured: false,
    helpfulCount: 12,
    hasLiked: false,
  },
  {
    id: "rev-12",
    name: "Michael Brown",
    isAnonymous: false,
    rating: 5,
    subject: "Career-changing experience",
    text: "Transitioned from marketing to tech thanks to this platform. The career guidance and resume tips were invaluable. Landed my dream job at a startup!",
    date: "March 25, 2026",
    category: "Content Quality",
    isVerified: true,
    isFeatured: false,
    helpfulCount: 67,
    hasLiked: false,
  },
  {
    id: "rev-13",
    name: "Lisa Anderson",
    isAnonymous: false,
    rating: 4,
    subject: "Regular content updates",
    text: "Love that they keep the curriculum current with industry trends. New modules are added regularly. Shows they care about providing up-to-date education.",
    date: "March 20, 2026",
    category: "Content Quality",
    isVerified: true,
    isFeatured: false,
    helpfulCount: 21,
    hasLiked: false,
  },
  {
    id: "rev-14",
    name: "Anonymous Learner",
    isAnonymous: true,
    rating: 5,
    subject: "Outstanding certification program",
    text: "The certifications are recognized by top companies. The exam prep materials are thorough and the practice tests really help gauge readiness.",
    date: "March 15, 2026",
    category: "Content Quality",
    isVerified: true,
    isFeatured: false,
    helpfulCount: 38,
    hasLiked: false,
  },
  {
    id: "rev-15",
    name: "Robert Taylor",
    isAnonymous: false,
    rating: 4,
    subject: "Responsive support team",
    text: "Had a technical issue with my account. Support team resolved it within an hour. Professional and courteous service throughout.",
    date: "March 10, 2026",
    category: "Customer Support",
    isVerified: true,
    isFeatured: false,
    helpfulCount: 15,
    hasLiked: false,
  },
];

const ratingsLabels: Record<string, string> = {
  all: "All Ratings",
  "5": "5 Stars",
  "4": "4 Stars",
  "3": "3 Stars",
  "2": "2 Stars",
  "1": "1 Star",
};

const categoryLabels: Record<string, string> = {
  all: "All Categories",
  "UI/Design": "UI & Design",
  Performance: "Performance Speed",
  "Content Quality": "Content Quality",
  "Customer Support": "Customer Support",
  "Bug Report": "Bug Report",
};

const sortLabels: Record<string, string> = {
  recent: "Most Recent",
  highest: "Highest Rated",
  lowest: "Lowest Rated",
  helpful: "Most Helpful",
};

export default function CommunityReviewsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reviews, setReviews] = useState(initialReviewsData);

  // Interactive UI Filters & Controls State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  // Pagination State parameters
  const [visibleCount, setVisibleCount] = useState(10);

  // Filter and Sort Processing pipelines
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    // 1. Text Search Filter matches subject or body content
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.subject.toLowerCase().includes(query) ||
          r.text.toLowerCase().includes(query)
      );
    }

    // 2. Rating Breakdown Filter
    if (selectedRating !== "all") {
      const targetRating = parseInt(selectedRating, 10);
      result = result.filter((r) => r.rating === targetRating);
    }

    // 3. Category Target Filter
    if (selectedCategory !== "all") {
      result = result.filter((r) => r.category === selectedCategory);
    }

    // 4. Sort selection evaluation matching UX conditions
    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "highest") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      result.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === "helpful") {
      result.sort((a, b) => b.helpfulCount - a.helpfulCount);
    }

    return result;
  }, [reviews, searchQuery, selectedRating, selectedCategory, sortBy]);

  // Split featured cards out to showcase pinned content separately
  const featuredReviews = useMemo(() => {
    return reviews.filter((r) => r.isFeatured);
  }, [reviews]);

  // Upvote/Helpful Count Actions handler
  const handleToggleHelpful = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            helpfulCount: r.hasLiked ? r.helpfulCount - 1 : r.helpfulCount + 1,
            hasLiked: !r.hasLiked,
          };
        }
        return r;
      })
    );
  };

  // Report Feedback mitigation routing
  const handleReportReview = (id: string) => {
    toast.success("Review flagged. Our moderation team will investigate this claim within 24 hours.");
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 mb-20">
            <div className="max-w-7xl mx-auto space-y-10">

              {/* Header Title Section */}
              <div className="space-y-1">
                <h1 className={`text-2xl md:text-3xl font-black ${textDark} tracking-tight`}>
                  COMMUNITY REVIEWS
                </h1>
                <p className={`${textMedium} text-sm`}>
                  Explore raw, unfiltered feedback from active learners across our global distribution network.
                </p>
              </div>

              {/* Analytics Summary Breakdown Matrix Container */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Score Card Aggregator */}
                <div className={`${bgCard} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center`}>
                  <span className={`text-sm font-bold uppercase tracking-wider ${textLight}`}>
                    Average Rating
                  </span>
                  <span className={`text-6xl font-black my-2 ${textDark}`}>4.7</span>
                  <div className="flex items-center gap-0.5 text-amber-500 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className={`text-xs ${textMedium}`}>
                    Based on 177 verified submissions
                  </span>
                </div>

                {/* Star Percentage Graph Bars */}
                <div className={`${bgCard} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 md:col-span-2 space-y-2.5`}>
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${textLight} mb-3`}>
                    Rating Density Distribution
                  </h4>
                  {staticBreakdown.map((row) => (
                    <div key={row.stars} className="flex items-center text-sm gap-4">
                      <span className={`w-12 text-xs font-bold ${textDark} flex items-center gap-1`}>
                        {row.stars} <Star className="w-3.5 h-3.5 fill-current text-amber-500 inline" />
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${row.percentage}%`,
                            backgroundColor: primary,
                          }}
                        />
                      </div>
                      <span className={`w-10 text-right text-xs font-medium ${textMedium}`}>
                        {row.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Section: Featured Content Stream */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
                  <Award className="w-4 h-4" />
                  <span>Featured Highlights</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {featuredReviews.map((item) => (
    <div
      key={`featured-${item.id}`}
      className="p-5 rounded-xl border border-amber-200/60 dark:border-amber-950/40 bg-amber-50/20 dark:bg-amber-950/10 relative overflow-hidden"
    >
      {/* Updated Ribbon Classes: Increased px-10, adjusted translate-x-10 & translate-y-3 */}
      <div className="absolute top-0 right-0 transform translate-x-10 translate-y-3 rotate-45 bg-amber-500 text-[10px] uppercase tracking-widest text-white px-10 py-1 font-bold text-center w-[140px]">
        FEATURED
      </div>
      
      <div className="flex items-center gap-1 text-amber-500 mb-2">
        {Array.from({ length: item.rating }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-current" />
        ))}
      </div>
      <h4 className={`font-bold text-sm ${textDark} mb-1 line-clamp-1 pr-12`}>
        {item.subject}
      </h4>
      <p className={`text-xs ${textMedium} line-clamp-3 leading-relaxed`}>
        &ldquo;{item.text}&rdquo;
      </p>
      <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-gray-400">
        <span>— {item.isAnonymous ? "Anonymous" : item.name}</span>
        <span>{item.date}</span>
      </div>
    </div>
  ))}
</div>
              </div>

              <hr className="border-gray-200 dark:border-gray-800" />

              {/* Control Panel: Search & Filters Toolbar */}
             <div className={`${bgCard} rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 space-y-4`}>
  <div className="flex flex-col lg:flex-row gap-3">

    {/* Search input text frame */}
    <div className="flex-1 relative">
      <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search reviews by keyword (e.g. video, support)..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm ${textDark} focus:outline-none focus:ring-2`}
        style={{ "--tw-ring-color": primary } as React.CSSProperties}
      />
    </div>

    {/* Flexible responsive drop selections matrix */}
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 lg:w-auto">

      {/* Star Selection Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger className={`w-full lg:w-40 flex items-center justify-between pl-3 pr-2.5 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 ${textDark} font-medium focus:outline-none`}>
          <span>{ratingsLabels[selectedRating]}</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {Object.entries(ratingsLabels).map(([value, label]) => (
            <DropdownMenuItem
              key={value}
              onClick={() => setSelectedRating(value)}
              className={`text-xs cursor-pointer ${textDark} focus:bg-gray-100 dark:focus:bg-gray-700`}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sorting Engine selector */}
      <DropdownMenu>
        <DropdownMenuTrigger className={`w-full lg:w-40 flex items-center justify-between pl-3 pr-2.5 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 ${textDark} font-medium focus:outline-none`}>
          <span>{sortLabels[sortBy]}</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {Object.entries(sortLabels).map(([value, label]) => (
            <DropdownMenuItem
              key={value}
              onClick={() => setSortBy(value)}
              className={`text-xs cursor-pointer ${textDark} focus:bg-gray-100 dark:focus:bg-gray-700`}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  </div>
</div>

              {/* Master Feed Collection Feed List stream */}
              {filteredAndSortedReviews.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                  <p className={`${textMedium} text-sm`}>
                    No reviews found matching your explicit search matrix parameter rules.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAndSortedReviews.slice(0, visibleCount).map((review) => (
                    <div
                      key={review.id}
                      className={`${bgCard} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-all hover:border-gray-300 dark:hover:border-gray-700 flex flex-col justify-between space-y-4`}
                    >
                      {/* Top Header Card Info block line item details */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-sm font-bold ${textDark}`}>
                                {review.isAnonymous ? "Anonymous Learner" : review.name}
                              </span>
                              {review.isVerified && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-200/40">
                                  <CheckCircle2 className="w-3 h-3" /> Verified Learner
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-0.5 text-amber-500 pt-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? "fill-current" : "text-gray-300 dark:text-gray-700"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className={`text-xs font-medium ${textLight}`}>
                          {review.date}
                        </span>
                      </div>

                      {/* Content Body Block Title and description messages text */}
                      <div className="space-y-1.5">
                        <h3 className={`text-base font-bold ${textDark}`}>
                          {review.subject}
                        </h3>
                        <p className={`text-sm leading-relaxed ${textMedium}`}>
                          {review.text}
                        </p>
                      </div>

                      {/* Interactive Footer Controls action triggers line items */}
                      <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/60 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => handleToggleHelpful(review.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                            review.hasLiked
                              ? "bg-green-50 dark:bg-green-950/20 text-emerald-600"
                              : `hover:bg-gray-100 dark:hover:bg-gray-800 ${textMedium}`
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${review.hasLiked ? "fill-current" : ""}`} />
                          <span>
                            Helpful {review.helpfulCount > 0 && `(${review.helpfulCount})`}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReportReview(review.id)}
                          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Flag className="w-3.5 h-3.5" />
                          <span>Report</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

              {/* Interactive Load More Pagination Matrix controls logic */}
              {filteredAndSortedReviews.length > visibleCount && (
                <div className="flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    type="button"
                    className="flex justify-center gap-2 px-4 py-4 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer shadow-sm tracking-wide"
                    style={{ backgroundColor: primary }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = primary)}
                  >
                    <ChevronDown className="w-4 h-4" />
                    Load More Reviews
                  </button>
                </div>
              )}

            </div>
          </main>
          <LearnerFooter />
          <Nav />
        </div>
      </div>
    </div>
  );
}