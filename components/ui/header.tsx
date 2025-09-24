"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // get current path

  const links = [
    { name: "Home", href: "/" },
    { name: "Contact Us", href: "/landing/contact" },
    { name: "Privacy Policy", href: "/landing/privacy" },
    { name: "Terms & Conditions", href: "/landing/terms" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Navbar */}
      <nav className="px-4 sm:px-8 md:px-20 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            <img
              src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/CyberYearn_OctaTech_Logo_Black.png"
              alt="Logo"
              className="h-12 sm:h-16 md:h-20 w-auto"
            />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 font-medium text-black">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-[#72a210] hover:underline underline-offset-4 transition-colors ${
                isActive(link.href) ? "text-[#72a210] underline" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-4">
          <Link href="/auth/login" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="border-[#72a210] text-[#72a210] hover:bg-[#72a210]/10 px-8 py-3 text-lg font-medium cursor-pointer"
            >
              Login
            </Button>
          </Link>

          <Link href="/auth/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="bg-[#72a210] hover:bg-[#507800] text-white px-8 py-3 text-lg font-medium cursor-pointer"
            >
              Register
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-black cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

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
  <div className="relative bg-white h-full w-full shadow-xl p-6 flex flex-col">
    {/* Close Button */}
    <button
      className="absolute top-6 right-6 text-black hover:text-[#72a210] transition"
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
          className={`text-lg font-medium transition-colors duration-200 ${
            isActive(link.href)
              ? "text-[#72a210] underline"
              : "text-gray-700 hover:text-[#507800]"
          }`}
          onClick={() => setIsOpen(false)}
        >
          {link.name}
        </Link>
      ))}

      {/* Auth Buttons */}
      <div className="flex flex-col gap-3 mt-8">
        <Link href="/auth/login" onClick={() => setIsOpen(false)}>
          <Button className="bg-[#507800] text-white hover:bg-[#3f5b00] w-full py-3 rounded-md text-base">
            Login
          </Button>
        </Link>

        <Link href="/auth/register" onClick={() => setIsOpen(false)}>
          <Button
            variant="outline"
            className="border border-[#507800] text-[#507800] hover:bg-[#507800]/10 w-full py-3 rounded-md text-base"
          >
            Register
          </Button>
        </Link>

        <Link href="/auth/forgot-password" onClick={() => setIsOpen(false)}>
          <Button className="bg-[#507800] text-white hover:bg-[#3f5b00] w-full py-3 rounded-md text-base">
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
