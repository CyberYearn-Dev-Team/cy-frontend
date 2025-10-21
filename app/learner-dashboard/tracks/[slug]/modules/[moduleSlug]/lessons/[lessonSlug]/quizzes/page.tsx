"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import Nav from "@/components/ui/learner-nav";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { toast } from "sonner";

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#5c880d";
const primaryLighter = "#e6f2d4";
const bgLight = "bg-gray-100 dark:bg-gray-950";
const cardBg = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-300";
const textLight = "text-gray-500 dark:text-gray-400";
const borderLight = "border dark:border-gray-700";

// --- CHANGE START ---
// Added 'hint' to the Question interface
interface Question {
  question_text: string;
  options: string[];
  answer: string;
  hint: string; // Add hint property
}
// --- CHANGE END ---

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
    labSlug: string;
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
          `/api/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonSlug}/quizzes`
        );
        if (!res.ok) {
          // ... (error handling remains the same)
          return;
        }
        const data = await res.json();
        
        // ... (normalizeOptions function remains the same)
        const normalizeOptions = (opts: any): string[] => {
            if (!opts) return [];
            if (Array.isArray(opts)) return opts.map((o) => typeof o === "string" ? o : o?.text ?? o?.label ?? String(o));
            if (typeof opts === "string") {
              try {
                const parsed = JSON.parse(opts);
                if (Array.isArray(parsed)) return parsed.map((p) => typeof p === "string" ? p : p?.text ?? p?.label ?? String(p));
                return [String(parsed)];
              } catch { return [opts]; }
            }
            if (typeof opts === "object") {
              const toOptionString = (v: any) => {
                if (v == null) return "";
                if (typeof v === "string") return v;
                if (typeof v === "number" || typeof v === "boolean") return String(v);
                if (typeof v === "object") return v.text ?? v.label ?? v.name ?? JSON.stringify(v);
                return String(v);
              };
              if (Array.isArray((opts as any).data)) return (opts as any).data.map((p: any) => toOptionString(p));
              return Object.values(opts).map((v) => toOptionString(v));
            }
            return [String(opts)];
        };

        const mapped: Quiz[] = (data.quizzes || []).map((q: any, idx: number) => ({
          id: idx + 1,
          title: q.title ?? "Untitled Quiz",
          description: q.description ?? "",
          questions: Array.isArray(q.questions)
            ? q.questions.map((qq: any) => ({
                question_text: qq?.question_text ?? "",
                options: normalizeOptions(qq?.options),
                answer: qq?.answer ?? "",
                // --- CHANGE START ---
                // Fetch the hint from your API response
                hint: qq?.hint ?? "No hint available for this question.",
                // --- CHANGE END ---
              }))
            : [],
          passing_score: q.passing_score ?? 0,
        }));

        setQuizzes(mapped);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, [slug, moduleSlug, lessonSlug, labSlug]);

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

    const allQuestions = quizzes.flatMap((quiz) =>
      quiz.questions.map((q, idx) => ({
        quizId: quiz.id,
        question: q.question_text,
        options: q.options,
        answer: q.answer,
        selected: answers[`${quiz.id}-${idx}`] || "",
        // --- CHANGE START ---
        // Pass the hint along to the results page
        hint: q.hint,
        // --- CHANGE END ---
      }))
    );
    
    // ... (rest of the handleSubmit function remains the same)
    const correctCount = allQuestions.filter(q => q.selected === q.answer).length;
    const totalQuestions = allQuestions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passingScore = currentQuiz?.passing_score ?? 0;
    const passed = score >= passingScore;
    const xp = correctCount * 10;
    
    if (score === 100) {
      toast.success("Perfect score! You aced the quiz!");
    } else if (passed && score < 100) {
      toast.warning("Good job! You passed, but there’s room for improvement.");
    } else {
      toast.error("Quiz attempt failed, try again.");
    }
    
    router.push(
      `/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonSlug}/quizzes/result?score=${score}&passed=${passed}&xp=${xp}&results=${encodeURIComponent(
        JSON.stringify(allQuestions)
      )}`
    );
  };
    
  // ... (the rest of the component, including nextQuestion, prevQuestion, and all JSX, remains exactly the same)
  const nextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
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

  const totalQuestions = quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0);
  const currentFlatIndex = quizzes.slice(0, currentQuizIndex).reduce((acc, quiz) => acc + quiz.questions.length, 0) + currentQuestionIndex + 1;
  const progressPercent = totalQuestions > 0 ? (currentFlatIndex / totalQuestions) * 100 : 0;
  
  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-30">
        <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/learner-dashboard/tracks">Learning Tracks</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href={`/learner-dashboard/tracks/${slug}`}>Track</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}`}>Module</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href={`/learner-dashboard/tracks/${slug}/modules/${moduleSlug}/lessons/${lessonSlug}`}>Lesson</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Quizzes</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <br />
          {loading ? (
            <p className={textLight}>Loading quizzes...</p>
          ) : quizzes.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center mt-20 space-y-4 px-4 sm:px-0">
              <FileText className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto text-[${primary}]`} />
              <p className={`text-xl sm:text-2xl font-semibold ${textDark}`}>
                Oops! No content available.
              </p>
              <p className="max-w-sm sm:max-w-md text-gray-400">
                It looks like the Quizze hasn’t been added yet. Please check back later.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className={`${borderLight} rounded-lg ${cardBg} shadow p-6`}>
                <span className={`text-sm ${textLight} flex justify-end items-center`}>
                  {currentFlatIndex} of {totalQuestions}
                </span>
                <div className="flex justify-between items-center mb-5">
                  <h1 className={`text-xl font-bold ${textDark}`}>
                    {currentQuiz?.title}
                  </h1>
                </div>
                {currentQuiz?.description && (
                  <p className={`${textMedium} mb-4`}>
                    {currentQuiz.description}
                  </p>
                )}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
                  <div
                    className={`bg-[${primary}] h-2 rounded-full`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {currentQuestion && (
                  <div className="mb-6">
                    <p className={`font-medium ${textDark} mb-4`}>
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
                            className={`w-full text-left px-4 py-3 rounded-lg border transition cursor-pointer 
                            ${textDark} ${borderLight}
                            ${
                              selected
                                ? `bg-[${primaryLighter}] border-[${primary}] dark:bg-gray-700 dark:border-[${primary}]`
                                : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700"
                            }`}
                            disabled={submitted}>
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <button
                    onClick={prevQuestion}
                    disabled={currentFlatIndex === 1}
                    className={`text-base px-5 py-2 rounded-lg 
                      bg-[${primary}] text-white hover:bg-[${primaryDarker}] cursor-pointer
                      disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-600 dark:disabled:text-gray-400 disabled:cursor-not-allowed`}
                  >
                    Previous
                  </button>
                  {currentFlatIndex === totalQuestions && !submitted ? (
                    <button
                      onClick={handleSubmit}
                      className={`text-base px-5 py-2 rounded-lg bg-[${primary}] text-white hover:bg-[${primaryDarker}] cursor-pointer`}
                    >
                      Submit Answers
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      disabled={currentFlatIndex === totalQuestions}
                      className={`text-base px-5 py-2 rounded-lg 
                        bg-[${primary}] text-white hover:bg-[${primaryDarker}] cursor-pointer
                        disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-600 dark:disabled:text-gray-400 disabled:cursor-not-allowed`}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
        <Nav />
      </div>
    </div>
  );
}