// Server-side Directus helpers and content models
// Keep imports here so client bundles don’t depend on directus

export type Role = "admin" | "instructor" | "learner" | "guest"

// ---------------- Types ----------------
export interface Track {
  id: string
  title: string
  slug: string
  description?: string
  order?: number
}

export interface Module {
  id: string
  title: string
  slug: string
  track: string // Track.id
  order?: number
}

export type LessonType = "text" | "video" | "lab"

export interface Lesson {
  id: string
  title: string
  slug: string
  module: string // Module.id
  type: LessonType
  content?: unknown
  video_url?: string
  attachments?: { id: string; file: string; alt?: string }[]
}

export interface QuizQuestion {
  id: string
  type: "single" | "multi" | "boolean"
  prompt: string
  options: { id: string; text: string; correct?: boolean }[]
  explanation?: string
}

export interface Quiz {
  id: string
  lesson: string // Lesson.id
  questions: QuizQuestion[]
  allow_retakes: boolean
}

export interface LabGuide {
  id: string
  title: string
  description?: string
  difficulty?: string
  time?: string
  xp?: number
  resources?: { id: string; file: string; alt?: string }[]
}

export interface FeatureFlags {
  leaderboard_enabled: boolean
  metrics_public: boolean
}

export const defaultFeatureFlags: FeatureFlags = {
  leaderboard_enabled: false,
  metrics_public: false,
}



//Helpers 
async function makeClient() {
  const url = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || ""
  if (!url) return null

  const sdk = await import("@directus/sdk").catch(() => null)
  if (!sdk) return null

  const { createDirectus, staticToken, rest } = sdk
  const token = process.env.NEXT_PUBLIC_DIRECTUS_STATIC_TOKEN || process.env.DIRECTUS_STATIC_TOKEN
  const client = createDirectus(url).with(rest())
  if (token) client.with(staticToken(token))

  return client
}



// Fetch Tracks
export async function fetchTracks(): Promise<Track[]> {
  const client = await makeClient()
  if (!client) return []

  const { readItems } = await import("@directus/sdk")
  const response = await client.request(readItems("Tracks", {
    fields: ["id", "title", "slug", "description", "order"],
    sort: ["order"],
  }))
  return (response || []) as Track[]
}



// Fetch Modules by Track
export async function fetchModulesByTrack(trackId: string): Promise<Module[]> {
  const client = await makeClient()
  if (!client) return []

  const { readItems } = await import("@directus/sdk")
  const response = await client.request(readItems("Modules", {
    filter: { track: { _eq: trackId } },
    fields: ["id", "title", "slug", "track", "order"],
    sort: ["order"],
  }))
  return (response || []) as Module[]
}



// Fetch Lessons by Module
export async function fetchLessonsByModule(moduleId: string): Promise<Lesson[]> {
  const client = await makeClient()
  if (!client) return []

  const { readItems } = await import("@directus/sdk")
  const response = await client.request(readItems("Lessons", {
    filter: { module: { _eq: moduleId } },
    fields: [
      "id",
      "title",
      "slug",
      "module",
      "type",
      "content",
      "video_url",
      { attachments: ["id", "file", "alt"] },
    ],
    sort: ["id"],
  }))
  return (response || []) as Lesson[]
}



// Fetch Quizzes by Lesson
export async function fetchQuizzesByLesson(lessonId: string): Promise<Quiz[]> {
  const client = await makeClient()
  if (!client) return []

  const { readItems } = await import("@directus/sdk")
  const response = await client.request(readItems("Quizzes", {
    filter: { lesson: { _eq: lessonId } },
    fields: [
      "id",
      "lesson",
      "allow_retakes",
      { questions: ["id", "type", "prompt", { options: ["id", "text", "correct"] }, "explanation"] },
    ],
  }))
  return (response || []) as Quiz[]
}



// Fetch Lab Guides
export async function fetchLabGuides(): Promise<LabGuide[]> {
  const client = await makeClient()
  if (!client) return []

  const { readItems } = await import("@directus/sdk")
  const response = await client.request(readItems("lab_guides", {
    fields: ["id", "title", "description", "difficulty", "time", "xp", { resources: ["id", "file", "alt"] }],
    sort: ["id"],
  }))
  return (response || []) as LabGuide[]
}
