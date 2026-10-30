
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Aperture, Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "About Us", href: "#about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-blue-100 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setIsOpen(false)}
        >
            <Image src={logo} alt="Logo"
            height={40}
            width={40}
            className="flex items-center gap-2 "/>
          

          <span className="text-xl font-bold tracking-tight text-[#102A43] sm:text-2xl">
            Studio<span className="text-[#176B9B]">Space</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors xl:px-4 ${
                isActive(link.href)
                  ? "bg-[#F0F7FC] text-black"
                  : "text-slate-600 hover:bg-slate-50 hover:text-[#176B9B]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#102A43] transition-colors hover:bg-slate-100"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-[#176B9B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#12577F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176B9B] focus-visible:ring-offset-2"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#102A43] transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176B9B] lg:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile & Tablet Navigation */}
      {isOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white px-4 pb-5 pt-3 shadow-lg sm:px-6 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-[#F0F7FC] text-[#176B9B]"
                    : "text-slate-700 hover:bg-slate-50 hover:text-[#176B9B]"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-[#102A43] transition-colors hover:bg-slate-50"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center rounded-lg bg-[#176B9B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#12577F]"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
