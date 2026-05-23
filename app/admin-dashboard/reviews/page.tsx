"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import AdminSidebar from "@/components/admin-sidebar";
import AdminHeader from "@/components/admin-header";
import Nav from "@/components/admin-nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Star,
  Search,
  EyeOff,
  Trash2,
  Eye,
  ChevronDown,
  User,
  Mail,
  CheckCircle2,
  X,
} from "lucide-react";

// Color definitions matching the verified layout components
const primary = "#72a210";
const hover = "#5a850d";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLight = "text-gray-500 dark:text-gray-300";

const initialReviews = [
  {
    id: "REV-901",
    userName: "Alice Vance",
    email: "alice.v@gmail.com",
    rating: 5,
    subject: "Brilliant platform architectures",
    text: "The state container orchestration guides clarified multiple production performance bottlenecks for our team. Absolutely phenomenal documentation infrastructure.",
    category: "Content Quality",
    date: "2026-05-22",
    status: "Approved",
    isVerified: true,
  },
  {
    id: "REV-402",
    userName: "CryptoBot_99",
    email: "spambot@tempinbox.net",
    rating: 1,
    subject: "CLICK HERE FOR FREE BITCOIN!!!",
    text: "Earn fast profits guaranteed by visiting our malicious redirect hyperlink now. Zero risk automated trading matrices ready inside.",
    category: "General Feedback",
    date: "2026-05-21",
    status: "Pending",
    isVerified: false,
  },
  {
    id: "REV-118",
    userName: "David Miller",
    email: "d.miller@outlook.com",
    rating: 2,
    subject: "Extremely frustrated with response latency",
    text: "The site performance dropped significantly during yesterday's system update window. Fix your background processes immediately, this is terrible software engineering.",
    category: "Performance",
    date: "2026-05-19",
    status: "Approved",
    isVerified: true,
  },
  {
    id: "REV-305",
    userName: "Anonymous Learner",
    email: "hidden.user@privacy.org",
    rating: 4,
    subject: "Clean styling profiles",
    text: "Tailwind configurations are nicely unified. Dark mode switching doesn't flash unstyled markup on page hydration changes.",
    category: "UI/Design",
    date: "2026-05-15",
    status: "Hidden",
    isVerified: false,
  },
  {
    id: "REV-210",
    userName: "Sophie Turner",
    email: "sophie.t@outlook.com",
    rating: 4,
    subject: "Good value for money",
    text: "Compared to other platforms, this offers the best bang for buck. The quality of content justifies the price. Would recommend to anyone serious about learning.",
    category: "General Feedback",
    date: "2026-05-10",
    status: "Approved",
    isVerified: true,
  },
];

type Review = (typeof initialReviews)[0];

const statusLabels: Record<string, string> = {
  All: "All Statuses",
  Hidden: "Hidden",
};

const ratingLabels: Record<string, string> = {
  All: "All Stars",
  "5": "5 Stars",
  "4": "4 Stars",
  "3": "3 Stars",
  "2": "2 Stars",
  "1": "1 Star",
};

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 border-emerald-200";
    case "visible":
      return "bg-amber-50 dark:bg-amber-950/30 text-amber-700 border-amber-200";
    case "Hidden":
      return "bg-gray-100 dark:bg-gray-800 text-gray-600 border-gray-300";
    default:
      return "bg-gray-50 dark:bg-gray-900 text-gray-500 border-gray-200";
  }
};

// ── Confirmation / View Modal ──────────────────────────────────────────────────
function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  confirmColor = "rose",
  icon: Icon,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  confirmColor?: "rose" | "amber";
  icon: React.ElementType;
}) {
  if (!open) return null;
  const btnClass =
    confirmColor === "rose"
      ? "bg-rose-600 hover:bg-rose-700"
      : "bg-amber-500 hover:bg-amber-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`${bgCard} rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-200 dark:border-gray-800 space-y-4`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                confirmColor === "rose"
                  ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600"
                  : "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-black ${textDark}`}>{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className={`text-sm ${textMedium} leading-relaxed`}>{description}</p>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 ${textMedium} transition-colors cursor-pointer`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors cursor-pointer ${btnClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── View Review Modal ──────────────────────────────────────────────────────────
function ViewReviewModal({
  review,
  onClose,
}: {
  review: Review | null;
  onClose: () => void;
}) {
  if (!review) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`${bgCard} rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 dark:border-gray-800 space-y-5`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className={`text-base font-black ${textDark} tracking-tight`}>
            Review Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm font-bold ${textDark}`}>
                {review.userName}
              </span>
              {review.isVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-200/40">
                  <CheckCircle2 className="w-3 h-3" /> Verified Student
                </span>
              )}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeStyle(
                  review.status
                )}`}
              >
                {review.status}
              </span>
            </div>
            <div className={`text-xs ${textMedium} flex items-center gap-1`}>
              <Mail className="w-3.5 h-3.5" />
              {review.email}
            </div>
            <div className={`text-xs ${textLight}`}>
              Submitted: {review.date} &nbsp;·&nbsp; ID:{" "}
              <span className="font-mono">{review.id}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${textLight}`}>
            Rating
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? "fill-current"
                    : "text-gray-300 dark:text-gray-700"
                }`}
              />
            ))}
            <span className={`text-xs ml-1 font-semibold ${textLight}`}>
              ({review.rating} / 5)
            </span>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${textLight}`}>
            Category
          </span>
          <span className="inline-block text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold px-2.5 py-1 rounded-lg">
            {review.category}
          </span>
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${textLight}`}>
            Subject
          </span>
          <p className={`text-sm font-bold ${textDark}`}>{review.subject}</p>
        </div>

        {/* Full Review Text */}
        <div className="space-y-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${textLight}`}>
            Review
          </span>
          <p className={`text-sm leading-relaxed ${textMedium}`}>
            {review.text}
          </p>
        </div>

        {/* Close */}
        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-bold text-white transition-colors cursor-pointer"
            style={{ backgroundColor: primary }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = hover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = primary)
            }
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ReviewManagementPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reviews, setReviews] = useState(initialReviews);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");

  // Modal state
  const [viewTarget, setViewTarget] = useState<Review | null>(null);
  const [hideTarget, setHideTarget] = useState<Review | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  // Stats
  const stats = useMemo(() => ({
    total: reviews.length,
    hidden: reviews.filter((r) => r.status === "Hidden").length,
    visible: reviews.filter((r) => r.status === "Pending").length,
  }), [reviews]);

  // Filtered list
  const filteredReviews = useMemo(() => {
    return reviews.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      const matchesRating =
        ratingFilter === "All" || item.rating.toString() === ratingFilter;
      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, searchTerm, statusFilter, ratingFilter]);

  // Actions
  const confirmHide = () => {
    if (!hideTarget) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === hideTarget.id ? { ...r, status: "Hidden" } : r
      )
    );
    toast.success("Review hidden from public view.");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    toast.error("Review permanently deleted.");
  };

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 pb-30">

            {/* Page Title */}
            <div className="space-y-1">
              <h1 className={`text-2xl md:text-3xl font-black ${textDark} tracking-tight`}>
                REVIEW MANAGEMENT
              </h1>
              <p className={`${textMedium} text-sm`}>
                Audit pipeline entries, verify customer accounts, and enforce
                community structural guidelines.
              </p>
            </div>

           {/* Stats — Total / Hidden / Visible */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {[
    { title: "Total Reviews", count: stats.total, color: textDark },
    { title: "Hidden Reviews", count: stats.hidden, color: "text-gray-400" },
    { title: "Visible Reviews", count: stats.visible, color: "text-emerald-500" },
  ].map((card, idx) => (
    <div
      key={idx}
      className={`${bgCard} p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col justify-between`}
    >
      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
        {card.title}
      </span>

      <span className={`text-3xl font-black mt-2 ${card.color}`}>
        {card.count}
      </span>
    </div>
  ))}
</div>

            {/* Filter Bar */}
            <div
              className={`${bgCard} rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800`}
            >
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter by ID, subject, name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm ${textDark} focus:outline-none focus:ring-2`}
                    style={{ "--tw-ring-color": primary } as React.CSSProperties}
                  />
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-2 gap-2 lg:w-auto">
                  {/* Status */}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={`w-full lg:w-40 flex items-center justify-between pl-3 pr-2.5 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 ${textDark} font-medium focus:outline-none`}
                    >
                      <span>{statusLabels[statusFilter]}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <DropdownMenuItem
                          key={value}
                          onClick={() => setStatusFilter(value)}
                          className={`text-sm cursor-pointer ${textDark} focus:bg-gray-100 dark:focus:bg-gray-700`}
                        >
                          {label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Rating */}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={`w-full lg:w-40 flex items-center justify-between pl-3 pr-2.5 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 ${textDark} font-medium focus:outline-none`}
                    >
                      <span>{ratingLabels[ratingFilter]}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    >
                      {Object.entries(ratingLabels).map(([value, label]) => (
                        <DropdownMenuItem
                          key={value}
                          onClick={() => setRatingFilter(value)}
                          className={`text-sm cursor-pointer ${textDark} focus:bg-gray-100 dark:focus:bg-gray-700`}
                        >
                          {label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div
              className={`${bgCard} rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/70 dark:bg-gray-800/40 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-200 dark:border-gray-800">
                      <th className="p-4.5">Author</th>
                      <th className="p-4.5">Reference ID</th>
                      <th className="p-4.5">Rating</th>
                      <th className="p-4.5">Subject</th>
                      <th className="p-4.5 text-center">Status</th>
                      <th className="p-4.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                    {filteredReviews.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-gray-400"
                        >
                          No reviews matched your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredReviews.map((review) => (
                        <tr
                          key={review.id}
                          className="hover:bg-gray-50/40 dark:hover:bg-gray-900/30 transition-colors"
                        >

                          {/* Author */}
                          <td className="p-4.5 space-y-1.5">
                            <div
                              className={`font-bold ${textDark} flex items-center gap-1.5`}
                            >
                              <User className="w-4 h-4 text-gray-400" />
                              {review.userName}
                            </div>
                            <div className="text-gray-400 text-xs flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              {review.email}
                            </div>
                          </td>

                          
                          {/* ID */}
                          <td className="p-4.5 font-mono font-bold text-gray-400">
                            {review.id}
                            <div className="text-xs font-sans font-normal text-gray-400 mt-1">
                              {review.date}
                            </div>
                          </td>

                          {/* Rating */}
                          <td className="p-4.5">
                            <div className="flex items-center text-amber-500 gap-0.5">
                              {Array.from({ length: review.rating }).map(
                                (_, idx) => (
                                  <Star
                                    key={idx}
                                    className="w-4 h-4 fill-current"
                                  />
                                )
                              )}
                            </div>
                          </td>

                          {/* Subject */}
                          <td className="p-4.5 max-w-xs">
                            <div className={`font-bold ${textDark} truncate`}>
                              {review.subject}
                            </div>
                            <p
                              className={`${textMedium} line-clamp-1 text-xs mt-1`}
                            >
                              {review.text}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="p-4.5 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeStyle(
                                review.status
                              )}`}
                            >
                              {review.status}
                            </span>
                          </td>

                          {/* Actions: View, Hide, Delete */}
                          <td className="p-4.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* View */}
                              <button
                                onClick={() => setViewTarget(review)}
                                title="View full review"
                                className="p-2 rounded bg-blue-50 dark:bg-blue-950/20 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                              >
                                <Eye className="w-5 h-5" />
                              </button>

                              {/* Hide — only show if not already hidden */}
                              {review.status !== "Hidden" && (
                                <button
                                  onClick={() => setHideTarget(review)}
                                  title="Hide review"
                                  className="p-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                >
                                  <EyeOff className="w-5 h-5" />
                                </button>
                              )}

                              {/* Delete */}
                              <button
                                onClick={() => setDeleteTarget(review)}
                                title="Delete review"
                                className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Nav />

      {/* View Modal */}
      <ViewReviewModal
        review={viewTarget}
        onClose={() => setViewTarget(null)}
      />

      {/* Hide Confirm Modal */}
      <ConfirmModal
        open={!!hideTarget}
        onClose={() => setHideTarget(null)}
        onConfirm={confirmHide}
        title="Hide Review?"
        description={`This will remove "${hideTarget?.subject}" from public view. The review will remain in the system and can be reviewed internally.`}
        confirmLabel="Hide Review"
        confirmColor="amber"
        icon={EyeOff}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Review?"
        description={`This will permanently delete "${deleteTarget?.subject}" from the database. This action cannot be undone.`}
        confirmLabel="Delete Permanently"
        confirmColor="rose"
        icon={Trash2}
      />
    </div>
  );
}