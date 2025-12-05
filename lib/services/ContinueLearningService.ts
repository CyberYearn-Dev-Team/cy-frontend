import { getCurrentUser } from "../api/auth";

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
    if (!trackId) return null;
    const res = await fetch(`${API_BASE}/tracks/${trackId}`, {
      credentials: "include",
    });
    if (!res.ok) {
      console.warn(`Failed to fetch track ${trackId}: ${res.status}`);
      return null;
    }
    const json = await res.json();
    // Try common locations for slug on the returned track object:
    return json?.data?.slug || json?.slug || json?.data?.attributes?.slug || null;
  } catch (err) {
    console.error("Error fetching canonical track slug:", err);
    return null;
  }
}

function safeSlugFromTitle(title: string) {
  return (title || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}



export const getContinueLearning = async (): Promise<ContinueLearningItem[]> => {
  try {
    const res = await fetch(`${API_BASE}/me/progress/summary`, {
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Progress API failed:", res.status);
      return [];
    }

    const data = await res.json();
    const trackProgress = data?.data?.trackProgress || [];

    // Map sequentially but resolve missing slugs by fetching the canonical track resource.
    const results: Array<ContinueLearningItem | null> = [];

    for (let i = 0; i < trackProgress.length; i++) {
      const track = trackProgress[i];
      if (track.status !== "IN_PROGRESS") continue;

      // Possible slug locations (be exhaustive)
      let slug =
        track.slug ||
        track.track?.slug ||
        track.track?.data?.slug ||
        track.track?.data?.attributes?.slug ||
        track.track?.fields?.slug ||
        null;

      // If slug looks like a generated title-slug (e.g. contains the whole title),
      // prefer canonical slug by fetching the track resource (defensive).
      if (!slug) {
        // try fetching canonical by trackId
        const candidateId = track.trackId || track.id || track.track?.id;
        const canonical = await fetchCanonicalTrackSlug(candidateId);
        if (canonical) slug = canonical;
      }

      // Final fallback: safe slugified title (last resort)
      if (!slug && track.title) {
        console.warn("Falling back to slugified title for track:", track.title, track);
        slug = safeSlugFromTitle(track.title);
      }

      if (!slug) {
        // Skip items we truly can't build a reliable URL for
        console.warn("Skipping continue-learning entry: no slug and no title", track);
        results.push(null);
        continue;
      }

      results.push({
        id: track.id || track.trackId || `track-${i}`,
        slug,
        title: track.title || "Untitled Track",
        description: track.description || "",
        thumbnail: track.thumbnail || "/api/placeholder/280/160",
        progress: typeof track.progress === "number" ? track.progress : 0,
        instructor: track.instructor || "Instructor Name",
        instructorTitle: track.instructorTitle || "Title",
      });
    }

    // Filter nulls and return
    return results.filter(Boolean) as ContinueLearningItem[];
  } catch (err) {
    console.error("Error fetching continue learning:", err);
    return [];
  }
};
