
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { TStudio } from "@src/lib/type/type";
import StudioCard from "@src/components/studio/StudioCard";
import EmptyState from "@/components/shared/EmptyState";
import { StudioGridSkeleton } from "@/components/shared/LoadingStates";
import { categoryNameToSlug, categorySlugToName } from "@/lib/studio";
import { getErrorMessage } from "@/lib/utils";

import {
  ArrowRight,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
  Camera,
  Clapperboard,
  Mic2,
  Music2,
  Palette,
  Video,
  Building2,
  Sparkles,
  Users,
  RotateCcw,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
).replace(/\/+$/, "");

const categories = [
  { name: "All Spaces", icon: Sparkles },
  { name: "Photo Studio", icon: Camera },
  { name: "Film Stage", icon: Clapperboard },
  { name: "Podcast Lounge", icon: Mic2 },
  { name: "Music Suite", icon: Music2 },
  { name: "Workshop", icon: Palette },
  { name: "Dance Studio", icon: Building2 },
  { name: "Content Creation Studio", icon: Video },
  { name: "Meeting Space", icon: Users },
];

export default function AllStudiosPage() {
  return (

    <Suspense fallback={<StudiosPageFallback />}>
      <StudiosContent />
    </Suspense>
  );
}

function StudiosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category");

  const [studios, setStudios] = useState<TStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Get category directly from URL
  const category = categoryParam
    ? categorySlugToName[categoryParam] || "All Spaces"
    : "All Spaces";

  // Fetch studios from MongoDB
  useEffect(() => {
    let active = true;

    const fetchStudios = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/studios`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            "Unable to load studios. Please make sure the StudioSpace API is running.",
          );
        }

        const data = (await response.json()) as TStudio[];

        if (active) {
          setStudios(Array.isArray(data) ? data : []);
          setFetchError("");
        }
      } catch (error) {
        console.error("Fetch studios error:", error);

        if (active) {
          setFetchError(
            getErrorMessage(
              error,
              "Please make sure the StudioSpace API is running.",
            ),
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchStudios();

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

  // Handle category selection and update URL
  const handleCategoryChange = (selectedCategory: string) => {
    if (selectedCategory === "All Spaces") {
      router.push("/studios", { scroll: false });
      return;
    }

    const slug = categoryNameToSlug[selectedCategory];

    if (slug) {
      router.push(`/studios?category=${slug}`, {
        scroll: false,
      });
    }
  };

  // Filter studios
  const visibleStudios = useMemo(() => {
    return studios.filter((studio) => {
      // Hide unpublished studios
      if (studio.isPublished === false) return false;

      const searchText = keyword.trim().toLowerCase();

      const matchesKeyword =
        !searchText ||
        studio.title?.toLowerCase().includes(searchText) ||
        studio.category?.toLowerCase().includes(searchText) ||
        studio.description?.toLowerCase().includes(searchText);

      const studioLocation = [
        studio.location?.city,
        studio.location?.area,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesLocation =
        !location.trim() ||
        studioLocation.includes(location.trim().toLowerCase());

      const matchesCategory =
        category === "All Spaces" || studio.category === category;

      const studioPrice = Number(studio.price);
      const priceLimit = Number(maxPrice);

      const matchesPrice =
        !maxPrice ||
        (Number.isFinite(studioPrice) &&
          Number.isFinite(priceLimit) &&
          studioPrice <= priceLimit);

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesCategory &&
        matchesPrice
      );
    });
  }, [studios, keyword, location, category, maxPrice]);

  // Reset filters
  const resetFilters = () => {
    setKeyword("");
    setLocation("");
    setMaxPrice("");

    router.push("/studios", { scroll: false });
  };

  const hasActiveFilters =
    keyword.trim() !== "" ||
    location.trim() !== "" ||
    category !== "All Spaces" ||
    maxPrice !== "";

  return (
    <main className="min-h-screen bg-brand-ivory">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-brand-border">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[350px] w-[350px] rounded-full bg-brand-bronze/10 blur-[100px]" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-[300px] w-[300px] rounded-full bg-brand-stone/15 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8">
          {/* HEADING */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-bronze/25 bg-white/60 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-bronze backdrop-blur">
              <Sparkles className="h-3 w-3" />
              Spaces that inspire
            </div>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-brand-charcoal sm:text-4xl md:text-5xl">
              Find your space.
              <span className="block font-serif italic font-normal text-brand-bronze">
                Create something remarkable.
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-xs leading-6 text-brand-stone sm:text-sm">
              Discover creative spaces for photography, filmmaking, music, and
              everything in between.
            </p>
          </div>

          {/* SEARCH PANEL */}
          <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-brand-border bg-white p-2.5 shadow-lg shadow-brand-charcoal/[0.05]">
            <div className="grid gap-2 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center">
              {/* Keyword */}
              <div className="flex min-w-0 items-center gap-2.5 rounded-xl px-3 py-2.5 transition hover:bg-brand-ivory/70">
                <Search className="h-4 w-4 shrink-0 text-brand-bronze" />

                <div className="min-w-0 flex-1">
                  <label className="mb-0.5 block text-[9px] font-bold uppercase tracking-[0.14em] text-brand-stone">
                    Find a space
                  </label>

                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Studio or keyword"
                    className="w-full bg-transparent text-xs font-medium text-brand-charcoal outline-none placeholder:font-normal placeholder:text-brand-stone/70"
                  />
                </div>
              </div>

              <div className="hidden h-8 w-px bg-brand-border md:block" />

              {/* Location */}
              <div className="flex min-w-0 items-center gap-2.5 rounded-xl px-3 py-2.5 transition hover:bg-brand-ivory/70">
                <MapPin className="h-4 w-4 shrink-0 text-brand-bronze" />

                <div className="min-w-0 flex-1">
                  <label className="mb-0.5 block text-[9px] font-bold uppercase tracking-[0.14em] text-brand-stone">
                    Location
                  </label>

                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City or area"
                    className="w-full bg-transparent text-xs font-medium text-brand-charcoal outline-none placeholder:font-normal placeholder:text-brand-stone/70"
                  />
                </div>
              </div>

              <div className="hidden h-8 w-px bg-brand-border md:block" />

              {/* Category */}
              <div className="flex min-w-0 items-center gap-2.5 rounded-xl px-3 py-2.5 transition hover:bg-brand-ivory/70">
                <SlidersHorizontal className="h-4 w-4 shrink-0 text-brand-bronze" />

                <div className="min-w-0 flex-1">
                  <label className="mb-0.5 block text-[9px] font-bold uppercase tracking-[0.14em] text-brand-stone">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full cursor-pointer appearance-none bg-transparent text-xs font-medium text-brand-charcoal outline-none"
                  >
                    {categories.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById("studio-results")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-bronze px-5 text-xs font-semibold text-white transition hover:bg-brand-bronze-hover"
              >
                Search
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* PRICE FILTER */}
            <div className="mt-1 flex flex-wrap items-center gap-2 border-t border-brand-border px-3 pt-2.5">
              <span className="text-[10px] font-semibold text-brand-stone">
                Max hourly price
              </span>

              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="rounded-lg border border-brand-border bg-brand-ivory/60 px-2.5 py-1.5 text-[10px] font-medium text-brand-charcoal outline-none focus:border-brand-bronze"
              >
                <option value="">Any price</option>
                <option value="30">Up to $30</option>
                <option value="50">Up to $50</option>
                <option value="100">Up to $100</option>
                <option value="150">Up to $150</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-brand-bronze transition hover:text-brand-bronze-hover"
                >
                  <X className="h-3 w-3" />
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* TRUST POINTS */}
          <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-medium text-brand-stone sm:text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-bronze" />
              Flexible hourly booking
            </span>

            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-bronze" />
              Curated creative spaces
            </span>

            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-bronze" />
              Spaces for every idea
            </span>
          </div>
        </div>
      </section>

      {/* CATEGORY QUICK FILTER */}
      <section className="border-b border-brand-border bg-white/60">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-max items-center gap-2.5">
            {categories.map((item) => {
              const Icon = item.icon;
              const active = category === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleCategoryChange(item.name)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-semibold transition ${
                    active
                      ? "border-brand-charcoal bg-brand-charcoal text-brand-ivory"
                      : "border-brand-border bg-white text-brand-stone hover:border-brand-bronze hover:text-brand-bronze"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* STUDIO RESULTS */}
      <section
        id="studio-results"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-bronze">
              The Studio Collection
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-brand-charcoal sm:text-3xl">
              Spaces worth creating in.
            </h2>

            <p className="mt-2 text-xs text-brand-stone sm:text-sm">
              Explore spaces selected for your next creative project.
            </p>
          </div>

          <span className="w-fit rounded-full border border-brand-border bg-white px-4 py-2 text-xs text-brand-stone">
            {visibleStudios.length} spaces found
          </span>
        </div>

        {loading ? (
          <StudioGridSkeleton />
        ) : fetchError ? (
          <EmptyState
            tone="error"
            icon={Search}
            eyebrow="Connection issue"
            title="Unable to load studios"
            description={fetchError}
            action={{
              label: "Try again",
              onClick: retryFetch,
              icon: RotateCcw,
            }}
            secondaryAction={{
              label: "Back to home",
              href: "/",
            }}
          />
        ) : visibleStudios.length === 0 ? (
          <EmptyState
            icon={Search}
            eyebrow={
              hasActiveFilters ? "No matches" : "The collection is growing"
            }
            title={
              hasActiveFilters
                ? "No spaces match your filters"
                : "No studios published yet"
            }
            description={
              hasActiveFilters
                ? "Try another keyword, category, location, or price range to find a space that fits your shoot."
                : "New creative spaces are added regularly. Browse by category or check back soon for the next opening."
            }
            action={
              hasActiveFilters
                ? {
                    label: "Clear filters",
                    onClick: resetFilters,
                    icon: X,
                  }
                : {
                    label: "Browse categories",
                    href: "/#categories",
                    icon: Sparkles,
                  }
            }
            secondaryAction={
              hasActiveFilters
                ? {
                    label: "Explore all studios",
                    href: "/studios",
                    icon: Search,
                  }
                : {
                    label: "List your space",
                    href: "/add-studio",
                    icon: Building2,
                  }
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleStudios.map((studio, index) => (
              <StudioCard
                key={studio._id ?? `${studio.title}-${index}`}
                studio={studio}
              />
            ))}
          </div>
        )}
      </section>

      {/* HOST CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] bg-brand-charcoal px-7 py-10 sm:px-12 lg:px-16 lg:py-12">
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-brand-bronze/20" />

          <div className="pointer-events-none absolute -right-8 -top-16 h-56 w-56 rounded-full border border-brand-bronze/20" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-bronze-light">
                For space owners
              </p>

              <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-brand-ivory sm:text-3xl">
                Your space could be
                <span className="font-serif italic font-normal text-brand-bronze-light">
                  {" "}
                  someone’s next big idea.
                </span>
              </h2>

              <p className="mt-3 max-w-lg text-xs leading-6 text-brand-ivory/60 sm:text-sm">
                Share your creative space with a community of creators,
                filmmakers, photographers, and innovators.
              </p>
            </div>

            <Link
              href="/add-studio"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-bronze px-6 text-sm font-semibold text-white transition hover:bg-brand-bronze-hover"
            >
              List your space
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function StudiosPageFallback() {
  return (
    <main className="min-h-screen bg-brand-ivory">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-3">
          <div className="h-8 w-64 animate-pulse rounded bg-brand-stone/10" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-brand-stone/10" />
        </div>

        <StudioGridSkeleton />
      </div>
    </main>
  );
}
