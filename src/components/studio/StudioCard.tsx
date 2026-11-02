"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import type { TStudio } from "@src/lib/type/type";
import { getStudioCoverImage } from "@/lib/studio";

const formatPrice = (price: unknown, currency = "USD") => {
  const amount = Number(price);

  if (!Number.isFinite(amount)) {
    return null;
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency || "USD"} ${amount.toLocaleString("en-US")}`;
  }
};

type StudioCardProps = {
  studio: TStudio;
};

export default function StudioCard({ studio }: StudioCardProps) {
  const [failedImage, setFailedImage] = useState<string | null>(null);

  const studioId = studio._id;
  const studioTitle = studio.title?.trim() || "Untitled Studio";
  const coverImage = getStudioCoverImage(studio);
  const showImage = Boolean(coverImage) && coverImage !== failedImage;

  const displayCategory = studio.category?.trim() || "Creative Space";
  const description = studio.description?.trim();

  const hourlyRate = formatPrice(studio.price, studio.currency);

  const rating = Number(studio.rating);
  const hasRating = Number.isFinite(rating) && rating > 0;

  const location = [studio.location?.area, studio.location?.city]
    .filter(Boolean)
    .join(", ");

  const capacity = Number(studio.capacity);
  const hasCapacity = Number.isFinite(capacity) && capacity > 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-border bg-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-charcoal/[0.07]">
      {/* IMAGE */}
      <div className="relative aspect-[1.28/1] overflow-hidden bg-muted-foreground/10">
        {showImage && coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={`${studioTitle} cover`}
            loading="lazy"
            onError={() => setFailedImage(coverImage)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-ivory to-brand-bronze/20">
            <Sparkles className="h-10 w-10 text-brand-bronze/60" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />

        {studio.isFeatured && (
          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-brand-charcoal/75 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-brand-bronze-light" />
            FEATURED
          </div>
        )}

        <div
          aria-label={
            hasRating
              ? `Rated ${rating.toFixed(1)} out of 5`
              : "No ratings yet"
          }
          className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-foreground shadow-sm"
        >
          <Star
            className={`h-3.5 w-3.5 ${
              hasRating
                ? "fill-brand-bronze text-brand-bronze"
                : "text-muted-foreground/50"
            }`}
          />

          {hasRating ? rating.toFixed(1) : "New"}
        </div>

        <div className="absolute bottom-4 left-4">
          <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            {displayCategory}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand-bronze">
              {studioTitle}
            </h3>

            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-bronze" />

              <span className="truncate">
                {location || "Location not specified"}
              </span>
            </p>
          </div>

          <div className="shrink-0 text-right">
            {hourlyRate ? (
              <p className="text-lg font-bold text-foreground">
                {hourlyRate}
                <span className="ml-1 text-xs font-medium text-muted-foreground">
                  / hr
                </span>
              </p>
            ) : (
              <p className="text-xs font-medium text-muted-foreground">
                Price on request
              </p>
            )}
          </div>
        </div>

        {description && (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}

        {/* FOOTER */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          {hasCapacity ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-brand-bronze" />
              <span>
                {capacity} {capacity === 1 ? "guest" : "guests"}
              </span>
            </div>
          ) : (
            <span />
          )}

          {studioId ? (
            <Link
              href={`/studios/${studioId}`}
              aria-label={`View details for ${studioTitle}`}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-foreground px-4 text-xs font-semibold text-background transition-colors hover:bg-brand-bronze hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bronze focus-visible:ring-offset-2"
            >
              View Details
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <span className="text-xs text-muted-foreground">
              Details unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
