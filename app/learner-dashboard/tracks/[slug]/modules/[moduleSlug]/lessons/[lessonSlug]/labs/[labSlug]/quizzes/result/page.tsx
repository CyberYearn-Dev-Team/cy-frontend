"use client";
import { useState } from "react";
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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
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
        <CheckCircle className="h-16 w-16 text-[#72a210] mx-auto" />
      ) : (
        <XCircle className="h-16 w-16 text-red-500 mx-auto" />
      )}
    </div>
    <CardTitle className="text-2xl font-bold">
      {passed ? "Congratulations!" : "Quiz Complete"}
    </CardTitle>
    <CardDescription>
      You scored <span className="font-semibold">{score}%</span>{" "}
      {passed
        ? "and passed this quiz!"
        : "and did not reach the passing score."}
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-6 text-center p-0">
    {/* Score Summary */}
    <div className="space-y-2">
      <div className="text-3xl font-bold text-[#72a210]">{score}%</div>
      <div className="text-gray-600">Pass threshold: {threshold}%</div>
      <Badge variant={passed ? "default" : "destructive"}>
        {passed ? `Passed • +${xp} XP Earned` : "Not Passed"}
      </Badge>
    </div>



{/* Question Review Section */}
            <div className="space-y-6">
              {results.map((r, idx) => {
                const isCorrect = r.selected === r.answer;
                return (
                  <Card key={idx} className="shadow">
                    <CardContent className="p-6">
                      <h3
                        className={`font-semibold mb-4 flex items-center ${
                          isCorrect ? "text-green-700" : "text-red-700"
                        }`}>
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 mr-2 text-red-600" />
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
                              className={`px-3 py-2 rounded-lg border ${
                                correct
                                  ? "bg-green-100 border-green-500"
                                  : selected && !correct
                                  ? "bg-red-100 border-red-500"
                                  : "bg-gray-50 border-gray-300"
                              }`}>
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
    className="w-full text-base px-5 py-5 sm:w-1/2 cursor-pointer"
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
      className="w-full text-base px-5 py-5 sm:w-1/2 cursor-pointer bg-[#72a210] hover:bg-[#5c880d]"
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
