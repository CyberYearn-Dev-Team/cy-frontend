"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Phone, Mail, Send, Star } from "lucide-react";

// Mock data structure matching your review card requirements
interface ReviewItem {
  id: string;
  rating: number;
  subject: string;
  text: string;
  name: string;
  isAnonymous: boolean;
  date: string;
}

export default function PublicReviewsPage() {
  // Mock array matching your featured reviews schema
  const [featuredReviews] = useState<ReviewItem[]>([
    {
      id: "1",
      rating: 5,
      subject: "Exceptional Learning Platform!",
      text: "This platform completely changed how I approach coding. The modular structure made complex algorithms clear and highly actionable.",
      name: "Sarah Jenkins",
      isAnonymous: false,
      date: "May 12, 2026",
    },
    {
      id: "2",
      rating: 5,
      subject: "Exceeded All My Expectations",
      text: "The community support alongside the curated curriculum gave me everything I needed to land my junior developer role in under 6 months.",
      name: "Michael Chen",
      isAnonymous: false,
      date: "April 29, 2026",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Public Navigation Header */}
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-gray-100 mb-4">
            Learner Success & Reviews
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
            See how our dynamic dashboard ecosystem and curated tools help students achieve milestones globally.
          </p>
        </div>

        {/* Featured Reviews Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {featuredReviews.map((item) => (
            <div
              key={`featured-${item.id}`}
              className="p-6 rounded-xl border border-amber-200/60 dark:border-amber-950/40 bg-amber-50/30 dark:bg-amber-950/10 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Perfectly Visible Ribbon Badge without Clipping */}
              <div className="absolute top-0 right-0 transform translate-x-10 translate-y-3 rotate-45 bg-amber-500 text-[10px] uppercase tracking-widest text-white px-10 py-1 font-bold text-center w-[140px]">
                FEATURED
              </div>

              {/* Star Ratings */}
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              {/* Review Subject Title */}
              <h4 className="font-black text-base text-gray-900 dark:text-gray-100 mb-2 line-clamp-1 pr-12">
                {item.subject}
              </h4>

              {/* Review Body Text */}
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-4 leading-relaxed">
                &ldquo;{item.text}&rdquo;
              </p>

              {/* Review Metadata Meta Row */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-900 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                <span>— {item.isAnonymous ? "Anonymous" : item.name}</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Public Contact & Support Section Footer Callout */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[1.5rem] p-8 md:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
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
        </div>

      </main>

      {/* Public Footer */}
      <Footer />
    </div>
  );
}