"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  User,
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Send,
  Loader2,
  MessageCircle,
} from "lucide-react";

import LearnerSidebar from "@/components/learner-sidebar";
import LearnerHeader from "@/components/learner-header";
import Nav from "@/components/learner-nav";

// 🎨 Theme Colors
const primary = "#72a210";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLight = "text-gray-500 dark:text-gray-300";

const primaryText = { color: primary } as React.CSSProperties;
const primaryBg = { backgroundColor: primary } as React.CSSProperties;

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

type Message = {
  id: string;
  sender: "learner" | "admin";
  content: string;
  createdAt: string;
};

type Conversation = {
  id: string;
  username: string;
  status: "OPEN" | "ANSWERED" | "CLOSED";
  learner: { username: string; email: string; profileImage?: string };
  messages: Message[];
};

// Mock data — learner's conversations
const initialConversations: Conversation[] = [
  {
    id: "C-1001",
    username: "chidera",
    status: "OPEN",
    learner: { username: "You (Shillmonger)", email: "you@example.com" },
    messages: [
      {
        id: "m1",
        sender: "learner",
        content: "I can't submit my assignment. The submit button does nothing.",
        createdAt: "2025-10-01T09:15:00Z",
      },
      {
        id: "m2",
        sender: "admin",
        content: "Thanks — we're investigating. Can you tell me which browser you're using?",
        createdAt: "2025-10-01T10:00:00Z",
      },
    ],
  },
  {
    id: "C-1002",
    username: "Shillmonger",
    status: "ANSWERED",
    learner: { username: "You (Shillmonger)", email: "you@example.com" },
    messages: [
      {
        id: "m3",
        sender: "learner",
        content: "The quiz loads forever and never starts.",
        createdAt: "2025-10-02T11:40:00Z",
      },
      {
        id: "m4",
        sender: "admin",
        content: "We fixed a server-side issue. Please try clearing cache and reload — it should work now.",
        createdAt: "2025-10-02T12:10:00Z",
      },
    ],
  },
  {
    id: "C-1003",
    username: "Jennifer",
    status: "OPEN",
    learner: { username: "You (Shillmonger)", email: "you@example.com" },
    messages: [
      {
        id: "m5",
        sender: "learner",
        content:
          "My course progress is not updating even after completing several modules. It's stuck at 68%.",
        createdAt: "2025-10-03T14:22:00Z",
      },
    ],
  },
];

const ExpandableMessage: React.FC<{ message: string }> = ({ message }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150;
  const shouldTruncate = message.length > maxLength;
  const displayed = shouldTruncate && !isExpanded ? message.slice(0, maxLength) + "..." : message;

  if (!shouldTruncate) return <p className={`${textDark} mt-0`}>{message}</p>;

  return (
    <div>
      <p className={`${textDark}`}>{displayed}</p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`mt-2 flex items-center gap-1 text-sm font-medium transition-colors cursor-pointer ${textMedium}`}
        style={primaryText}
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" /> Show Less
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" /> View Full Message
          </>
        )}
      </button>
    </div>
  );
};

const LearnerPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string | null>(conversations[0]?.id ?? null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isChatOpenOnMobile = activeConvId !== null;

  // Keep a ref to the messages container to auto-scroll
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to bottom when active conversation or messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvId, conversations]);

  const filteredConvs = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.username.toLowerCase().includes(q) ||
      c.learner.username.toLowerCase().includes(q) ||
      c.learner.email.toLowerCase().includes(q) ||
      c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  });

  const activeConv = conversations.find((c) => c.id === activeConvId) ?? null;

  const handleSend = async () => {
    if (!replyText.trim() || !activeConv) return;
    setIsSubmitting(true);

    // Simulate network delay
    await new Promise((res) => setTimeout(res, 400));

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      sender: "learner",
      content: replyText.trim(),
      createdAt: new Date().toISOString(),
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConv.id
          ? { ...conv, messages: [...conv.messages, newMessage], status: "OPEN" }
          : conv
      )
    );

    setReplyText("");
    setIsSubmitting(false);

    // OPTIONAL: simulate an admin auto-reply after a short delay to show two-way chat
    setTimeout(() => {
      const adminReply: Message = {
        id: `m-admin-${Date.now()}`,
        sender: "admin",
        content: "Thanks for your message — our support will look into this and get back to you shortly.",
        createdAt: new Date().toISOString(),
      };
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConv.id
            ? { ...conv, messages: [...conv.messages, adminReply], status: "ANSWERED" }
            : conv
        )
      );
    }, 1200);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      {/* Sidebar — hidden on mobile when chat is open */}
      <LearnerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header — hidden on mobile when chat is open */}
        <div className={isChatOpenOnMobile ? "hidden lg:block" : "block"}>
          <LearnerHeader setSidebarOpen={setSidebarOpen} />
        </div>

        <main className="flex-1 overflow-y-auto p-0 lg:p-4">
          <div className="h-full max-w-7xl mx-auto flex bg-gray-100 dark:bg-gray-900/40 rounded-none lg:rounded-2xl shadow-sm overflow-hidden">
            {/* LEFT PANE – Conversations list */}
            <div
              className={`w-full flex-shrink-0 flex flex-col lg:w-1/3 border-r border-gray-200 dark:border-gray-800 ${
                activeConvId ? "hidden lg:flex" : "flex"
              }`}
            >
              <div className="px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`font-semibold ${textDark}`}>My Support Chats</h2>
                    {filteredConvs.some((c) => c.status === "OPEN") && (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                        {filteredConvs.filter((c) => c.status === "OPEN").length}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${textLight}`}>
                    {filteredConvs.length} {filteredConvs.length === 1 ? "conversation" : "conversations"}
                    {filteredConvs.some((c) => c.status === "OPEN") && (
                      <span className="ml-2 text-red-500">• {filteredConvs.filter((c) => c.status === "OPEN").length} open</span>
                    )}
                  </p>
                </div>
                <MessageCircle className="w-5 h-5" style={primaryText} />
              </div>

              {/* Search */}
              <div className="px-3 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search username, message, email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-full text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#72a210] focus:border-transparent outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 pb-25 sm:pb-0">
                {filteredConvs.length === 0 ? (
                  <div className="h-full flex items-center justify-center px-4 text-center">
                    <p className={textMedium}>No conversations found matching your search.</p>
                  </div>
                ) : (
                  filteredConvs.map((conv) => {
                    const lastMsg = conv.messages[conv.messages.length - 1];
                    const isActive = activeConvId === conv.id;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => setActiveConvId(conv.id)}
                        className={`w-full flex gap-3 px-4 py-3 text-left text-sm border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer ${
                          isActive ? "bg-[#f4fae7] dark:bg-gray-800/70" : ""
                        }`}
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs text-white" style={primaryBg}>
                          {getInitials(conv.learner.username)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`font-medium text-[15px] md:text-sm truncate ${textDark}`}>{conv.username}</p>
                            <span className="text-[10px] text-gray-400">{new Date(conv.messages[0].createdAt).toLocaleDateString()}</span>
                          </div>

                          <div className="flex justify-between items-center w-full">
                            <p className="text-[13px] text-gray-500 truncate">{lastMsg?.content ?? "No messages yet"}</p>
                            {conv.status === "OPEN" && (
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#72a210] text-white text-[10px] font-bold ml-2 flex-shrink-0">!
                              </span>
                            )}
                          </div>

                          <p className="text-[10px] font-bold mt-1 text-gray-500">{conv.id} • {conv.status}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT PANE – Chat Area */}
            <div className={`w-full flex-1 flex flex-col bg-[url('/whatsapp-bg.svg')] bg-cover dark:bg-gray-950 ${activeConvId ? "flex" : "hidden lg:flex"} lg:w-2/3`}>
              {activeConv ? (
                <>
                  {/* Chat header */}
                  <div className="px-5 py-3 flex items-center justify-between bg-white/95 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setActiveConvId(null)} className="lg:hidden p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition cursor-pointer">
                        <ArrowLeft className="w-5 h-5" />
                      </button>

                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs text-white flex-shrink-0 overflow-hidden" style={primaryBg}>
                        {activeConv.learner.profileImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={activeConv.learner.profileImage} alt={activeConv.learner.username} className="h-full w-full object-cover" />
                        ) : (
                          getInitials(activeConv.learner.username)
                        )}
                      </div>

                      <div>
                        <p className={`font-semibold ${textDark}`}>{activeConv.username}</p>
                        <p className={`text-xs ${textLight}`}>{activeConv.learner.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Status: <span className="font-bold">{activeConv.status}</span></p>
                      <p className="text-xs text-gray-400">{activeConv.messages.length} messages</p>
                    </div>
                  </div>

                  {/* Messages body */}
                  <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-gradient-to-b from-gray-100/80 to-gray-200/60 dark:from-gray-900 dark:to-gray-950">
                    {activeConv.messages.map((msg) => {
                      if (msg.sender === "learner") {
                        // learner (right aligned)
                        return (
                          <div key={msg.id} className="flex justify-end">
                            <div className="max-w-xl flex flex-col items-end">
                              <div className="rounded-2xl rounded-br-sm px-4 py-3 text-sm text-white shadow-sm" style={primaryBg}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                              </div>
                              <span className="mt-1 text-[10px] text-gray-400 dark:text-gray-300">{new Date(msg.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                        );
                      }

                      // admin (left aligned)
                      return (
                        <div key={msg.id} className="flex items-start gap-2 max-w-xl">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0 overflow-hidden" style={primaryBg}>
                            A
                          </div>
                          <div className="flex flex-col">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                              <p className="text-xs text-gray-500 mb-1">Support</p>
                              <p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            <span className="mt-1 text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input area - learner can send messages */}
                  <div className="px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <textarea
                        rows={1}
                        className="flex-1 resize-none rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#72a210] focus:border-transparent outline-none"
                        placeholder="Type your message to support..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        disabled={isSubmitting}
                      />
                      <button
                        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        style={primaryBg}
                        onClick={handleSend}
                        disabled={!replyText.trim() || isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center px-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-1 ${textDark}`}>Select a conversation</h3>
                    <p className={`${textMedium} text-sm`}>Choose a conversation on the left to view details and message support.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Mobile nav — hidden when chat open */}
        <div className={isChatOpenOnMobile ? "hidden lg:block" : "block"}>
          <Nav />
        </div>
      </div>
    </div>
  );
};

export default LearnerPage;
