'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Award, Flame, Star } from 'lucide-react';
import { getCurrentUser } from '@/lib/api/auth';

interface Badge {
  id: string;
  code: string;
  name: string;
  description: string;
  unlocked: boolean;
  image?: string;
}

const badgeIcons: Record<string, React.ReactNode> = {
  'first_lesson': <Zap className="h-6 w-6" />,
  'streak_7': <Flame className="h-6 w-6" />,
  'course_complete': <Award className="h-6 w-6" />,
  'perfect_quiz': <Star className="h-6 w-6" />,
  'early_adopter': <Trophy className="h-6 w-6" />,
};

interface AchievementsSkeletonProps {
  className?: string;
}

export function AchievementsSkeleton({ className = '' }: AchievementsSkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 animate-pulse h-32 ${className}`}>
          <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

export default function AchievementsSection() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        
        // Get current user to ensure we're authenticated
        const currentUser = await getCurrentUser();
        if (!currentUser?.email) {
          throw new Error('User not authenticated');
        }

        // Fetch gamification data
        const response = await fetch('/api/gamification');
        if (!response.ok) {
          throw new Error('Failed to fetch achievements');
        }

        const data = await response.json();
        const unlockedBadges = data.data?.badges || [];
        
        // Transform the badges to include icons and additional metadata
        const formattedBadges = unlockedBadges.map((badge: any) => ({
          id: badge.id || badge.code,
          code: badge.code,
          name: badge.name || badge.code.split('_').map((word: string) => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          description: badge.description || `Earned for ${badge.code.split('_').join(' ')}`,
          unlocked: true,
        }));

        setBadges(formattedBadges);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching achievements:', err);
        setError(err.message || 'Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

if (loading) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800 animate-pulse"
        >
          <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 mb-2" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
          <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
}


  if (error) {
    return (
      <div className="text-center p-4 text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-4">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">Achievements</h3>
        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
          {badges.length} unlocked
        </span>
      </div>

      {badges.length === 0 ? (
        <div className="text-center p-6 text-gray-500 dark:text-gray-400">
          <Trophy className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
          <p>No achievements yet. Keep learning to earn badges!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className="flex flex-col items-center text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={badge.description}
            >
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-500 mb-2">
                  {badgeIcons[badge.code] || <Trophy className="h-6 w-6" />}
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
