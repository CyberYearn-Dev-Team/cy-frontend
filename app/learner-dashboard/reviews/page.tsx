"use client";

import React, { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import Sidebar from "@/components/learner-sidebar";
import Header from "@/components/learner-header";
import LearnerFooter from "@/components/learner-footer";
import { getCommunityReviews, toggleHelpful, reportReview } from "@/lib/services/feedbackService";
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

interface Review {
  id: string;
  name: string;
  isAnonymous: boolean;
  rating: number;
  subject: string;
  text: string;
  date: string;
  category: string;
  isVerified: boolean;
  isFeatured: boolean;
  helpfulCount: number;
  hasLiked: boolean;
}

const primary = "#72a210";
const hover = "#5a850d";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLight = "text-gray-500 dark:text-gray-300";

const transformFeedbackToReview = (feedback: any): Review => ({
  id: feedback.id,
  name: feedback.user?.username || "Anonymous Learner",
  isAnonymous: !feedback.user,
  rating: feedback.starRating,
  subject: feedback.subject || "",
  text: feedback.message || "",
  date: new Date(feedback.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  category: "General Feedback",
  isVerified: !!feedback.user,
  isFeatured: feedback.featured || false,
  helpfulCount: feedback.helpfulCount || 0,
  hasLiked: false,
});

const ratingsLabels: Record<string, string> = {
  all: "All Ratings",
  "5": "5 Stars",
  "4": "4 Stars",
  "3": "3 Stars",
  "2": "2 Stars",
  "1": "1 Star",
};

const sortLabels: Record<string, string> = {
  recent: "Most Recent",
  highest: "Highest Rated",
  lowest: "Lowest Rated",
  helpful: "Most Helpful",
};

export default function CommunityReviewsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setIsLoading(true);
        const response = await getCommunityReviews({ page: 1, limit: 50 });
        if (response?.data && Array.isArray(response.data)) {
          const transformedReviews = response.data.map(transformFeedbackToReview);
          setReviews(transformedReviews);
        }
      } catch (error) {
        console.error("Error fetching community reviews:", error);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.subject.toLowerCase().includes(query) ||
          r.text.toLowerCase().includes(query)
      );
    }

    if (selectedRating !== "all") {
      const targetRating = parseInt(selectedRating, 10);
      result = result.filter((r) => r.rating === targetRating);
    }

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
  }, [reviews, searchQuery, selectedRating, sortBy]);

  const featuredReviews = useMemo(() => {
    return reviews.filter((r) => r.rating === 5).slice(0, 2);
  }, [reviews]);

  const reviewStats = useMemo(() => {
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        averageRating: "0.0",
        totalReviews: 0,
        breakdown: [
          { stars: 5, count: 0, percentage: 0 },
          { stars: 4, count: 0, percentage: 0 },
          { stars: 3, count: 0, percentage: 0 },
          { stars: 2, count: 0, percentage: 0 },
          { stars: 1, count: 0, percentage: 0 },
        ],
      };
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = (totalRating / totalReviews).toFixed(1);

    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const ratingKey = r.rating as keyof typeof starCounts;
      if (starCounts[ratingKey] !== undefined) {
        starCounts[ratingKey]++;
      }
    });

    const breakdown = [
      { stars: 5, count: starCounts[5], percentage: Math.round((starCounts[5] / totalReviews) * 100) },
      { stars: 4, count: starCounts[4], percentage: Math.round((starCounts[4] / totalReviews) * 100) },
      { stars: 3, count: starCounts[3], percentage: Math.round((starCounts[3] / totalReviews) * 100) },
      { stars: 2, count: starCounts[2], percentage: Math.round((starCounts[2] / totalReviews) * 100) },
      { stars: 1, count: starCounts[1], percentage: Math.round((starCounts[1] / totalReviews) * 100) },
    ];

    return { averageRating, totalReviews, breakdown };
  }, [reviews]);

  const handleToggleHelpful = async (id: string) => {
    try {
      const response = await toggleHelpful(id);
      setReviews((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              helpfulCount: response.helpful ? r.helpfulCount + 1 : r.helpfulCount - 1,
              hasLiked: response.helpful,
            };
          }
          return r;
        })
      );
      toast.success(response.message);
    } catch (error) {
      console.error("Error toggling helpful:", error);
      toast.error("Failed to update helpful vote. Please try again.");
    }
  };

  const handleReportReview = async (id: string) => {
    try {
      await reportReview(id);
      toast.success("Review flagged. Our moderation team will investigate this claim within 24 hours.");
    } catch (error: any) {
      console.error("Error reporting review:", error);
      if (error.response?.status === 409) {
        toast.error("You have already reported this review.");
      } else {
        toast.error("Failed to report review. Please try again.");
      }
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 mb-20">
            <div className="max-w-7xl mx-auto space-y-10">

              <div className="space-y-1">
                <h1 className={`text-2xl md:text-3xl font-black ${textDark} tracking-tight`}>
                  Community Reviews
                </h1>
                <p className={`${textMedium} text-sm`}>
                  Explore raw, unfiltered feedback from active learners across our global distribution network.
                </p>
              </div>

              {reviewStats.totalReviews === 0 && !isLoading ? (
                <div className={`${bgCard} rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center`}>
                  <h3 className={`text-xl font-bold ${textDark} mb-2`}>No Reviews Yet</h3>
                  <p className={`text-sm ${textMedium} max-w-md`}>
                    Be the first to share your experience and help others discover our platform.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`${bgCard} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center`}>
                    <span className={`text-sm font-bold uppercase tracking-wider ${textLight}`}>
                      Average Rating
                    </span>
                    <span className={`text-6xl font-black my-2 ${textDark}`}>{reviewStats.averageRating}</span>
                    <div className="flex items-center gap-0.5 text-amber-500 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <span className={`text-xs ${textMedium}`}>
                      Based on {reviewStats.totalReviews} verified submissions
                    </span>
                  </div>

                  <div className={`${bgCard} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 md:col-span-2 space-y-2.5`}>
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${textLight} mb-3`}>
                      Rating Density Distribution
                    </h4>
                    {reviewStats.breakdown.map((row) => (
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
              )}

              {featuredReviews.length > 0 && (
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
              )}

              <hr className="border-gray-200 dark:border-gray-800" />

              <div className={`${bgCard} rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 space-y-4`}>
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search reviews by keyword..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm ${textDark} focus:outline-none focus:ring-2 focus:ring-[#72a210]`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 lg:w-auto">
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

              {isLoading ? (
                <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                  <p className={`${textMedium} text-sm`}>Loading reviews...</p>
                </div>
              ) : filteredAndSortedReviews.length === 0 ? (
                <div className={`${bgCard} rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center`}>
                  <Search className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                  <h3 className={`text-xl font-bold ${textDark} mb-2`}>No Reviews Found</h3>
                  <p className={`${textMedium} text-sm max-w-md`}>
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAndSortedReviews.slice(0, visibleCount).map((review) => (
                    <div
                      key={review.id}
                      className={`${bgCard} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-all hover:border-gray-300 dark:hover:border-gray-700 flex flex-col justify-between space-y-4`}
                    >
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

                      <div className="space-y-1.5">
                        <h3 className={`text-base font-bold ${textDark}`}>
                          {review.subject}
                        </h3>
                        <p className={`text-sm leading-relaxed ${textMedium}`}>
                          {review.text}
                        </p>
                      </div>

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
        </div>
      </div>
    </div>
  );
}