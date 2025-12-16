import { getCurrentUser } from "../api/auth";
import { progressService } from '../api/progress';

export interface ContinueLearningItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  progress: number;
  instructor: string;
  instructorTitle: string;
  slug: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://cy-backend.onrender.com/api/v1";

async function fetchCanonicalTrackSlug(trackId: string): Promise<string | null> {
  try {
    // This is a placeholder - replace with actual API call to get track by ID
    const response = await fetch(`${API_BASE}/tracks/${trackId}`);
    
    if (!response.ok) {
      console.error(`Failed to fetch track ${trackId}:`, response.status);
      return null;
    }
    
    const data = await response.json();
    return data?.data?.slug || null;
  } catch (error) {
    console.error(`Error fetching track ${trackId}:`, error);
    return null;
  }
}

function safeSlugFromTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const getContinueLearning = async (): Promise<ContinueLearningItem[]> => {
  try {
    const response = await progressService.getProgressSummary();
    const data = response.data;
    const trackProgress = data?.data?.trackProgress || [];

    // Debug: Log the raw response to see what we're working with
    console.log("Raw progress data:", data);

    const results: ContinueLearningItem[] = [];

    for (let i = 0; i < trackProgress.length; i++) {
      const track = trackProgress[i];
      
      // Debug: Log each track's status and progress
      console.log(`Track ${i}:`, {
        id: track.id || track.trackId,
        title: track.title,
        status: track.status,
        progress: track.progress,
        hasSlug: Boolean(track.slug || track.track?.slug)
      });

      // Check if track is in progress based on status
      const isInProgress = track.status === "IN_PROGRESS";

      if (!isInProgress) continue;

      // Get slug from various possible locations
      const slug = 
        track.slug || 
        track.track?.slug || 
        track.track?.data?.slug || 
        track.track?.data?.attributes?.slug || 
        track.track?.fields?.slug || 
        (track.title ? safeSlugFromTitle(track.title) : null);

      // Skip if we can't get a valid slug
      if (!slug) {
        console.warn("Skipping track - no slug and no title:", track);
        continue;
      }

      // Only push valid ContinueLearningItem objects
      const continueLearningItem: ContinueLearningItem = {
        id: track.id || track.trackId || `track-${i}`,
        slug,
        title: track.title || "Untitled Track",
        description: track.description || "",
        thumbnail: track.thumbnail || track.track?.thumbnail || "/api/placeholder/280/160",
        progress: Math.min(100, Math.max(0, track.progress || 0)), // Ensure progress is between 0-100
        instructor: track.instructor || track.track?.instructor || "Instructor Name",
        instructorTitle: track.instructorTitle || track.track?.instructorTitle || "Title",
      };
      
      results.push(continueLearningItem);
    }

    console.log(`Found ${results.length} in-progress tracks`);
    return results;
  } catch (err) {
    console.error("Error in getContinueLearning:", err);
    return [];
  }
};
