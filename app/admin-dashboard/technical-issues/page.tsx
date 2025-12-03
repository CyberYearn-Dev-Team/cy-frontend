"use client";

import React, { useState } from "react";
import {
  Siren,
  Search,
  User,
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import AdminSidebar from "@/components/admin-sidebar";
import AdminHeader from "@/components/admin-header";
import Nav from "@/components/admin-nav";

// 🎨 Theme Colors
const primary = "#72a210";
const secondary = "#507800";
const hover = "#5a850d";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLight = "text-gray-500 dark:text-gray-300";

interface TechnicalIssue {
  id: string;
  user: string;
  email: string;
  message: string;
  date: string;
  // status: "pending" | "reviewed" | "resolved";
}

// Component to handle expandable message
const ExpandableMessage: React.FC<{ message: string }> = ({ message }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150; // Adjust this value as needed

  const shouldTruncate = message.length > maxLength;
  const displayedText =
    shouldTruncate && !isExpanded
      ? message.slice(0, maxLength) + "..."
      : message;

  if (!shouldTruncate) {
    return <p className={`${textDark} mt-2`}>{message}</p>;
  }

  return (
    <div className="mt-2">
      <p className={`${textDark}`}>{displayedText}</p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`mt-3 flex items-center gap-1 text-sm font-medium transition-colors hover:text-[${primary}] ${textMedium}`}
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Show Less
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            View Full Message
          </>
        )}
      </button>
    </div>
  );
};

const TechnicalIssuesPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data (one very long message added for demo)
  const [issues] = useState<TechnicalIssue[]>([
    {
      id: "TI-001",
      user: "Samuel Johnson",
      email: "samuel@example.com",
      message: "I can’t submit my assignment. The submit button does nothing.",
      date: "2025-10-01 09:15",
    },
    {
      id: "TI-002",
      user: "Grace Obi",
      email: "graceobi@example.com",
      message: "The quiz loads forever and never starts.",
      date: "2025-10-02 11:40",
    },
    {
      id: "TI-003",
      user: "John Musa",
      email: "johnmusa@example.com",
      message:
        "My course progress is not updating even after completing several modules. I've tried refreshing, clearing cache, using different browsers (Chrome, Firefox, Edge), and even different devices but the progress bar remains stuck at 68%. This is affecting my ability to unlock the final exam.",
      date: "2025-10-03 14:22",
    },
    {
      id: "TI-004",
      user: "Amina Bello",
      email: "amina@example.com",
      message:
        "I cannot reset my password. It keeps failing with error code 5003. I have tried multiple times over the past 3 days using both email link and SMS verification but nothing works. Please help urgently as I have an exam tomorrow.",
      date: "2025-10-04 16:50",
    },
  ]);

  const filteredIssues = issues.filter(
    (issue) =>
      issue.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 dark:text-yellow-400";
      case "reviewed":
        return "text-blue-600 dark:text-blue-400";
      case "resolved":
        return "text-green-600 dark:text-green-400";
      default:
        return textMedium;
    }
  };

  return (
    <div className={`flex h-screen ${bgLight}`}>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-8 pb-30">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div>
                <h1 className={`text-3xl font-bold ${textDark}`}>
                  Technical Issues
                </h1>
                <p className={`${textMedium}`}>
                  View and manage user-submitted technical problems.
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by user, email or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-${primary.replace(
                  "#",
                  ""
                )} focus:border-transparent`}
                style={{ outline: "none" }}
              />
            </div>

            {/* Issues List */}
            <div className="space-y-4">
              {filteredIssues.length === 0 ? (
                <div
                  className={`${bgCard} rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center`}
                >
                  <p className={textMedium}>
                    No issues found matching your search.
                  </p>
                </div>
              ) : (
                filteredIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`${bgCard} rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md`}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <h3 className={`text-lg font-semibold ${textDark}`}>
                          {issue.id}
                        </h3>
                      </div>

                      {/* User Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-0 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <User className={`w-4 h-4 ${textLight}`} />
                          <span className={textMedium}>{issue.user}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className={`w-4 h-4 ${textLight}`} />
                          <span className={textMedium}>{issue.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${textLight}`} />
                          <span className={textMedium}>{issue.date}</span>
                        </div>
                      </div>

                      {/* Expandable Message */}
                      <ExpandableMessage message={issue.message} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* Mobile Nav */}
        <Nav />
      </div>
    </div>
  );
};

export default TechnicalIssuesPage;
