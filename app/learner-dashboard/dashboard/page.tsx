"use client"

import React from "react"
import useSWR from "swr"
import {
  BookOpen,
  FlaskConical,
  Trophy,
  Zap,
  Clock,
  Target,
  TrendingUp,
  Play,
} from "lucide-react"

import Sidebar from "@/components/ui/learner-sidebar"
import Header from "@/components/ui/learner-header"
import {
  fetchTracks,
  Track,
  fetchLessonsByModule,
} from "@/lib/directus"

//SWR fetcher is not needed here; using direct helper functions from lib/directus

// UI Helpers
const Progress = ({ value }: { value: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-[#72a210] h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
)

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
    {children}
  </span>
)

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-md border border-gray-200 ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-gray-200">{children}</div>
)

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
)

const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-gray-600 mt-1">{children}</p>
)

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
)

const Button = ({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors 
      bg-[#72a210] hover:bg-[#507800] text-white focus:outline-none focus:ring-2 focus:ring-[#72a210] focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </button>
)

// Dashboard
export default function LearnerDashboard() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  // Fetch learning tracks
  const { data: tracks, isLoading: tracksLoading } = useSWR<Track[]>(
    ["Tracks"],
    () => fetchTracks(),
    { revalidateOnFocus: false }
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Stats Section (static for now, later → fetch from learner progress table) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current XP</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                  <Zap className="h-8 w-8 text-[#72a210]" />
                </div>
                {/* <div className="mt-4 space-y-2">
                  <Progress value={80} />
                  <p className="text-xs text-gray-500">250 XP to level 6</p>
                </div> */}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Level</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                  <Trophy className="h-8 w-8 text-[#72a210]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Day Streak</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                  <Target className="h-8 w-8 text-[#507800]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">0%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-[#72a210]" />
                </div>
              </CardContent>
            </Card>
          </div>


          {/* Main sections */}
<div className="w-full">
  {/* Continue Learning */}
  <Card className="w-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <BookOpen className="h-5 w-5" /> Continue Learning
      </CardTitle>
      <CardDescription>
        Pick up where you left off in your learning tracks
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {tracksLoading && <p className="text-sm text-gray-500">Loading tracks...</p>}
      {!tracksLoading && tracks && tracks.length > 0 ? (
        tracks.map((track) => (
          <div key={track.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{track.title}</h3>
                <p className="text-sm text-gray-600">{track.description}</p>
              </div>
              <Badge>0 modules</Badge>
            </div>
            <div className="space-y-2">
              <Progress value={0} />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Not started</span>
                <Button className="px-3 py-1.5 text-xs flex items-center gap-1">
                  <Play className="h-4 w-4" /> Start
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">
          You haven’t started any track yet. Go to <strong>Learning Tracks</strong> to begin.
        </p>
      )}
    </CardContent>
  </Card>
</div>

        </main>
      </div>
    </div>
  )
}
