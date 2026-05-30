'use client';

import { useEffect, useState, useRef, forwardRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface ComingSoonItem {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
}

// ⭐ Updated helper to slice by exactly 20 characters/letters
function trimCharacters(text: string, limit: number) {
  if (text.length <= limit) return text;
  return text.substring(0, limit) + "........"; 
}

const ComingSoonSection = forwardRef<HTMLDivElement>((props, ref) => {
  const [comingSoonItems, setComingSoonItems] = useState<ComingSoonItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComingSoon = async () => {
      try {
        const response = await fetch('/api/coming-soon');
        if (!response.ok) throw new Error('Failed to fetch coming soon content');

        const data = await response.json();
        setComingSoonItems(data.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load coming soon content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComingSoon();
  }, []);

  // ⭐ Skeleton loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-[230px]"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500 dark:text-gray-400">
        <BookOpen className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
        <h4 className="font-semibold text-gray-900 dark:text-white">Failed to Load</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">Unable to load coming soon content. Please try again later.</p>
      </div>
    );
  }

  // Empty state
  if (comingSoonItems.length === 0) {
    return (
      <div className="flex flex-col items-center text-center p-10 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 mb-4">
          <svg
            className="w-10 h-10 text-blue-500 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          New Content Coming Soon
        </h3>

        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          We’re working on exciting new courses and features. Check back soon for updates!
        </p>
      </div>
    );
  }

  // Coming Soon Cards
  return (
    <div
      ref={ref}
      className="flex gap-4 overflow-x-auto overflow-y-hidden lg:overflow-x-hidden no-scrollbar py-2 px-1 sm:px-2 scroll-smooth snap-x snap-mandatory"
    >
      {comingSoonItems.map((item) => (
        <motion.div
          key={item.id}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="group min-w-[280px] max-w-[280px] flex-shrink-0 snap-start bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
        >
          {/* Thumbnail */}
          {item.thumbnail ? (
            <div className="relative h-30 w-full">
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                className="object-cover group-hover:brightness-110 transition-all"
              />
            </div>
          ) : (
            <div className="h-48 bg-gray-200 dark:bg-gray-800"></div>
          )}

          {/* Content Wrapper */}
          <div className="p-5">
            {/* Title - remains cleanly styled, color shift on hover stays active if desired */}
            <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
              {item.title}
            </h3>

            {/* Description - stays visible on hover now, limited to 20 letters */}
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              {trimCharacters(item.description, 30)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

ComingSoonSection.displayName = 'ComingSoonSection';

export default ComingSoonSection;