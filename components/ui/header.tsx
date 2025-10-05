"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#507800";
const textDark = "text-gray-900 dark:text-gray-100";
const bgDark = "bg-white dark:bg-gray-950"; // Navbar background

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "Contact Us", href: "/landing/contact" },
    { name: "Privacy Policy", href: "/landing/legalpages/privacy" },
    { name: "Terms & Conditions", href: "/landing/legalpages/terms" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Navbar */}
      <nav className={`px-4 sm:px-8 md:px-20 py-4 flex items-center justify-between ${bgDark}`}>
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            {/* Light mode logo */}
            <img
              src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/dark%20logo.png"
              alt="Logo"
              className="h-10 sm:h-10 md:h-12 w-auto block dark:hidden"
            />
            {/* Dark mode logo */}
            <img
              src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/light%20logo.png"
              alt="Logo"
              className="h-10 sm:h-10 md:h-12 w-auto hidden dark:block"
            />
          </div>
        </Link>

        {/* Desktop Links */}
<div className="hidden min-[950px]:flex gap-8 font-medium ${textDark}">
  {links.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      className={`hover:text-[${primary}] hover:underline underline-offset-4 transition-colors ${
        isActive(link.href) ? `text-[${primary}] underline` : ""
      }`}
    >
      {link.name}
    </Link>
  ))}
</div>

{/* Desktop Buttons */}
<div className="hidden min-[950px]:flex [@media(max-width:1150px)]:hidden gap-4">
  <Link href="/auth/login" className="w-full sm:w-auto">
    <Button
      variant="outline"
      size="lg"
      className={`border-[${primary}] text-[${primary}] hover:text-[${primary}] hover:bg-[${primary}]/10 dark:hover:bg-[${primary}]/[0.05] px-8 py-3 text-sm font-medium cursor-pointer`}
    >
      Login
    </Button>
  </Link>

  <Link href="/auth/register" className="w-full sm:w-auto">
    <Button
      size="lg"
      className={`bg-[${primary}] hover:bg-[${primaryDarker}] text-white px-8 py-3 text-sm font-medium cursor-pointer`}
    >
      Register
    </Button>
  </Link>
</div>


        {/* Mobile Hamburger */}
<button
  className={`min-[950px]:hidden ${textDark} cursor-pointer`}
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
        className={`fixed top-0 right-0 h-full w-full z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/30"
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Sliding Menu */}
        <div className={`${bgDark} h-full w-full shadow-xl p-6 flex flex-col relative`}>
          {/* Close Button */}
          <button
            className={`absolute top-6 right-6 ${textDark} hover:text-[${primary}] transition`}
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Links */}
          <div className="flex flex-col gap-5 mt-16">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-200 ${textDark} ${
                  isActive(link.href)
                    ? `text-[${primary}] underline`
                    : `text-[15px] hover:text-[${primaryDarker}]`
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Auth Buttons */}
            <div className="flex flex-col gap-3 mt-8">
              <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                <Button
                  className={`bg-[${primary}] text-white hover:bg-[${primaryDarker}] w-full py-5 rounded-md text-[15px]`}
                >
                  Login Your Account
                </Button>
              </Link>

              <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  className={`border border-[${primaryDarker}] text-[${primaryDarker}] hover:bg-[${primaryDarker}]/10 dark:hover:bg-[${primaryDarker}]/[0.05] w-full py-5 rounded-md text-[15px]`}
                >
                  Register an Account
                </Button>
              </Link>

              <Link href="/auth/forgot-password" onClick={() => setIsOpen(false)}>
                <Button
                  className={`bg-[${primary}] text-white hover:bg-[${primaryDarker}] w-full py-5 rounded-md text-[15px]`}
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
