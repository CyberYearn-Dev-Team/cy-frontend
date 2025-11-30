import { getCurrentUser } from "../api/auth";

export interface ContinueLearningItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  progress: number;
  instructor: string;
  instructorTitle: string;
}

export const getContinueLearning = async (): Promise<ContinueLearningItem[]> => {
  try {
    const res = await fetch(
      "https://cy-backend.onrender.com/api/v1/me/progress/summary",
      {
        credentials: "include",   // <-- sends token cookie
      }
    );

    if (!res.ok) {
      console.error("Progress API failed:", res.status);
      return [];
    }

    const data = await res.json();
    const trackProgress = data?.data?.trackProgress || [];

    return trackProgress
      .filter((t: any) => t.status === "IN_PROGRESS")
      .map((track: any, index: number) => ({
        id: track.id || track.trackId || `track-${index}`,
        title: track.title || "Untitled Track",
        description: track.description || "",
        thumbnail: track.thumbnail || "/api/placeholder/280/160",
        progress: track.progress || 0,
        instructor: track.instructor || "Instructor Name",
        instructorTitle: track.instructorTitle || "Title",
      }));
  } catch (err) {
    console.error("Error fetching continue learning:", err);
    return [];
  }
};

