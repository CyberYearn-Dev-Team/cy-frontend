"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronRight,
} from "lucide-react";

// ✅ import your layout pieces
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";

// ✅ import confetti
import confetti from "canvas-confetti";

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#5c880d";
const bgLight = "bg-gray-100 dark:bg-gray-950"; // Main page background
const cardBg = "bg-white dark:bg-gray-900"; // Card background
const textDark = "text-gray-900 dark:text-gray-100"; // Headings/Strong text
const textMedium = "text-gray-600 dark:text-gray-300"; // Body text
const textLight = "text-gray-500 dark:text-gray-400"; // Placeholder/Subtle text

export default function QuizResultsPage() {
  const { slug, moduleSlug, lessonSlug, labSlug } = useParams<{
    slug: string;
    moduleSlug: string;
    lessonSlug: string;
    labSlug: string;
  }>();

  const router = useRouter();
  const searchParams = useSearchParams();

  // Example: ?score=85&passed=true&xp=40&results=JSON_STRING&threshold=70
  const score = Number(searchParams.get("score") || 0);
  const xp = Number(searchParams.get("xp") || 0);
  const threshold = Number(searchParams.get("threshold") || 100);

  const resultsParam = searchParams.get("results");
  const results: {
    question: string;
    options: string[];
    answer: string;
    selected: string;
  }[] = resultsParam ? JSON.parse(resultsParam) : [];

  // ✅ derive passed dynamically
  const passed = score >= threshold;

  // sidebar toggle state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🎉 fire confetti continuously for 2–3 seconds if passed
  useEffect(() => {
    if (passed) {
      const duration = 3 * 1000; // 3 seconds
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 10,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2,
          },
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [passed]);

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Overall Result Card */}
            <Card className="!bg-transparent !border-none shadow-none">
              <CardHeader className="text-center p-0">
                <div className="mb-4">
                  {passed ? (
                    <CheckCircle className={`h-16 w-16 text-[${primary}] mx-auto`} />
                  ) : (
                    <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                  )}
                </div>
                <CardTitle className={`text-2xl font-bold ${textDark}`}>
                  {passed ? "Congratulations!" : "Quiz Complete"}
                </CardTitle>
                <CardDescription className={textMedium}>
                  You scored <span className="font-semibold">{score}%</span>{" "}
                  {passed
                    ? "and passed this quiz!"
                    : "and did not reach the passing score."}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 text-center p-0">
                <div className="space-y-2">
                  <div className={`text-3xl font-bold text-[${primary}]`}>
                    {score}%
                  </div>
                  <div className={textMedium}>
                    Pass threshold: {threshold}%
                  </div>
                  <Badge
                    className={
                      passed
                        ? `bg-[${primary}] hover:bg-[${primaryDarker}]`
                        : "bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
                    }
                  >
                    {passed ? `Passed • +${xp} XP Earned` : "Not Passed"}
                  </Badge>
                </div>

                {/* Question Review Section */}
                <div className="space-y-6">
                  {results.map((r, idx) => {
                    const isCorrect = r.selected === r.answer;
                    return (
                      <Card key={idx} className={`${cardBg} shadow dark:shadow-lg`}>
                        <CardContent className="p-6">
                          <h3
                            className={`font-semibold mb-4 flex items-center ${textDark} ${
                              isCorrect
                                ? "text-green-500 dark:text-green-400"
                                : "text-red-500 dark:text-red-400"
                            }`}
                          >
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 mr-2 text-red-500" />
                            )}
                            Question {idx + 1}: {r.question}
                          </h3>

                          <div className="space-y-2">
                            {r.options.map((opt, i) => {
                              const selected = opt === r.selected;
                              const correct = opt === r.answer;
                              return (
                                <div
                                  key={i}
                                  className={`px-3 py-2 rounded-lg border ${textDark} ${
                                    correct
                                      ? "bg-green-100 dark:bg-green-900 border-green-500 dark:border-green-700 text-green-700 dark:text-green-300"
                                      : selected && !correct
                                      ? "bg-red-100 dark:bg-red-900 border-red-500 dark:border-red-700 text-red-700 dark:text-red-300"
                                      : "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                                  }`}
                                >
                                  {opt}
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Action Buttons*/}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    variant="outline"
                    className={`w-full text-base px-5 py-5 sm:w-1/2 cursor-pointer 
                      border-gray-300 dark:border-gray-700 ${cardBg} ${textDark}
                      hover:bg-gray-100 dark:hover:bg-gray-800`}
                    onClick={() =>
                      router.push(
                        `/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonSlug}/labs/${labSlug}/quizzes`
                      )
                    }
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retake Quiz
                  </Button>

                  {passed && (
                    <Button
                      className={`w-full text-base px-5 py-5 sm:w-1/2 cursor-pointer bg-[${primary}] hover:bg-[${primaryDarker}]`}
                      onClick={() =>
                        router.push(
                          `/learner-dashboard/tracks/${slug}/modules/${moduleSlug}`
                        )
                      }
                    >
                      Continue to Next Lesson{" "}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
