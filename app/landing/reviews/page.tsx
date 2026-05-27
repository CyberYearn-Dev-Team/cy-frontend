"use client";

import React, { useState, useEffect, useMemo } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Phone, Mail, Send, Star, Search, Award, ChevronDown, ThumbsUp, Flag, MessageSquare } from "lucide-react";
import { getCommunityReviews } from "@/lib/services/feedbackService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data structure matching your review card requirements
interface ReviewItem {
  id: string;
  rating: number;
  subject: string;
  text: string;
  name: string;
  isAnonymous: boolean;
  date: string;
  helpfulCount?: number;
  hasLiked?: boolean;
}

export default function PublicReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  // Transform API response to match local data structure
  const transformFeedbackToReview = (feedback: any): ReviewItem => ({
    id: feedback.id,
    rating: feedback.starRating,
    subject: feedback.subject,
    text: feedback.message,
    name: feedback.user?.username || "Anonymous Learner",
    isAnonymous: !feedback.user,
    date: new Date(feedback.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    helpfulCount: feedback.helpfulCount || 0,
    hasLiked: false,
  });

  // Fetch reviews on mount
  useEffect(() => {
    async function fetchReviews() {
      try {
        setIsLoading(true);
        const response = await getCommunityReviews({ page: 1, limit: 50 });
        if (response.data && Array.isArray(response.data)) {
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

  // Calculate statistics
  const reviewStats = useMemo(() => {
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        averageRating: 0,
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
      starCounts[r.rating as keyof typeof starCounts]++;
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

  // Featured reviews (first 2 with 5 stars)
  const featuredReviews = useMemo(() => {
    const fiveStarReviews = reviews.filter((r) => r.rating === 5);
    return fiveStarReviews.slice(0, 2);
  }, [reviews]);

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.subject.toLowerCase().includes(query) ||
          r.text.toLowerCase().includes(query)
      );
    }

    // Rating filter
    if (selectedRating !== "all") {
      result = result.filter((r) => r.rating.toString() === selectedRating);
    }

    // Sort
    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "highest") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      result.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === "helpful") {
      result.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
    }

    return result;
  }, [reviews, searchQuery, selectedRating, sortBy]);

  // Labels
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

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Public Navigation Header */}
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-gray-100 mb-2">
            Community Reviews
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
            Explore raw, unfiltered feedback from active learners across our global distribution network.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Analytics Summary Breakdown Matrix Container */}
            {reviewStats.totalReviews === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Reviews Yet</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                  Be the first to share your experience and help others discover our platform.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Card Aggregator */}
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-bold uppercase tracking-wider text-gray-400">
                    Average Rating
                  </span>
                  <span className="text-6xl font-black my-2 text-gray-900 dark:text-gray-100">{reviewStats.averageRating}</span>
                  <div className="flex items-center gap-0.5 text-amber-500 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Based on {reviewStats.totalReviews} verified submissions
                  </span>
                </div>

                {/* Star Percentage Graph Bars */}
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 md:col-span-2 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Rating Density Distribution
                  </h4>
                  {reviewStats.breakdown.map((row) => (
                    <div key={row.stars} className="flex items-center text-sm gap-4">
                      <span className="w-12 text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                        {row.stars} <Star className="w-3.5 h-3.5 fill-current text-amber-500 inline" />
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-[#72a210] dark:bg-[#a3e635]"
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs font-medium text-gray-600 dark:text-gray-400">
                        {row.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Highlights */}
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
                      <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1 pr-12">
                        {item.subject}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
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

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Search input */}
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search reviews by keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#72a210] dark:focus:ring-[#a3e635]"
                  />
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 lg:w-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full lg:w-40 flex items-center justify-between pl-3 pr-2.5 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium focus:outline-none">
                      <span>{ratingsLabels[selectedRating]}</span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      {Object.entries(ratingsLabels).map(([value, label]) => (
                        <DropdownMenuItem
                          key={value}
                          onClick={() => setSelectedRating(value)}
                          className="text-xs cursor-pointer text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                        >
                          {label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full lg:w-40 flex items-center justify-between pl-3 pr-2.5 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium focus:outline-none">
                      <span>{sortLabels[sortBy]}</span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      {Object.entries(sortLabels).map(([value, label]) => (
                        <DropdownMenuItem
                          key={value}
                          onClick={() => setSortBy(value)}
                          className="text-xs cursor-pointer text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                        >
                          {label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>


            {/* Reviews Grid */}
            {filteredAndSortedReviews.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center">
                <Search className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Reviews Found</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredAndSortedReviews.slice(0, visibleCount).map((review) => (
                  <div
                    key={review.id}
                    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                            {review.isAnonymous ? "Anonymous" : review.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300 dark:text-gray-700"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 mb-4">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        {review.subject}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {review.text}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gray-500">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>
                          Helpful {review.helpfulCount && review.helpfulCount > 0 && `(${review.helpfulCount})`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredAndSortedReviews.length > visibleCount && (
              <div className="flex justify-center text-center">
                <button
                  onClick={handleLoadMore}
                  className="flex justify-center bg-[#72a210] dark:bg-[#72a210] gap-2 px-4 py-3 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer shadow-sm tracking-wide"
                >
                  <ChevronDown className="w-5 h-5" />
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        )}

        {/* Public Contact & Support Section Footer Callout */}
        {/* <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[1.5rem] p-8 md:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-gray-100 mb-3">
              Have Questions Before Joining?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-md mb-6 leading-relaxed">
              Reach out directly to our dedicated support workspace. We're here to help guide you through our core educational platform tools.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-bold">
                <Phone className="h-4 w-4 text-[#72a210] dark:text-[#a3e635]" />
                <span>+0 (000) 000-0000</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-bold">
                <Mail className="h-4 w-4 text-[#72a210] dark:text-[#a3e635]" />
                <span>support@cyberlearn.com</span>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="YOUR NAME"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold tracking-widest text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#72a210] dark:focus:border-[#a3e635]"
              />
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold tracking-widest text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#72a210] dark:focus:border-[#a3e635]"
              />
            </div>
            <textarea
              rows={3}
              placeholder="HOW CAN WE HELP YOU?"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold tracking-widest text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#72a210] dark:focus:border-[#a3e635] resize-none"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-[#72a210] dark:bg-[#a3e635] text-white dark:text-gray-950 font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-[#5a8c0d] dark:hover:bg-[#bbf746] transition-colors cursor-pointer shadow-md"
            >
              Send Message <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div> */}

      </main>

      {/* Public Footer */}
      <Footer />
    </div>
  );
}