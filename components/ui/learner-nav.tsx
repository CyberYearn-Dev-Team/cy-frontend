"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, BookOpen, BarChart3, User } from "lucide-react";

export default function UserNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/learner-dashboard/dashboard", icon: LayoutGrid },
    { name: "Tracks", href: "/learner-dashboard/tracks", icon: BookOpen },
    { name: "Progress", href: "/learner-dashboard/progress", icon: BarChart3 },
    { name: "Profile", href: "/learner-dashboard/profile", icon: User },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-white dark:bg-gray-900 py-3 rounded-t-3xl border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.3)] lg:hidden">
      {navItems.map(({ name, href, icon: Icon }) => (
        <Link
          key={name}
          href={href}
          className={`flex flex-col items-center text-xs font-semibold transition-colors duration-200 ${
            isActive(href)
              ? "text-[#72a210] dark:text-[#a3e635]"
              : "text-gray-600 dark:text-gray-300 hover:text-[#72a210] dark:hover:text-[#a3e635]"
          }`}
        >
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-2xl mb-1 transition-all duration-300 ${
              isActive(href)
                ? "bg-[#72a210] text-white dark:bg-[#a3e635]"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            <Icon className="w-6 h-6" />
          </div>
          {name}
        </Link>
      ))}
    </nav>
  );
}
