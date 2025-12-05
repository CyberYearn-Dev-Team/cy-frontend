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
  ArrowLeft,
  Send,
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
}

// Ensure Tailwind can resolve these colors
const primaryText = { color: primary };
const primaryBg = { backgroundColor: primary };

const ExpandableMessage: React.FC<{ message: string }> = ({ message }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150;

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
        className={`mt-3 flex items-center gap-1 text-sm font-medium transition-colors cursor-pointer ${textMedium}`}
        style={primaryText}
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
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);

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
        "My course progress is not updating even after completing several modules. I've tried refreshing, clearing cache, using different browsers and devices but the progress bar remains stuck at 68%.",
      date: "2025-10-03 14:22",
    },
    {
      id: "TI-004",
      user: "Amina Bello",
      email: "amina@example.com",
      message:
        "I cannot reset my password. It keeps failing with error code 5003. I have tried multiple times over the past 3 days using both email link and SMS verification.",
      date: "2025-10-04 16:50",
    },
  ]);

  const filteredIssues = issues.filter(
    (issue) =>
      issue.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeIssue = issues.find((issue) => issue.id === activeIssueId);

  //  NEW: Determine whether to hide the layout components on mobile
  const isChatOpenOnMobile = activeIssueId !== null;

  return (
    <div className={`flex h-screen ${bgLight}`}>
      {/* AdminSidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* AdminHeader – hidden on mobile when chat is open */}
        <div className={isChatOpenOnMobile ? "hidden lg:block" : "block"}>
          <AdminHeader setSidebarOpen={setSidebarOpen} />
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-hidden p-0 lg:p-4">
          <div className="h-full max-w-7xl mx-auto flex bg-gray-100 dark:bg-gray-900/40 rounded-none lg:rounded-2xl shadow-sm overflow-hidden">
            {/* LEFT PANE – ISSUE LIST */}
            <div
              className={`w-full flex-shrink-0 flex flex-col transition-transform duration-300 ease-in-out lg:w-1/3 border-r border-gray-200 dark:border-gray-800 ${
                activeIssueId ? "hidden lg:flex" : "flex"
              }`}
            >
              {/* Top header */}
              <div className="px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <h2 className={`font-semibold ${textDark}`}>
                    Technical Issues
                  </h2>
                  <p className={`text-xs ${textLight}`}>
                    {filteredIssues.length} conversations
                  </p>
                </div>
                <Siren className={`w-5 h-5`} style={primaryText} />
              </div>

              {/* Search */}
              <div className="px-3 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search user, email, message"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-full text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#72a210] focus:border-transparent outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
                {filteredIssues.length === 0 ? (
                  <div className="h-full flex items-center justify-center px-4 text-center">
                    <p className={textMedium}>
                      No issues found matching your search.
                    </p>
                  </div>
                ) : (
                  filteredIssues.map((issue) => {
                    const isActive = activeIssueId === issue.id;
                    return (
                      <button
                        key={issue.id}
                        onClick={() => setActiveIssueId(issue.id)}
                        className={`w-full flex gap-3 px-4 py-3 text-left text-sm border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer ${
                          isActive
                            ? "bg-[#f4fae7] dark:bg-gray-800/70"
                            : ""
                        }`}
                      >
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs text-white"
                          style={primaryBg}
                        >
                          {issue.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`font-medium text-xs md:text-sm truncate ${textDark}`}
                            >
                              {issue.user}
                            </p>
                            <span className="text-[10px] text-gray-400">
                              {issue.date.split(" ")[0]}
                            </span>
                          </div>
                          <p className="text-[13px] text-gray-500 truncate">
                            {issue.message}
                          </p>
                          <p className="text-[10px] font-bold mt-1" style={primaryText}>
                            {issue.id}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT PANE – CHAT AREA */}
            <div
              className={`w-full flex-1 flex flex-col transition-transform duration-300 ease-in-out bg-[url('/whatsapp-bg.svg')] bg-cover dark:bg-gray-950 ${
                activeIssueId ? "flex" : "hidden lg:flex"
              } lg:w-2/3`}
            >
              {activeIssue ? (
                <>
                  {/* Chat header */}
                  <div className="px-5 py-3 flex items-center justify-between bg-white/95 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveIssueId(null)}
                        className="lg:hidden p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>

                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs text-white flex-shrink-0"
                        style={primaryBg}
                      >
                        {activeIssue.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-semibold ${textDark}`}>
                          {activeIssue.user}
                        </p>
                        <p className={`text-xs ${textLight}`}>
                          {activeIssue.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages body */}
                  <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-gradient-to-b from-gray-100/80 to-gray-200/60 dark:from-gray-900 dark:to-gray-950">
                    {/* User message bubble */}
                    <div className="flex items-start gap-2 max-w-xl">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0"
                        style={primaryBg}
                      >
                        {activeIssue.user[0]}
                      </div>
                      <div className="flex flex-col">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                          <p className="text-xs text-gray-500 mb-1">
                            Issue ID: {activeIssue.id}
                          </p>
                          <p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                            {activeIssue.message}
                          </p>
                        </div>
                        <span className="mt-1 text-[10px] text-gray-400">
                          {activeIssue.date}
                        </span>
                      </div>
                    </div>

                    {/* Admin reply placeholder */}
                    <div className="flex justify-end">
                      <div className="max-w-xl flex flex-col items-end">
                        <div
                          className="rounded-2xl rounded-br-sm px-4 py-3 text-sm text-white shadow-sm"
                          style={primaryBg}
                        >
                          <p>
                            Type and send a response to this technical issue.
                          </p>
                        </div>
                        <span className="mt-1 text-[10px] text-gray-300">
                          Not sent yet
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Input area */}
                  <div className="px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <textarea
                        rows={1}
                        className="flex-1 resize-none rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#72a210] focus:border-transparent outline-none"
                        placeholder="Type your reply to this issue..."
                      />
                      <button
                        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm hover:opacity-90 transition cursor-pointer"
                        style={primaryBg}
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center px-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-1 ${textDark}`}>
                      Select a conversation
                    </h3>
                    <p className={`${textMedium} text-sm`}>
                      Choose a technical issue on the left to view details and
                      reply.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>


        {/* Mobile Nav – hidden on mobile when chat is open */}
        <div className={isChatOpenOnMobile ? "hidden lg:block" : "block"}>
          <Nav />
        </div>
      </div>
    </div>
  );
};

export default TechnicalIssuesPage;