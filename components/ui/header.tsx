"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
          <Link
            href="/"
            className="hover:text-[#72a210] hover:underline underline-offset-4 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/landing/contact"
            className="hover:text-[#72a210] hover:underline underline-offset-4 transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="/landing/terms"
            className="hover:text-[#72a210] hover:underline underline-offset-4 transition-colors"
          >
            Terms & Conditions
          </Link>
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
        className={`fixed top-0 right-0 h-full w-full bg-white text-black p-6 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button inside */}
        <button
          className="absolute top-6 right-6 text-black"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Links */}
        <div className="flex flex-col gap-6 mt-12">
          <Link href="/" className="hover:text-[#72a210]" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/contact" className="hover:text-[#72a210]" onClick={() => setIsOpen(false)}>
            Contact Us
          </Link>
          <Link href="/terms" className="hover:text-[#72a210]" onClick={() => setIsOpen(false)}>
            Terms & Conditions
          </Link>

          <div className="flex flex-col gap-4 mt-6">
  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
    <Button className="bg-[#507800] !text-white hover:bg-[#3f5b00] hover:!text-white w-full px-8 py-6 text-base">
      Login
    </Button>
  </Link>

  <Link href="/auth/register" onClick={() => setIsOpen(false)}>
    <Button
      variant="outline"
      className="bg-transparent border border-[#507800] text-black hover:bg-gray-100 w-full px-8 py-6 text-base"
    >
      Register
    </Button>
  </Link>

  <Link href="/auth/forgot-password" onClick={() => setIsOpen(false)}>
    <Button className="bg-[#507800] !text-white hover:bg-[#3f5b00] hover:!text-white w-full px-8 py-6 text-base">
      Forgotten Password
    </Button>
  </Link>
</div>

        </div>
      </div>
    </>
  );
}
