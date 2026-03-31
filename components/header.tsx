"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#507800";
const textDark = "text-gray-900 dark:text-gray-100";
const bgDark = "bg-white dark:bg-gray-950";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false); // For mobile submenu
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "Contact Us", href: "/landing/contact" },
    {
      name: "Legal Pages",
      sublinks: [
        { name: "Privacy Policy", href: "/landing/legalpages/privacy" },
        { name: "Cookie Policy", href: "/landing/legalpages/cookies" },
        { name: "Terms & Conditions", href: "/landing/legalpages/terms" },
        { name: "Acceptable Use Policy", href: "/landing/legalpages/aup" },
      ],
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Navbar */}
      <nav
        className={`px-4 sm:px-8 md:px-20 py-4 flex items-center justify-between ${bgDark} shadow-sm`}
      >
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            <img
              src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/dark%20logo.png"
              alt="Logo"
              className="h-10 sm:h-10 md:h-12 w-auto block dark:hidden"
            />
            <img
              src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/light%20logo.png"
              alt="Logo"
              className="h-10 sm:h-10 md:h-12 w-auto hidden dark:block"
            />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden min-[950px]:flex gap-8 font-medium text-gray-900 dark:text-gray-100">
          {links.map((link) =>
            !link.sublinks ? (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-[${primary}] hover:underline underline-offset-4 transition-colors ${
                  isActive(link.href) ? `text-[${primary}] underline` : ""
                }`}
              >
                {link.name}
              </Link>
            ) : (
              <DropdownMenu key={link.name}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex items-center gap-1 hover:text-[${primary}] transition-colors focus:outline-none`}
                  >
                    {link.name}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className={`w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-2 mt-1`}
                >
                  {link.sublinks.map((sub) => (
                    <DropdownMenuItem
                      key={sub.href}
                      asChild
                      className={`hover:bg-[${primary}]/10 dark:hover:bg-[${primary}]/20 rounded-md transition-colors ${
                        isActive(sub.href)
                          ? `bg-[${primary}]/10 text-[${primary}]`
                          : ""
                      }`}
                    >
                      <Link
                        href={sub.href}
                        className={`w-full text-left text-gray-900 dark:text-gray-100 hover:text-[${primary}] px-3 py-2 rounded-md text-sm font-medium`}
                      >
                        {sub.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          )}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden min-[950px]:flex [@media(max-width:1150px)]:hidden gap-4">
          <Link href="/auth/login">
            <Button
              variant="outline"
              size="lg"
              className={`border-[${primary}] text-[${primary}] hover:text-[${primaryDarker}] hover:bg-[${primary}]/10 dark:hover:bg-[${primary}]/[0.05] px-8 py-3 text-[16px] font-medium cursor-pointer rounded-md`}
            >
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button
              size="lg"
              className={`bg-[${primary}] hover:bg-[${primaryDarker}] text-white px-8 py-3 text-[16px] font-medium cursor-pointer rounded-md`}
            >
              Register
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`min-[950px]:hidden ${textDark}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Gradient Divider */}
      <div className="max-w-7xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
      </div>

      {/* Mobile Sliding Menu */}
      <div
  className={`fixed top-0 right-0 h-full z-50 transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "translate-x-full"}
    w-full sm:max-w-sm`}
>

        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Sliding Menu */}
        <div
          className={`${bgDark} h-full shadow-xl p-6 flex flex-col relative overflow-y-auto`}
        >
          {/* Close Button */}
          <button
            className={`absolute top-6 right-6 ${textDark} hover:text-[${primary}] transition`}
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Links */}
          <div className="flex flex-col gap-6 mt-16">
            {links.map((link) =>
              !link.sublinks ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-lg font-medium cursor-pointer transition-colors duration-200 ${
                    isActive(link.href)
                      ? `text-[${primary}] underline underline-offset-4`
                      : `${textDark} hover:text-[${primary}]`
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <div key={link.name} className="flex flex-col cursor-pointer gap-5">
                  <button
                    onClick={() => setIsLegalOpen(!isLegalOpen)}
                    className={`flex items-center justify-between cursor-pointer text-lg font-medium ${textDark} hover:text-[${primary}]`}
                  >
                    {link.name}
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isLegalOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`flex flex-col gap-5 ml-4 overflow-hidden cursor-pointer transition-all duration-300 ${
                      isLegalOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    {link.sublinks.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`text-base cursor-pointer font-medium transition-colors duration-200 ${
                          isActive(sub.href)
                            ? `text-[${primary}] underline underline-offset-4`
                            : `${textDark} hover:text-[${primary}]`
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* Auth Buttons */}
            <div className="flex flex-col gap-4 mt-8">
              <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                <Button
                  className={`bg-[${primary}] text-white hover:bg-[${primaryDarker}] w-full py-6 rounded-md text-[17px]`}
                >
                  Login Your Account
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  className={`border border-[${primary}] text-[${primary}] hover:bg-[${primary}]/10 dark:hover:bg-[${primary}]/[0.05] w-full py-6 rounded-md text-[17px]`}
                >
                  Register an Account
                </Button>
              </Link>
              <Link
                href="/auth/forgot-password"
                onClick={() => setIsOpen(false)}
              >
                <Button
                  className={`bg-[${primary}] text-white hover:bg-[${primaryDarker}] w-full py-6 rounded-md text-[17px]`}
                >
                  Forgotten Password
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
