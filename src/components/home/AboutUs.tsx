"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Headphones,
  Heart,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const protectionFeatures: Feature[] = [
  {
    title: "$1,000,000 Host Liability Protection",
    description:
      "Coverage designed to protect hosts and production spaces against eligible booking-related incidents.",
    icon: ShieldCheck,
  },
  {
    title: "Identity & Professional Verification",
    description:
      "A verification process designed to build confidence between studio hosts and creative professionals.",
    icon: UserCheck,
  },
  {
    title: "Production Equipment Safeguard",
    description:
      "Structured equipment check-in and check-out procedures for valuable production gear.",
    icon: Camera,
  },
  {
    title: "Dedicated Production Support",
    description:
      "Assistance with workspace access, technical coordination, and booking-related issues.",
    icon: Headphones,
  },
];

const assurances: Feature[] = [
  {
    title: "Host Protection",
    description: "Clear protection policies",
    icon: ShieldCheck,
  },
  {
    title: "Verified Workspaces",
    description: "Transparent studio information",
    icon: BadgeCheck,
  },
  {
    title: "Creator First",
    description: "Simple and transparent booking",
    icon: Heart,
  },
];

export default function AboutUs() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleBecomeHost = () => {
    if (isPending) return;

    if (session?.user) {
      toast.info("You are already logged in. Let's create your studio!");
      router.push("/add-studio");
      return;
    }

    router.push("/register");
  };

  return (
    <section
      id="about-us"
      aria-labelledby="about-us-heading"
      className="relative overflow-hidden bg-muted py-20 sm:py-24 lg:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-secondary/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-brand-bronze/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-brand-bronze" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
              About Us
            </span>
          </div>

          <h2
            id="about-us-heading"
            className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Create With Confidence.
            <span className="mt-2 block text-brand-bronze">
              We Have Your Back.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            From verified workspaces to structured booking safeguards,
            StudioSpace is designed to make every creative collaboration more
            confident and convenient.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid items-stretch gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-brand-bronze">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-bronze" />
              Protection for everyone
            </div>

            <h3 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              A Better Space for Creativity to Thrive.
            </h3>

            <p className="mt-5 text-base leading-8 text-muted-foreground">
              Great creative work starts with the right environment. We focus on
              building a trusted marketplace where hosts can showcase their
              spaces and creators can book with greater confidence.
            </p>

            {/* Mini trust points */}
            <div className="mt-8 space-y-4">
              {[
                "Clear workspace and booking information",
                "A verification-focused marketplace",
                "Dedicated support for booking concerns",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-bronze" />
                  <span className="text-sm font-medium text-foreground">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleBecomeHost}
                disabled={isPending}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-bronze px-6 py-3.5 text-sm font-semibold text-brand-dark shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-bronze-hover hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Checking..." : "Become a Host"}

                {!isPending && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </button>

              <Link
                href="/studios"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-1 hover:border-brand-bronze hover:text-brand-bronze"
              >
                Explore Studios
              </Link>
            </div>
          </div>

          {/* Right Protection Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {protectionFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-bronze/40 hover:shadow-xl hover:shadow-black/5 sm:p-7"
                >
                  {/* Hover decoration */}
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-secondary transition-transform duration-500 group-hover:scale-150" />

                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-brand-bronze transition-all duration-300 group-hover:bg-brand-bronze group-hover:text-brand-dark">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="mt-7 block text-xs font-bold tracking-widest text-brand-bronze/70">
                      0{index + 1}
                    </span>

                    <h3 className="mt-2 text-lg font-bold leading-snug text-foreground">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Trust Assurance Bar */}
        <div className="mt-20 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="grid divide-y divide-brand-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {assurances.map((assurance) => {
              const Icon = assurance.icon;

              return (
                <div
                  key={assurance.title}
                  className="flex items-center gap-4 px-6 py-7 transition-colors hover:bg-background sm:px-8"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-brand-bronze">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {assurance.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {assurance.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
