"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutGrid, RotateCcw, Sparkles } from "lucide-react";

import StudioCard from "@src/components/studio/StudioCard";
import EmptyState from "@/components/shared/EmptyState";
import { StudioGridSkeleton } from "@/components/shared/LoadingStates";
import type { TStudio } from "@src/lib/type/type";
import { getErrorMessage } from "@/lib/utils";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
).replace(/\/+$/, "");

export default function Featured() {
  const [studios, setStudios] = useState<TStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchFeaturedStudios = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/featured-studios`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            "Unable to load featured studios. Please try again.",
          );
        }

        const data = (await response.json()) as TStudio[];

        if (active) {
         
          setStudios(
            (Array.isArray(data) ? data : [])
              .filter((studio) => studio.isPublished !== false)
              .slice(0, 6),
          );
          setError("");
        }
      } catch (error) {
        console.error("Featured Studios Error:", error);

        if (active) {
          setStudios([]);
          setError(
            getErrorMessage(
              error,
              "Unable to load featured studios. Please try again.",
            ),
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchFeaturedStudios();

    return () => {
      active = false;
    };
  }, [reloadToken]);

  const retryFetch = () => {
    if (loading) {
      return;
    }

    setReloadToken((current) => current + 1);
  };

  return (
    <section
      id="featured"
      aria-labelledby="featured-heading"
      className="relative overflow-hidden bg-brand-ivory-dark py-20 sm:py-24 lg:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-16 h-96 w-96 rounded-full bg-brand-bronze-light/70 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-brand-bronze/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2 shadow-sm">
            <LayoutGrid className="h-4 w-4 text-brand-bronze" />

            <span className="text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
              Featured Studios
            </span>
          </div>

          <h2
            id="featured-heading"
            className="text-3xl font-bold leading-tight tracking-tight text-brand-charcoal sm:text-4xl lg:text-5xl"
          >
            Discover Spaces for
            <span className="mt-2 block text-brand-bronze">
              Your Next Creative Project.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-brand-stone sm:text-lg">
            Explore our top-rated creative spaces, designed to bring your
            ideas to life.
          </p>
        </div>

        <div aria-live="polite" aria-busy={loading}>
          {/* Loading State */}
          {loading && <StudioGridSkeleton />}

          {/* Error State */}
          {!loading && error && (
            <EmptyState
              tone="error"
              icon={LayoutGrid}
              eyebrow="Featured spaces unavailable"
              title="Unable to load featured studios"
              description={error}
              action={{
                label: "Try again",
                onClick: retryFetch,
                icon: RotateCcw,
              }}
            />
          )}

          {/* Featured Studio Cards */}
          {!loading && !error && studios.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {studios.map((studio, index) => (
                <StudioCard
                  key={studio._id ?? `${studio.title}-${index}`}
                  studio={studio}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && studios.length === 0 && (
            <EmptyState
              icon={Sparkles}
              eyebrow="Coming soon"
              title="No featured studios yet"
              description="Featured spaces will appear here once hosts publish their studios. In the meantime, browse the full collection by category."
              action={{
                label: "Browse categories",
                href: "/#categories",
                icon: LayoutGrid,
              }}
            />
          )}
        </div>

        {/* View All Studios */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/studios"
            className="group inline-flex items-center gap-3 rounded-xl bg-brand-charcoal px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-brand-bronze hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bronze focus-visible:ring-offset-2"
          >
            Explore All Studios

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
