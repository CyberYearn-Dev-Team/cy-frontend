'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ComingSoonItem {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
}

// ⭐ Helper to trim description to first 9 words
function trimWords(text: string, limit: number) {
  const words = text.split(" ");
  if (words.length <= limit) return text;
  // Ensure we use '........' as requested in the initial query
  return words.slice(0, limit).join(" ") + "........"; 
}

export default function ComingSoonSection() {
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
    return <div className="p-4 text-red-500">{error}</div>;
  }

  //Empty state
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

  // ⭐ Coming Soon Cards
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
      {comingSoonItems.map((item) => (
        // The main card is the 'group' and is relative
        <motion.div
          key={item.id}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all relative" // <- Added relative here
        >
          {/* Thumbnail */}
          {item.thumbnail ? (
            <div className="relative h-30 w-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${item.thumbnail}`}
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
            <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
              {item.title}
            </h3>

            {/*Trimmed description (always visible unless the full text is shown) */}
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm group-hover:invisible">
              {trimWords(item.description, 9)}
            </p>

            {/*Full description pop-out (Tooltip) */}
            <div
              className="
                absolute left-0 right-0 bottom-0 top-0 z-20 
                hidden group-hover:block transition-opacity duration-300
                p-5 bg-white dark:bg-gray-800 
                backdrop-blur-sm
                rounded-b-xl
                border-t border-gray-200 dark:border-gray-600
                overflow-y-auto
              "
            >
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {item.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {item.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}