"use client";

import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  BookOpen,
  FlaskConical,
  Trophy,
  Users,
  ArrowRight,
} from "lucide-react";
// Theme Constants
const primary = "#72a210";
const primaryDarker = "#5c880d";
const bgLight = "bg-white dark:bg-gray-950"; 
const cardBg = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100"; 
const textMedium = "text-gray-600 dark:text-gray-300"; 
const borderLight = "border-gray-200 dark:border-gray-800"; 

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Applied dark mode background
    <div className={`min-h-screen ${bgLight}`}>
      {/* inporting header component */}
      <Header />

      {/*My Hero Section */}
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="text-center mb-20">
          <h1
            className={`text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${textDark} leading-tight`}
          >
            Master <span className={`text-[${primary}]`}>Cybersecurity</span>
            <br />
            Through Hands-On Learning
          </h1>

          <p
            className={`text-lg ${textMedium} mb-10 max-w-3xl mx-auto leading-relaxed`}
          >
            Learn cybersecurity concepts, practice with real-world scenarios, and
            build your skills in a safe, controlled environment designed
            exclusively for education.
          </p>
          <div className="flex sm:flex-row gap-4 justify-center w-full">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                // Applied theme colors to primary button
                className={`w-full sm:w-auto bg-[${primary}] hover:bg-[${primaryDarker}] text-white px-8 py-6 text-[15px] sm:text-lg font-medium cursor-pointer`}
              >
                Start Learning
              </Button>
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                // Applied theme colors to outline button
                className={`w-full sm:w-auto border-[${primary}] text-${textDark} hover:bg-[${primary}]/10 dark:hover:bg-[${primary}]/[0.05] px-8 py-6 text-[15px] sm:text-lg font-medium cursor-pointer`}
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/*My Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card
            className={`${cardBg} ${borderLight} hover:shadow-xl transition-shadow duration-200 cursor-pointer text-center`}
          >
            <CardHeader className="pb-4">
              <div className="flex justify-start sm:justify-center mb-4">
                <div className={`w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center`}>
                  <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <CardTitle className={`text-xl font-semibold ${textDark}`}>
                Interactive Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription
                className={`${textMedium} leading-relaxed text-base sm:text-lg lg:text-[1.1rem]`}
              >
                Structured learning paths covering cybersecurity fundamentals to
                advanced topics
              </CardDescription>
            </CardContent>
          </Card>

          <Card
            className={`${cardBg} ${borderLight} hover:shadow-xl transition-shadow duration-200 cursor-pointer text-center`}
          >
            <CardHeader className="pb-4">
              <div className="flex justify-start sm:justify-center mb-4">
                <div className={`w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center`}>
                  <FlaskConical className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <CardTitle className={`text-xl font-semibold ${textDark}`}>
                Hands-On Labs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription
                className={`${textMedium} leading-relaxed text-base sm:text-lg lg:text-[1.1rem]`}
              >
                Practice with real tools and techniques in your own secure
                virtual environment
              </CardDescription>
            </CardContent>
          </Card>

          <Card
            className={`${cardBg} ${borderLight} hover:shadow-xl transition-shadow duration-200 col-span-1 lg:col-span-1 cursor-pointer text-center`}
          >
            <CardHeader className="pb-4">
              <div className="flex justify-start sm:justify-center mb-4">
                <div className={`w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center`}>
                  <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <CardTitle className={`text-xl font-semibold ${textDark}`}>
                Gamified Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription
                className={`${textMedium} leading-relaxed text-base sm:text-lg lg:text-[1.1rem]`}
              >
                Earn XP, unlock achievements, and maintain learning streaks as
                you progress
              </CardDescription>
            </CardContent>
          </Card>

          <Card
            className={`${cardBg} ${borderLight} hover:shadow-xl transition-shadow duration-200 cursor-pointer text-center`}
          >
            <CardHeader className="pb-4">
              <div className="flex justify-start sm:justify-center mb-4">
                <div className={`w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center`}>
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <CardTitle className={`text-xl font-semibold ${textDark}`}>
                Expert Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription
                className={`${textMedium} leading-relaxed text-base sm:text-lg lg:text-[1.1rem]`}
              >
                Learn from industry experts and connect with fellow
                cybersecurity enthusiasts
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/*My Educational Disclaimer */}
        <div className={`w-full bg-yellow-50 dark:bg-yellow-950 border-[#e2de5a] dark:border-yellow-800 mt-16 rounded-2xl`}>
          <Card className="w-full border-0 bg-transparent shadow-none">
            <CardHeader className="pb-0">
              <CardTitle
                className={`flex items-center gap-3 text-yellow-800 dark:text-yellow-300 text-lg font-semibold`}
              >
                Educational Use Only
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-yellow-700 dark:text-yellow-400 leading-relaxed max-w-5xl`}>
                CyberLearn is designed exclusively for educational purposes. All
                content, tools, and exercises are provided in a controlled
                environment to help learners understand cybersecurity concepts
                safely and responsibly. Any misuse of the knowledge gained here
                is strictly prohibited.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* inporting footer drom component */}
      <Footer />
    </div>
  );
}