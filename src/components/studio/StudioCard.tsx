
"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  Star,
  Users,
  Sparkles,
} from "lucide-react";

import type { TStudio } from "@src/lib/type/type";

const formatPrice = (price: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);

export default function StudioCard({ studio }: { studio: TStudio }) {
  const studioId = studio._id ?? studio.id;
  const cardImage = studio.imageUrls?.[0];

  const location = [
    studio.location?.area,
    studio.location?.city,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="group overflow-hidden rounded-[22px] border border-brand-border bg-white transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-charcoal/[0.07]">
      <div className="relative aspect-[1.28/1] overflow-hidden bg-brand-stone/10">
        {cardImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cardImage}
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
