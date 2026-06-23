"use client";
import Link from "next/link";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/api/auth";
import { submitFeedback } from "@/lib/services/feedbackService";
import Sidebar from "@/components/learner-sidebar";
import Header from "@/components/learner-header";
import Nav from "@/components/learner-nav";
import LearnerFooter from "@/components/learner-footer";
import {
  Star,
  MessageSquare,
  User,
  Mail,
  ShieldAlert,
  CheckCircle2,
  ThumbsUp,
  Flag,
  Eye,
} from "lucide-react";

// Theme Colors copied exactly from LearnerDashboard
const primary = "#72a210";
const hover = "#5a850d";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLight = "text-gray-500 dark:text-gray-300";

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

export default function FeedbackPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Form States
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Auto-pull user info on mount
  useEffect(() => {
    async function loadUserData() {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setName(currentUser.username || currentUser.name || currentUser.displayName || "");
          setEmail(currentUser.email || "");
        }
      } catch (err) {
        console.error("Error pulling account details:", err);
      }
    }
    loadUserData();
  }, []);

  // Derived preview values
  const previewName = isAnonymous ? "Anonymous Learner" : name || "Your Name";
  const previewSubject = subject.trim() || "Your review subject will appear here...";
  const previewMessage =
    message.trim() ||
    "Your review description will appear here as you type...";
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Form Submission
  const handleSubmit = async (
    e: React.FormEvent,
    type: "submit" | "draft"
  ) => {
    e.preventDefault();

    if (type === "draft") {
      toast.success("Progress saved as a draft successfully!");
      return;
    }

    if (rating === 0) {
      toast.error("Please drop a star rating before submitting.");
      return;
    }
    if (!subject.trim()) {
      toast.error("Your feedback needs a subject line.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please write a small description about your experience.");
      return;
    }
    if (!termsAccepted) {
      toast.error("Please check the truthfulness declaration box.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Sending your feedback...");

    try {
      const payload = {
        starRating: rating,
        subject,
        message,
        anonymous: isAnonymous,
      };

      await submitFeedback(payload);

      toast.success("Feedback submitted!", { id: toastId });
      setShowSuccessPopup(true);
      resetForm();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        "Couldn't submit feedback. Let's try that one more time.",
        { id: toastId }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setSubject("");
    setMessage("");
    setIsAnonymous(false);
    setTermsAccepted(false);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 mb-20">
            <div className="max-w-7xl mx-auto space-y-10">

              {/* Page Title — same structure as stored Community Reviews page */}
              <div className="space-y-1">
                <h1
                  className={`text-2xl md:text-3xl font-black ${textDark} tracking-tight`}
                >
                  Share Your Feedback
                </h1>
                <p className={`${textMedium} text-sm`}>
                  Your raw thoughts help us map out future upgrades. Tell us
                  exactly what you run into!
                </p>
              </div>

              {/* Two-column layout: Form + Live Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* ── LEFT: Form ── */}
                <form onSubmit={(e) => handleSubmit(e, "submit")}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {/* <MessageSquare
                          className="w-5 h-5"
                          style={{ color: primary }}
                        /> */}
                        <span>Review Details</span>
                      </CardTitle>
                    </CardHeader>

                    <div className="p-6 space-y-6">

                      {/* 1. Star Rating */}
                      <div className="space-y-2">
                        <label
                          className={`block text-sm font-bold ${textDark}`}
                        >
                          Star Rating
                        </label>
                        <div className="flex items-center gap-1.5 py-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="p-1 focus:outline-none scale-100 hover:scale-110 transition-transform cursor-pointer"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                            >
                              <Star
                                className="w-8 h-8 transition-colors duration-150"
                                fill={
                                  (hoverRating || rating) >= star
                                    ? primary
                                    : "none"
                                }
                                stroke={
                                  (hoverRating || rating) >= star
                                    ? primary
                                    : "#9ca3af"
                                }
                              />
                            </button>
                          ))}
                          {rating > 0 && (
                            <span
                              className={`text-xs ml-2 font-semibold ${textLight}`}
                            >
                              ({rating} out of 5)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 2. Subject */}
                      <div className="space-y-2">
                        <label
                          className={`block text-sm font-bold ${textDark}`}
                        >
                          Subject Line / Title
                        </label>
                        <input
                          type="text"
                          required
                          placeholder='e.g., "Great learning platform" or "Needs cleaner UI handling"'
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent ${textDark} focus:outline-none focus:ring-2`}
                          style={
                            {
                              "--tw-ring-color": primary,
                            } as React.CSSProperties
                          }
                        />
                      </div>

                      {/* 3. Review Message */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label
                            className={`block text-sm font-bold ${textDark}`}
                          >
                            Review Message
                          </label>
                          <span className={`text-xs ${textLight}`}>
                            {message.length} / 1000 chars
                          </span>
                        </div>
                        <textarea
                          required
                          maxLength={1000}
                          rows={5}
                          placeholder="Detail your experience, bugs encountered, or suggestions for missing features..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent ${textDark} focus:outline-none focus:ring-2 resize-none`}
                          style={
                            {
                              "--tw-ring-color": primary,
                            } as React.CSSProperties
                          }
                        />
                      </div>

                      {/* 4. Anonymous toggle */}
                      <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="space-y-0.5">
                          <label
                            className={`text-sm font-bold ${textDark} cursor-pointer`}
                            htmlFor="anonymous-toggle"
                          >
                            Submit anonymously
                          </label>
                          <p className={`text-xs ${textLight}`}>
                            Hides your account identification data from public
                            views.
                          </p>
                        </div>
                        <input
                          id="anonymous-toggle"
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="w-4 h-4 rounded cursor-pointer accent-[#72a210]"
                        />
                      </div>

                      {/* 5. Name & Email (when not anonymous) */}
                      {!isAnonymous && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1.5 opacity-80">
                            <span
                              className={`text-xs font-bold uppercase tracking-wider ${textLight} flex items-center gap-1`}
                            >
                              <User className="w-3.5 h-3.5" /> Display Name
                            </span>
                            <input
                              type="text"
                              disabled
                              value={name || "Not Logged In"}
                              className={`w-full px-3 py-3 text-sm rounded-lg bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 ${textMedium} cursor-not-allowed`}
                            />
                          </div>
                          <div className="space-y-1.5 opacity-80">
                            <span
                              className={`text-xs font-bold uppercase tracking-wider ${textLight} flex items-center gap-1`}
                            >
                              <Mail className="w-3.5 h-3.5" /> Connected Email
                            </span>
                            <input
                              type="email"
                              disabled
                              value={email || "No email detected"}
                              className={`w-full px-3 py-3 text-sm rounded-lg bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 ${textMedium} cursor-not-allowed`}
                            />
                          </div>
                        </div>
                      )}

                      {/* 6. Terms Acceptance */}
                      <div className="flex items-start gap-3 pt-2">
                        <input
                          id="terms-check"
                          type="checkbox"
                          required
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded cursor-pointer accent-[#72a210]"
                        />
                        <label
                          htmlFor="terms-check"
                          className={`text-sm ${textMedium} cursor-pointer select-none`}
                        >
                          I confirm this review represents an accurate
                          description of my actual platform experience and
                          remains respectful.
                        </label>
                      </div>
                    </div>

                    {/* Form Actions Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                        <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Submissions undergo spam review processing</span>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                        <button
                          type="button"
                          onClick={resetForm}
                          className={`px-5 py-3 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 ${textMedium} transition-colors cursor-pointer`}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-5 py-3 rounded-lg text-sm font-bold text-white transition-colors cursor-pointer disabled:opacity-50"
                          style={{
                            backgroundColor: isSubmitting ? hover : primary,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = hover)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = primary)
                          }
                        >
                          {isSubmitting ? "Sending..." : "Submit Review"}
                        </button>
                      </div>
                    </div>
                  </Card>
                </form>

                {/* ── RIGHT: Live Preview ── */}
                <div className="space-y-4 lg:sticky lg:top-6">

                  {/* Preview header label */}
                  <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
                    <Eye className="w-4 h-4" />
                    <span>Live Preview — How your review will appear</span>
                  </div>

                  {/* Preview card — exactly mirrors the review cards in Community Reviews page */}
                  <div
                    className={`${bgCard} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-all flex flex-col justify-between space-y-4`}
                  >
                    {/* Top Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm font-bold ${textDark}`}
                            >
                              {previewName}
                            </span>
                            {!isAnonymous && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-200/40">
                                <CheckCircle2 className="w-3 h-3" /> Verified
                                Learner
                              </span>
                            )}
                          </div>
                          {/* Star display */}
                          <div className="flex items-center gap-0.5 text-amber-500 pt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < (hoverRating || rating)
                                    ? "fill-current"
                                    : "text-gray-300 dark:text-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs font-medium ${textLight}`}>
                        {today}
                      </span>
                    </div>

                    {/* Content Body */}
                    <div className="space-y-1.5">
                      <h3
                        className={`text-base font-bold ${
                          subject.trim()
                            ? textDark
                            : "text-gray-300 dark:text-gray-700 italic"
                        }`}
                      >
                        {previewSubject}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed ${
                          message.trim()
                            ? textMedium
                            : "text-gray-300 dark:text-gray-700 italic"
                        }`}
                      >
                        {previewMessage}
                      </p>
                    </div>

                    {/* Interactive Footer — non-functional in preview */}
                    <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/60 text-xs font-semibold">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${textMedium}`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-gray-400">
                        <Flag className="w-3.5 h-3.5" />
                        <span>Report</span>
                      </div>
                    </div>
                  </div>

                  {/* Preview hint note */}
                  <p className={`text-xs ${textLight} text-center`}>
                    This preview updates in real time as you fill in the form.
                  </p>
                </div>
              </div>
            </div>
          </main>

          <LearnerFooter />
          <Nav />
        </div>
      </div>

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className={`${bgCard} rounded-2xl max-w-sm w-full p-6 text-center shadow-xl border border-gray-200 dark:border-gray-800`}
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7 text-[#72a210]" />
            </div>
            <h3 className={`text-xl font-bold ${textDark} mb-2`}>
              Thanks for your feedback!
            </h3>
            <p className={`${textMedium} text-sm mb-6`}>
              Your response has been securely tracked. We monitor evaluations
              constantly to plan platform patches.
            </p>

            <Link href="/learner-dashboard/dashboard">
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="w-full py-2.5 rounded-lg text-sm font-bold text-white transition-colors cursor-pointer"
              style={{ backgroundColor: primary }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = hover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = primary)
              }
            >
              Back to Dashboard
            </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}