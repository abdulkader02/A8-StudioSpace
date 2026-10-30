
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";

const exploreLinks = [
  { name: "All Workspaces", href: "/studios" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Booking History", href: "/bookings" },
];

const categoryLinks = [
  { name: "Photography Studios", href: "/studios?category=photography" },
  { name: "Video & Film Studios", href: "/studios?category=film" },
  { name: "Podcast & Recording Studios", href: "/studios?category=podcast" },
  { name: "Music Production Studios", href: "/studios?category=music" },
  { name: "Content Creation Studios", href: "/studios?category=content" },
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  );
}

const socialLinks = [
  {
    name: "X",
    href: "https://x.com",
    icon: XIcon,
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: InstagramIcon,
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: YoutubeIcon,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-brand-dark-soft bg-brand-dark">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src={logo}
                alt="StudioSpace logo"
                width={40}
                height={40}
                priority
              />
              <span className="text-xl font-bold tracking-tight text-brand-ivory sm:text-2xl">
                Studio<span className="text-brand-bronze">Space</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#F5F0E8]/70">
              StudioSpace is the premier peer-to-peer workspace sharing
              marketplace connecting filmmakers, photographers, musicians, and
              creators with world-class production facilities.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-ivory">
              Explore
            </h3>

            <ul className="mt-4 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#F5F0E8]/70 underline underline-offset-4 transition-colors hover:text-brand-bronze"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-ivory">
              Categories
            </h3>

            <ul className="mt-4 space-y-3">
              {categoryLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#F5F0E8]/70 underline underline-offset-4 transition-colors hover:text-brand-bronze"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-ivory">
              Connect With Us
            </h3>

            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`StudioSpace on ${social.name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-dark-soft text-brand-ivory transition-colors hover:bg-brand-bronze hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-bronze"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-[#F5F0E8]/70">
              Need assistance? Email support:
              <a
                href="mailto:support@studiospace.io"
                className="mt-1 block font-medium text-brand-bronze underline underline-offset-4 transition-colors hover:text-brand-ivory"
              >
                support@studiospace.io
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-dark-soft">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-[#F5F0E8]/60 sm:flex-row sm:px-6 lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} StudioSpace. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-brand-bronze"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-brand-bronze"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
