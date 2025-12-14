"use client";

import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Bug,
  Search,
  User,
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Send,
  AlertCircle,
  SendHorizontal,
  Loader2,
} from "lucide-react";
import { TechnicalIssuesSkeleton } from "@/components/ui/TechnicalIssuesSkeleton";
import AdminSidebar from "@/components/admin-sidebar";
import AdminHeader from "@/components/admin-header";
import Nav from "@/components/admin-nav";
// Assuming the path to service file is correct and TechnicalIssue type is imported
import {
  getTechnicalIssues,
  updateTechnicalIssue,
  TechnicalIssue,
} from "@/lib/services/technicalIssueService";

// 🎨 Theme Colors
const primary = "#72a210";
const secondary = "#507800";
const hover = "#5a850d";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLight = "text-gray-500 dark:text-gray-300";

// Ensure Tailwind can resolve these colors
const primaryText = { color: primary };
const primaryBg = { backgroundColor: primary };

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// NOTE: This ExpandableMessage component wasn't used in your provided new code, but keeping it here for completeness
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
  const [issues, setIssues] = useState<TechnicalIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine if the chat is open on mobile (small screen)
  const isChatOpenOnMobile = activeIssueId !== null;

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setIsLoading(true);
        const data = await getTechnicalIssues();
        // Sort issues by createdAt in descending order (newest first)
        const sortedIssues = [...data].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setIssues(sortedIssues);
        // Automatically select the first (newest) issue if none is active and there are issues
        if (!activeIssueId && sortedIssues.length > 0) {
          setActiveIssueId(sortedIssues[0].id);
        }
      } catch (err) {
        console.error("Error fetching technical issues:", err);
        setError("Failed to load technical issues. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleReply = async (issueId: string) => {
    if (!replyText.trim()) return;

    try {
      setIsSubmitting(true);
      // Ensure 'ANSWERED' is one of the valid literal types from TechnicalIssue.status
      await updateTechnicalIssue(issueId, "ANSWERED", replyText);

      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === issueId
            ? { ...issue, status: "ANSWERED", adminReply: replyText }
            : issue
        )
      );

      setReplyText("");
    } catch (err) {
      console.error("Error sending reply:", err);
      setError("Failed to send reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredIssues = issues.filter(
    (issue) =>
      issue.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeIssue = issues.find((issue) => issue.id === activeIssueId);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-white dark:bg-gray-950">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 md:p-6">
            <TechnicalIssuesSkeleton />
          </main>
          <div className="lg:hidden">
            <Nav />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error loading issues
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      {/* 1. Hide AdminSidebar on mobile when chat is open */}
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* 2. Hide AdminHeader on mobile when chat is open */}
        <div className={isChatOpenOnMobile ? "hidden lg:block" : "block"}>
          <AdminHeader setSidebarOpen={setSidebarOpen} />
        </div>

        {/* The main content structure needs to be adjusted to match the old two-pane layout for mobile toggling */}
        <main className="flex-1 overflow-y-auto p-0 lg:p-4">
          <div className="h-full max-w-7xl mx-auto flex bg-gray-100 dark:bg-gray-900/40 rounded-none lg:rounded-2xl shadow-sm overflow-hidden">
            
            {/* LEFT PANE – ISSUE LIST */}
            <div
              className={`w-full flex-shrink-0 flex flex-col lg:w-1/3 border-r border-gray-200 dark:border-gray-800 ${
                activeIssueId ? "hidden lg:flex" : "flex"
              }`}>

                
              {/* Top header (Issue List title) */}
              <div className="px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`font-semibold ${textDark}`}>
                      Technical Issues
                    </h2>
                    {filteredIssues.some(issue => issue.status === 'PENDING') && (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                        {filteredIssues.filter(issue => issue.status === 'PENDING').length}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${textLight}`}>
                    {filteredIssues.length} {filteredIssues.length === 1 ? 'conversation' : 'conversations'}
                    {filteredIssues.some(issue => issue.status === 'PENDING') && (
                      <span className="ml-2 text-red-500">
                        • {filteredIssues.filter(issue => issue.status === 'PENDING').length} pending
                      </span>
                    )}
                  </p>
                </div>
                <Bug className={`w-5 h-5`} style={primaryText} />
              </div>



              {/* Search */}
              <div className="px-3 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
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




              {/* List of messages */}
               <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 pb-25 sm:pb-0">
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
                          {issue.user.profileImage ? (
                            <img
                              src={issue.user.profileImage}
                              alt={issue.user.username}
                              className="h-full w-full object-cover rounded-full"
                            />
                          ) : (
                            getInitials(issue.user.username)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`font-medium text-[15px] md:text-sm truncate ${textDark}`}
                            >
                              {issue.user.username}
                            </p>
                            <span className="text-[10px] text-gray-400">
                              {new Date(issue.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <p className="text-[13px] text-gray-500 truncate">
                              {issue.message}
                            </p>
                            {issue.status === 'PENDING' && (
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#72a210] text-white text-[10px] font-bold ml-2 flex-shrink-0">
                                <SendHorizontal  className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-bold mt-1 text-gray-500">
                            {issue.id} • {issue.status}
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
              className={`w-full flex-1 flex flex-col  bg-cover dark:bg-gray-950 ${
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
                        className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs text-white flex-shrink-0 overflow-hidden"
                        style={primaryBg}
                      >
                         {activeIssue.user.profileImage ? (
                            <img
                              src={activeIssue.user.profileImage}
                              alt={activeIssue.user.username}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitials(activeIssue.user.username)
                          )}
                      </div>
                      <div>
                        <p className={`font-semibold ${textDark}`}>
                          {activeIssue.user.username}
                        </p>
                        <p className={`text-xs ${textLight}`}>
                          {activeIssue.user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages body (Scrollable area) */}
                  <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-gradient-to-b from-gray-100/80 to-gray-200/60 dark:from-gray-900 dark:to-gray-950">
                    {/* User message bubble */}
                    <div className="flex items-start gap-2 max-w-xl">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0 overflow-hidden"
                        style={primaryBg}
                      >
                         {activeIssue.user.profileImage ? (
                            <img
                              src={activeIssue.user.profileImage}
                              alt={activeIssue.user.username}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            activeIssue.user.username[0]
                          )}
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
                          {new Date(activeIssue.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Admin reply (If sent) */}
                    {activeIssue.adminReply && (
                      <div className="flex justify-end">
                        <div className="max-w-xl flex flex-col items-end">
                          <div
                            className="rounded-2xl rounded-br-sm px-4 py-3 text-sm text-white shadow-sm"
                            style={primaryBg}
                          >
                            <p>
                              {activeIssue.adminReply}
                            </p>
                          </div>
                          <span className="mt-1 text-[10px] text-gray-400 dark:text-gray-300">
                            Replied: {new Date(activeIssue.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Admin reply placeholder (If not sent yet) - Keeping the old code style for consistency */}
                    {!activeIssue.adminReply && (
                        <div className="flex justify-end">
                            <div className="max-w-xl flex flex-col items-end">
                                <div
                                    className="rounded-2xl rounded-br-sm px-4 py-3 text-sm text-white shadow-sm bg-gray-400 dark:bg-gray-700 opacity-80"
                                >
                                    <p>
                                        Type and send a response to this technical issue.
                                    </p>
                                </div>
                                <span className="mt-1 text-[10px] text-gray-400 dark:text-gray-300">
                                    Not sent yet
                                </span>
                            </div>
                        </div>
                    )}
                  </div>

                  {/* 3. Input area - Fixed design to match stored code style */}
                  <div className="px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <textarea
                        rows={1} // Use rows={1} for a single-line look, resize-none
                        className="flex-1 resize-none rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#72a210] focus:border-transparent outline-none"
                        placeholder="Type your reply to this issue..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        disabled={isSubmitting}
                      />
                      <button
                        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        style={primaryBg}
                        onClick={() => handleReply(activeIssue.id)}
                        disabled={!replyText.trim() || isSubmitting}
                      >
                         {isSubmitting ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
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


        {/* 4. Hide Mobile Nav when chat is open */}
        <div className={isChatOpenOnMobile ? "hidden lg:block" : "block"}>
          <Nav />
        </div>
      </div>
    </div>
  );
};

export default TechnicalIssuesPage;