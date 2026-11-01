
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Plus,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Loader2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import logo from "@/assets/logo.png";
import { authClient } from "@/lib/auth-client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about-us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";

    if (href.includes("#")) {
      return pathname === href.split("#")[0];
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      toast.success("Logged out successfully.");
      setIsOpen(false);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const UserMenu = () => (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Open user menu"
            className="flex items-center gap-2 rounded-full border border-brand-dark-soft p-1.5 transition-colors hover:bg-brand-dark-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bronze"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="size-9 rounded-full border border-brand-bronze object-cover"
              />
            ) : (
              <div className="flex size-9 items-center justify-center rounded-full bg-brand-bronze font-semibold text-brand-dark">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}

            <span className="hidden max-w-28 truncate text-sm font-medium text-brand-ivory sm:block">
              {user?.name || "My Account"}
            </span>
          </button>
        }
      />

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-64 border border-brand-border bg-brand-ivory p-2 text-brand-charcoal shadow-lg"
      >
        <div className="border-b border-brand-border px-3 py-2">
          <p className="font-semibold text-brand-charcoal">
            {user?.name || "User"}
          </p>
          <p className="truncate text-xs text-brand-stone">
            {user?.email}
          </p>
        </div>

        {/* Profile */}
        <Link
          href="/profile"
          className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-brand-bronze/10 hover:text-brand-bronze"
        >
          <UserRound className="size-4" />
          Profile
        </Link>

        {/* Add New Studio */}
        <Link
          href="/add-studio"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-brand-bronze/10 hover:text-brand-bronze"
        >
          <Plus className="size-4" />
          Add New Studio
        </Link>

        {/* My Studio Listings */}
        <Link
          href="/my-listings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-brand-bronze/10 hover:text-brand-bronze"
        >
          <LayoutDashboard className="size-4" />
          My Studio Listings
        </Link>

        {/* My Bookings */}
        <Link
          href="/my-bookings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-brand-bronze/10 hover:text-brand-bronze"
        >
          <CalendarDays className="size-4" />
          My Bookings
        </Link>

        <div className="my-2 border-t border-brand-border" />

        {/* Sign Out */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoggingOut ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}

          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </button>
      </PopoverContent>
    </Popover>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-dark-soft bg-brand-dark backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setIsOpen(false)}
        >
          <Image src={logo} alt="StudioSpace Logo" height={40} width={40} />

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

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 lg:flex">
          {isPending ? null : user ? (
            <UserMenu />
          ) : (
            <>
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
            </>
          )}
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

            <div className="mt-3 border-t border-brand-dark-soft pt-4">
              {isPending ? null : user ? (
                <div className="flex items-center px-2">
                  <UserMenu />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
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
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
