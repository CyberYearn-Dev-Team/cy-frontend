"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  BarChart3,
  Activity,
  ToggleLeft,
  Users,
  Bug,
} from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/admin-dashboard/overview", icon: LayoutGrid },
    { name: "Reports", href: "/admin-dashboard/technical-issues", icon: Bug },
    { name: "Audit", href: "/admin-dashboard/audit", icon: Activity },
    { name: "Metrics", href: "/admin-dashboard/metrics", icon: BarChart3 },
    { name: "Toggles", href: "/admin-dashboard/feature-flags", icon: ToggleLeft },
    { name: "All Users", href: "/admin-dashboard/users", icon: Users },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50
        lg:hidden
        flex items-center justify-around
        border-t border-gray-200/60 dark:border-gray-700/60
        bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl
        px-2 py-2 rounded-t-2xl
        shadow-[0_-10px_35px_-15px_rgba(0,0,0,0.35)]
      "
    >
      {navItems.map(({ name, href, icon: Icon }) => {
        const active = isActive(href);

        return (
          <Link
            key={name}
            href={href}
            className={`
              flex flex-col items-center justify-center
              transition-all duration-300
              ${
                active
                  ? "scale-105"
                  : "opacity-80 hover:opacity-100 hover:scale-[1.02]"
              }
            `}
          >
            {/* Icon wrapper */}
            <div
              className={`
                flex items-center justify-center
                w-12 h-12 rounded-lg mb-1.5
                transition-all duration-300
                ${
                  active
                    ? `
                      bg-gradient-to-r from-[#72a210] to-[#a3e635] text-white
                    `
                    : `
                      bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300
                    `
                }
              `}
            >
              <Icon
                className={`
                  w-5 h-5 transition-all duration-300
                  ${
                    active
                      ? "text-white scale-110"
                      : "text-gray-600 dark:text-gray-300 opacity-80"
                  }
                `}
              />
            </div>

            {/* Label */}
            <span
              className={`
                text-[10px]
                uppercase
                font-black
                tracking-wide
                transition-all duration-300
                ${
                  active
                    ? "text-gray-900 dark:text-gray-100 opacity-100"
                    : "text-gray-600 dark:text-gray-300 opacity-80"
                }
              `}
            >
              {name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}