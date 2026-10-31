"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { TStudio } from "@src/lib/type/type.ts";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Users,
  X,
  Camera,
  Clapperboard,
  Mic2,
  Music2,
  Palette,
  Video,
  Building2,
  Sparkles,
} from "lucide-react";


type StudiosResponse = TStudio[] | { data?: TStudio[]; studios?: TStudio[] };

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

const formatPrice = (price: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);

function StudioCard({ studio }: { studio: TStudio }) {
  const studioId = studio._id ?? studio.id;

  const location = [studio.location?.area, studio.location?.city]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="group overflow-hidden rounded-[22px] border border-brand-border bg-white transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-charcoal/[0.07]">
      <div className="relative aspect-[1.28/1] overflow-hidden bg-brand-stone/10">
        {studio.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={studio.imageUrl}
            alt={studio.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-ivory to-brand-bronze/20">
            <Sparkles className="h-10 w-10 text-brand-bronze/60" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />

        {studio.isFeatured && (
          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-brand-charcoal/75 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-brand-bronze-light" />
            FEATURED
          </div>
        )}

        {typeof studio.rating === "number" && studio.rating > 0 && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-brand-charcoal shadow-sm">
            <Star className="h-3.5 w-3.5 fill-brand-bronze text-brand-bronze" />
            {studio.rating.toFixed(1)}
          </div>
        )}

        <div className="absolute bottom-4 left-4">
          <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            {studio.category}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight text-brand-charcoal transition-colors group-hover:text-brand-bronze">
              {studio.title}
            </h2>

            {location && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-brand-stone">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-bronze" />
                <span className="truncate">{location}</span>
              </p>
            )}
          </div>

          <div className="shrink-0 text-right">
            <p className="text-lg font-bold text-brand-charcoal">
              {formatPrice(studio.price, studio.currency)}
            </p>
            <p className="mt-0.5 text-xs text-brand-stone">
              / {studio.priceUnit || "hour"}
            </p>
          </div>
        </div>

        {studio.description && (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-brand-stone">
            {studio.description}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-brand-border pt-4">
          <div className="flex items-center gap-2 text-sm text-brand-stone">
            <Users className="h-4 w-4 text-brand-bronze" />
            <span>{studio.capacity} guests</span>
          </div>

          {studioId ? (
            <Link
              href={`/studios/${studioId}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-bronze transition-all hover:gap-2.5"
            >
              View details
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="text-xs text-brand-stone">
              Details unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function AllStudiosPage() {
  const [studios, setStudios] = useState<TStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All Spaces");
  const [maxPrice, setMaxPrice] = useState("");

  // Fetch studios
  useEffect(() => {
    let active = true;

    const fetchStudios = async () => {
      try {
        const res = await fetch("http://localhost:5000/studios", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data: StudiosResponse = await res.json();

        const result = Array.isArray(data)
          ? data
          : (data.studios ?? data.data ?? []);

        if (active) {
          setStudios(result);
          setFetchError(false);
        }
      } catch (error) {
        console.error("Fetch studios error:", error);

        if (active) {
          setFetchError(true);
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
  }, []);

  const visibleStudios = useMemo(() => {
    return studios.filter((studio) => {
      if (studio.isPublished === false) return false;

      const searchText = keyword.trim().toLowerCase();

      const matchesKeyword =
        !searchText ||
        studio.title.toLowerCase().includes(searchText) ||
        studio.category.toLowerCase().includes(searchText) ||
        studio.description?.toLowerCase().includes(searchText);

      const studioLocation = [studio.location?.city, studio.location?.area]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesLocation =
        !location.trim() ||
        studioLocation.includes(location.trim().toLowerCase());

      const matchesCategory =
        category === "All Spaces" || studio.category === category;

      const matchesPrice = !maxPrice || studio.price <= Number(maxPrice);

      return (
        matchesKeyword && matchesLocation && matchesCategory && matchesPrice
      );
    });
  }, [studios, keyword, location, category, maxPrice]);

  const resetFilters = () => {
    setKeyword("");
    setLocation("");
    setCategory("All Spaces");
    setMaxPrice("");
  };

  return (
    <main className="min-h-screen bg-brand-ivory">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-brand-border">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[350px] w-[350px] rounded-full bg-brand-bronze/10 blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[300px] w-[300px] rounded-full bg-brand-stone/15 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8">
          {/* CENTERED TWO-LINE HEADING */}
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

          {/* COMPACT SEARCH PANEL */}
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
                    onChange={(e) => setCategory(e.target.value)}
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

              {(keyword ||
                location ||
                category !== "All Spaces" ||
                maxPrice) && (
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
                  onClick={() => setCategory(item.name)}
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-[22px] border border-brand-border bg-white"
              >
                <div className="aspect-[1.28/1] bg-brand-stone/10" />
                <div className="space-y-3 p-6">
                  <div className="h-5 w-3/4 rounded bg-brand-stone/10" />
                  <div className="h-4 w-1/2 rounded bg-brand-stone/10" />
                  <div className="h-4 w-full rounded bg-brand-stone/10" />
                </div>
              </div>
            ))}
          </div>
        ) : fetchError ? (
          <div className="rounded-3xl border border-brand-border bg-white px-6 py-16 text-center">
            <Search className="mx-auto h-8 w-8 text-brand-bronze" />
            <h3 className="mt-5 text-xl font-semibold text-brand-charcoal">
              Unable to load studios
            </h3>
            <p className="mt-2 text-sm text-brand-stone">
              Please make sure the StudioSpace API is running.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-brand-charcoal px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-bronze"
            >
              Try again
            </button>
          </div>
        ) : visibleStudios.length === 0 ? (
          <div className="rounded-3xl border border-brand-border bg-white px-6 py-16 text-center">
            <Search className="mx-auto h-8 w-8 text-brand-bronze" />
            <h3 className="mt-5 text-xl font-semibold text-brand-charcoal">
              No matching spaces found
            </h3>
            <p className="mt-2 text-sm text-brand-stone">
              Try another keyword, category, location, or price range.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 rounded-xl bg-brand-bronze px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-bronze-hover"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleStudios.map((studio, index) => (
              <StudioCard
                key={studio._id ?? studio.id ?? `${studio.title}-${index}`}
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
