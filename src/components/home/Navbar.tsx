
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
  { name: "About Us", href: "#aboutus" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-dark-soft bg-brand-dark backdrop-blur-md">
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
          

          <span className="text-xl font-bold tracking-tight text-brand-ivory sm:text-2xl">
            Studio<span className="text-brand-bronze">Space</span>
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
                  ? "bg-brand-dark-soft text-brand-ivory"
                  : "text-[#F5F0E8]/75 hover:bg-brand-dark-soft hover:text-brand-bronze"
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
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-brand-ivory transition-colors hover:bg-brand-dark-soft"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-brand-bronze px-5 py-2.5 text-sm font-semibold text-brand-dark shadow-sm transition-colors hover:bg-brand-bronze-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
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
          className="flex h-10 w-10 items-center justify-center rounded-lg text-brand-ivory transition-colors hover:bg-brand-dark-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bronze lg:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile & Tablet Navigation */}
      {isOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-brand-dark-soft bg-brand-dark px-4 pb-5 pt-3 shadow-lg sm:px-6 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-brand-dark-soft text-brand-bronze"
                    : "text-[#F5F0E8]/80 hover:bg-brand-dark-soft hover:text-brand-bronze"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-brand-dark-soft pt-4">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-brand-ivory transition-colors hover:bg-brand-dark-soft"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center rounded-xl bg-brand-bronze px-4 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-bronze-hover"
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
