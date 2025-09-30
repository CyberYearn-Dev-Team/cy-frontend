"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb";
import { toast } from "sonner";




interface Question {
  question_text: string;
  options: string[];
  answer: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  passing_score: number;
}

export default function QuizzesPage() {
const router = useRouter(); 
  const { slug, moduleSlug, lessonSlug, labSlug } = useParams<{
    slug: string;
    moduleSlug: string;
    lessonSlug: string;
    labSlug: string;   // ✅ add this
  }>();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await fetch(
          `/api/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonSlug}/labs/${labSlug}/quizzes`
        );
        const data = await res.json();
        console.log("Quizzes API raw:", JSON.stringify(data, null, 2));

        // Helper to normalize options into string[] regardless of incoming shape
        const normalizeOptions = (opts: any): string[] => {
          if (!opts) return [];
          // already array
          if (Array.isArray(opts))
            return opts.map((o) =>
              typeof o === "string" ? o : o?.text ?? o?.label ?? String(o)
            );
          // string that might contain JSON
          if (typeof opts === "string") {
            try {
              const parsed = JSON.parse(opts);
              if (Array.isArray(parsed))
                return parsed.map((p) =>
                  typeof p === "string" ? p : p?.text ?? p?.label ?? String(p)
                );
              return [String(parsed)];
            } catch {
              return [opts];
            }
          }
          // object - try common shapes
          if (typeof opts === "object") {
            const toOptionString = (v: any) => {
              if (v == null) return "";
              if (typeof v === "string") return v;
              if (typeof v === "number" || typeof v === "boolean")
                return String(v);
              // v is an object/array — try common fields
              if (typeof v === "object")
                return v.text ?? v.label ?? v.name ?? JSON.stringify(v);
              return String(v);
            };

            // if it has a `data` array (Directus nested relation), map that
            if (Array.isArray((opts as any).data))
              return (opts as any).data.map((p: any) => toOptionString(p));
            // otherwise use values
            return Object.values(opts).map((v) => toOptionString(v));
          }
          return [String(opts)];
        };

        const mapped: Quiz[] = (data.quizzes || []).map(
  (q: any, idx: number) => ({
    id: idx + 1,
    title: q.title ?? "Untitled Quiz",
    description: q.description ?? "",
    questions: [
      {
        question_text: q.question_text ?? "",
        options: Array.isArray(q.options)
          ? q.options
          : typeof q.options === "string"
          ? JSON.parse(q.options)
          : [],
        answer: q.answer ?? "",
      },
    ],
    passing_score: q.passing_score ?? 0,
  })
);


        setQuizzes(mapped);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, [slug, moduleSlug, lessonSlug]);

  const currentQuiz = quizzes[currentQuizIndex];
  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];

  const handleSelect = (
    quizId: number,
    questionIdx: number,
    option: string
  ) => {
    const key = `${quizId}-${questionIdx}`;
    setAnswers((prev) => ({ ...prev, [key]: option }));
  };

const handleSubmit = () => {
  setSubmitted(true);

  // Flatten all questions across quizzes
  const allQuestions = quizzes.flatMap((quiz) =>
    quiz.questions.map((q, idx) => ({
      quizId: quiz.id,
      question: q.question_text,
      options: q.options,
      answer: q.answer,
      selected: answers[`${quiz.id}-${idx}`] || "",
    }))
  );

  // Count correct answers
  const correctCount = allQuestions.filter(
    (q) => q.selected === q.answer
  ).length;

  const totalQuestions = allQuestions.length;
  const score =
    totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

  // Passing score
  const passingScore = currentQuiz?.passing_score ?? 0;
  const passed = score >= passingScore;

  // Example XP calculation
  const xp = correctCount * 10;

  // ✅ Show toast with green (success) or red (error)
  if (passed) {
    toast.success("Congratulations, you passed the quiz!", {
      // description: `Score: ${score}% | Passing Score: ${passingScore}% | XP: ${xp}`,
    });
  } else {
    toast.error("Quiz attempt failed, try again", {
      // description: `Score: ${score}% | Passing Score: ${passingScore}%`,
    });
  }

  // Redirect with results
  router.push(
    `/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonSlug}/labs/${labSlug}/quizzes/result?score=${score}&passed=${passed}&xp=${xp}&results=${encodeURIComponent(
      JSON.stringify(allQuestions)
    )}`
  );
};





  const nextQuestion = () => {
    if (
      currentQuiz &&
      currentQuestionIndex < currentQuiz.questions.length - 1
    ) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentQuizIndex > 0) {
      const prevQuiz = quizzes[currentQuizIndex - 1];
      setCurrentQuizIndex((prev) => prev - 1);
      setCurrentQuestionIndex(prevQuiz.questions.length - 1);
    }
  };

  const totalQuestions = quizzes.reduce(
    (acc, quiz) => acc + quiz.questions.length,
    0
  );
  const currentFlatIndex =
    quizzes
      .slice(0, currentQuizIndex)
      .reduce((acc, quiz) => acc + quiz.questions.length, 0) +
    currentQuestionIndex +
    1;

  const progressPercent =
    totalQuestions > 0 ? (currentFlatIndex / totalQuestions) * 100 : 0;




  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6">

            {/* Breadcrumb */}      
            <Breadcrumb /> <br />


          {loading ? (
            <p className="text-gray-500">Loading quizzes...</p>
          ) : quizzes.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center mt-20 text-gray-500 space-y-4 px-4 sm:px-0">
              <FileText className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-[#72a210]" />
              <p className="text-xl sm:text-2xl font-semibold">
                Oops! No content available.
              </p>
              <p className="max-w-sm sm:max-w-md text-gray-400">
                It looks like the Quizze hasn’t been added yet. Please
                check back later.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Quiz Header */}
              <div className="border rounded-lg bg-white shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-bold text-gray-800">
                    {currentQuiz?.title}
                  </h1>
                  <span className="text-sm text-gray-500">
                    {currentFlatIndex} of {totalQuestions}
                  </span>
                </div>

                {currentQuiz?.description && (
                  <p className="text-gray-600 mb-4">
                    {currentQuiz.description}
                  </p>
                )}

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div
                    className="bg-[#72a210] h-2 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Current Question */}
                {currentQuestion && (
                  <div className="mb-6">
                    <p className="font-medium text-gray-800 mb-4">
                      {currentQuestion.question_text}
                    </p>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, idx) => {
                        const key = `${currentQuiz.id}-${currentQuestionIndex}`;
                        const selected = answers[key] === option;
                        const isCorrect = option === currentQuestion.answer;

                        return (
                          <button
                            key={idx}
                            onClick={() =>
                              handleSelect(
                                currentQuiz.id,
                                currentQuestionIndex,
                                option
                              )
                            }
                            className={`w-full text-left px-4 py-3 rounded-lg border transition cursor-pointer ${
                              selected
                                ? submitted
                                  ? isCorrect
                                    ? "bg-green-100 border-green-500"
                                    : "bg-red-100 border-red-500"
                                  : "bg-[#e6f2d4] border-[#72a210]"
                                : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                            }`}
                            disabled={submitted}>
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}



                {/* Navigation + Submit */}
<div className="flex justify-between items-center">
  <button
  onClick={prevQuestion}
  disabled={currentFlatIndex === 1}
  className="text-base px-5 py-2 rounded-lg 
             bg-[#72a210] text-white hover:bg-[#5c880d] cursor-pointer
             disabled:bg-[#ccc] disabled:text-gray-600 disabled:cursor-not-allowed">
  Previous
</button>


  {currentFlatIndex === totalQuestions && !submitted ? (
    <button
      onClick={handleSubmit}
      className="text-base px-5 py-2 rounded-lg bg-[#72a210] text-white hover:bg-[#5c880d] cursor-pointer">
      Submit Answers
    </button>
  ) : (
    <button
      onClick={nextQuestion}
      disabled={currentFlatIndex === totalQuestions}
       className="text-base px-5 py-2 rounded-lg bg-[#72a210] text-white hover:bg-[#5c880d] cursor-pointer">
      Next
    </button>
  )}
</div>

{/* 
                {submitted && (
                  <div className="mt-4 text-green-700 font-medium">
                    🎉 Quiz submitted! Passing Score:{" "}
                    {currentQuiz?.passing_score}%
                  </div>
                )} */}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
