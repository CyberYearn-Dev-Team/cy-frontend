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
  HelpCircle,
  Lightbulb,
} from "lucide-react";
// --- CHANGE START ---
// 1. Import the Breadcrumb components
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// --- CHANGE END ---
import Sidebar from "@/components/learner-sidebar";
import Header from "@/components/learner-header";
import Nav from "@/components/learner-nav";
import confetti from "canvas-confetti";

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#5c880d";
const bgLight = "bg-gray-100 dark:bg-gray-950";
const cardBg = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-300";

export default function QuizResultsPage() {
  const { slug, moduleSlug, lessonId } = useParams<{
    slug: string;
    moduleSlug: string;
    lessonId: string;
  }>();

  const router = useRouter();
  const searchParams = useSearchParams();

  const score = Number(searchParams.get("score") || 0);
  const xp = Number(searchParams.get("xp") || 0);
  const threshold = Number(searchParams.get("threshold") || 100);

  const resultsParam = searchParams.get("results");
  const results: {
    question: string;
    options: string[];
    answer: string;
    selected: string;
    hint?: string;
  }[] = resultsParam ? JSON.parse(resultsParam) : [];

  const passed = score >= threshold;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Confetti logic...
    if (passed) {
        const duration = 3 * 1000;
        const end = Date.now() + duration;
        (function frame() {
            confetti({ particleCount: 10, startVelocity: 30, spread: 360, ticks: 60, origin: { x: Math.random(), y: Math.random() - 0.2 } });
            if (Date.now() < end) { requestAnimationFrame(frame); }
        })();
    }
  }, [passed]);

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-30">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* --- CHANGE START --- */}
            {/* 2. Add the Breadcrumb component JSX */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/learner-dashboard/tracks">
                    Learning Tracks
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/learner-dashboard/tracks/${slug}`}>
                    Track
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}`}
                  >
                    Module
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonId}`}
                  >
                    Lesson
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonId}/quizzes`}
                  >
                    Quizzes
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Result</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            {/* --- CHANGE END --- */}

            <div className="flex flex-col items-center justify-center min-h-screen gap-8">
              {/* Result Card */}
              <div className="w-full lg:w-2/5 lg:top-8">
  <Card
    className={`${cardBg} shadow-lg border border-gray-200 dark:border-gray-800`}
  >
    <CardHeader className="text-center">
      <div className="mb-4">
        {passed ? (
          <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400 mx-auto" />
        ) : (
          <XCircle className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto" />
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

    <CardContent className="space-y-6 text-center">
      <div className="space-y-2">
        <div
          className={`text-4xl font-bold ${
            passed
              ? "text-green-500 dark:text-green-400"
              : `text-[${primary}] dark:text-[${primaryDarker}]`
          }`}
        >
          {score}%
        </div>

        <div className={textMedium}>
          Pass threshold: {threshold}%
        </div>

        <Badge
          className={
            passed
              ? "bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white text-sm py-1 px-3"
              : "bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm py-1 px-3"
          }
        >
          {passed ? `Passed • +${xp} XP Earned` : "Not Passed"}
        </Badge>
      </div>

      <div className="flex sm:flex-row gap-4 justify-center pt-4">
        <Button
          variant="outline"
          className={`w-full text-base py-5 sm:py-5 sm:w-auto flex-1 cursor-pointer border-gray-300 dark:border-gray-700 ${cardBg} ${textDark} hover:bg-gray-100 dark:hover:bg-gray-800`}
          onClick={() =>
            router.push(
              `/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonId}/quizzes`
            )
          }
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Retake Quiz
        </Button>

        {passed && (
          <Button
            className={`w-full text-base py-5 sm:py-5 sm:w-auto flex-1 cursor-pointer bg-white text-black dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}
            onClick={() =>
              router.push(
                `/learner-dashboard/tracks/${slug}/modules/${moduleSlug}`
              )
            }
          >
            Continue <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
</div>


              {/* Question Review Section */}
              <div className="w-full lg:w-4/5 space-y-6">
                {/* ... (rest of the component remains the same) ... */}
                <h2 className={`text-2xl font-bold ${textDark}`}>
                  Question Review
                </h2>
                {results.map((r, idx) => {
                  const isCorrect = r.selected === r.answer;
                  return (
                    <Card
                      key={idx}
                      className={`${cardBg} shadow-md dark:shadow-lg`}
                    >
                      <CardContent className="p-6">
                        <h3
                          className={`font-semibold mb-4 flex items-start ${textDark}`}
                        >
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
                          )}
                          <span>
                            Question {idx + 1}: {r.question}
                          </span>
                        </h3>
                        <div className="space-y-2">
                          {r.options.map((opt, i) => {
                            const isSelected = opt === r.selected;
                            const isAnswer = opt === r.answer;
                            let optionClass =
                              "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700";
                            if (isCorrect && isAnswer) {
                              optionClass =
                                "bg-green-100 dark:bg-green-900/50 border-green-500 dark:border-green-700";
                            } else if (!isCorrect && isSelected) {
                              optionClass =
                                "bg-red-100 dark:bg-red-900/50 border-red-500 dark:border-red-700";
                            }
                            return (
                              <div
                                key={i}
                                className={`px-3 py-3 rounded-lg border text-sm sm:text-base lg:text-lg cursor-pointer ${textDark} ${optionClass}`}
                              >
                                {" "}
                                {opt}{" "}
                              </div>
                            );
                          })}
                        </div>
                        {!isCorrect && (
  <div className="mt-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-700 flex items-start">
    <Lightbulb className="h-5 w-5 mr-3 mt-0.5 text-yellow-500 flex-shrink-0" />
    <div>
      <h4 className="font-semibold text-sm text-yellow-800 dark:text-yellow-200">
        Hint
      </h4>
      <p className="text-sm text-yellow-700 dark:text-yellow-300">
        {r.hint && r.hint.trim().length > 0 ? r.hint : "No hint provided for this question."}
      </p>
    </div>
  </div>
)}

                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
        <Nav />
      </div>
    </div>
  );
}