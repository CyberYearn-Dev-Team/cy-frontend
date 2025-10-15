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
} from "lucide-react";

// ✅ import your layout pieces
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import Nav from "@/components/ui/learner-nav";


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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-30">
          {/* --- MODIFICATION START: Increased max-width for flex layout --- */}
          <div className="max-w-6xl mx-auto space-y-8">

            {/* --- MODIFICATION START: New Flex Container for side-by-side layout --- */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-8">

             {/* --- ITEM 1: The Redesigned, "Cool" Result Card --- */}
<div className="w-full lg:w-2/5 lg:sticky lg:top-8">
  <Card
    className={
      passed
        ? `bg-gradient-to-br from-[${primary}] to-[${primaryDarker}] text-white shadow-lg`
        : `${cardBg} shadow-lg border border-gray-200 dark:border-gray-800`
    }
  >
    <CardHeader className="text-center">
      <div className="mb-4">
        {passed ? (
          <CheckCircle className="h-16 w-16 text-white mx-auto" />
        ) : (
          <XCircle className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto" />
        )}
      </div>

      <CardTitle
        className={`text-2xl font-bold ${
          passed ? "text-white" : `${textDark}`
        }`}
      >
        {passed ? "Congratulations!" : "Quiz Complete"}
      </CardTitle>

      <CardDescription
        className={
          passed
            ? "text-gray-100/90 dark:text-gray-200"
            : `${textMedium}`
        }
      >
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
            passed ? "text-white" : `text-[${primary}] dark:text-[${primaryDarker}]`
          }`}
        >
          {score}%
        </div>

        <div
          className={
            passed ? "text-gray-100/90 dark:text-gray-200" : `${textMedium}`
          }
        >
          Pass threshold: {threshold}%
        </div>

        <Badge
          className={
            passed
              ? `bg-white/20 text-white hover:bg-white/30 text-sm py-1 px-3`
              : "bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 text-sm py-1 px-3"
          }
        >
          {passed ? `Passed • +${xp} XP Earned` : "Not Passed"}
        </Badge>
      </div>

      {/* Action Buttons */}
<div className="flex  sm:flex-row gap-4 justify-center pt-4">
  <Button
    variant="outline"
    className={`w-full text-base py-5 sm:py-5 sm:w-auto flex-1 cursor-pointer
      ${
        passed
          ? `bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white`
          : `border-gray-300 dark:border-gray-700 ${cardBg} ${textDark} hover:bg-gray-100 dark:hover:bg-gray-800`
      }`}
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


              {/* --- ITEM 2: The Question Review Section --- */}
              <div className="w-full lg:w-3/5 space-y-6">
                <h2 className={`text-2xl font-bold ${textDark}`}>Question Review</h2>
                {results.length === 0 ? (
                  <Card className={`${cardBg}`}>
                    <CardContent className="p-6 text-center ${textMedium}">
                      <HelpCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p>There are no questions to review.</p>
                    </CardContent>
                  </Card>
                ) : (
                  results.map((r, idx) => {
                    const isCorrect = r.selected === r.answer;
                    return (
                      <Card key={idx} className={`${cardBg} shadow-md dark:shadow-lg`}>
                        <CardContent className="p-6">
                          <h3
                            className={`font-semibold mb-4 flex items-start ${textDark}`}
                          >
                            {isCorrect ? (
                              <CheckCircle className="h-7 w-7 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-5 w-5 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
                            )}
                            <span>Question {idx + 1}: {r.question}</span>
                          </h3>

                          <div className="space-y-2">
                            {r.options.map((opt, i) => {
                              const selected = opt === r.selected;
                              const correct = opt === r.answer;
                              return (
                                <div
                                  key={i}
                                  className={`px-3 py-2 rounded-lg border text-sm ${textDark} ${
                                    correct
                                      ? "bg-green-100 dark:bg-green-900/50 border-green-500 dark:border-green-700"
                                      : selected && !correct
                                      ? "bg-red-100 dark:bg-red-900/50 border-red-500 dark:border-red-700"
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
                  })
                )}
              </div>
              {/* --- MODIFICATION END --- */}
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <Nav />
      </div>
    </div>
  );
}