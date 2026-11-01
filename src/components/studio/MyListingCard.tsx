"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Eye,
  EyeOff,
  MapPin,
  Pencil,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import DeleteStudioDialog from "@/components/studio/DeleteStudioDialog";
import { Button } from "@/components/ui/button";

import type { TStudio } from "@/lib/type/type";

type Props = {
  studio: TStudio;
  onEdit: (studio: TStudio) => void;
  onDeleted: (id: string) => void;
};

const formatPrice = (price: number, currency = "USD") => {
  if (!Number.isFinite(price)) return "—";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency} ${price.toLocaleString("en-US")}`;
  }
};

export default function MyListing({
  studio,
  onEdit,
  onDeleted,
}: Props) {
  const coverImage = studio.imageUrls?.find((image) => Boolean(image));

  const location = [studio.location?.area, studio.location?.city]
    .filter(Boolean)
    .join(", ");

  const rating =
    typeof studio.rating === "number" ? studio.rating : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-bronze/40 hover:shadow-xl hover:shadow-brand-charcoal/[0.07]">
      {/* Cover Image */}
      <div className="relative aspect-[1.5/1] overflow-hidden bg-brand-stone/10">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={studio.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-ivory to-brand-bronze/20">
            <Building2 className="h-10 w-10 text-brand-bronze/50" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur ${
            studio.isPublished
              ? "border-emerald-200/60 bg-white/95 text-emerald-700"
              : "border-brand-border bg-white/95 text-brand-stone"
          }`}
        >
          {studio.isPublished ? (
            <Eye className="h-3 w-3" />
          ) : (
            <EyeOff className="h-3 w-3" />
          )}

          {studio.isPublished ? "Published" : "Draft"}
        </span>

        {studio.isFeatured && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-brand-charcoal/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
            <Sparkles className="h-3 w-3 text-brand-bronze-light" />
            Featured
          </span>
        )}

        {studio.category && (
          <span className="absolute bottom-3 left-3 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
            {studio.category}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight text-brand-charcoal transition-colors group-hover:text-brand-bronze">
              {studio.title}
            </h2>

            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-brand-stone">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-bronze" />

              <span className="truncate">
                {location || "Location not set"}
              </span>
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-lg font-bold text-brand-charcoal">
              {formatPrice(studio.price, studio.currency)}
            </p>

            <p className="mt-0.5 text-[11px] text-brand-stone">
              / {studio.priceUnit || "hour"}
            </p>
          </div>
        </div>

        {studio.description && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-brand-stone">
            {studio.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-brand-stone">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-brand-bronze" />
            {studio.capacity} {studio.capacity === 1 ? "guest" : "guests"}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Star
              className={`h-3.5 w-3.5 ${
                rating > 0
                  ? "fill-brand-bronze text-brand-bronze"
                  : "text-brand-stone/40"
              }`}
            />

            {rating > 0 ? rating.toFixed(1) : "New"}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-brand-border pt-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onEdit(studio)}
              className="h-10 rounded-xl border-brand-border bg-white px-3 text-xs font-semibold text-brand-charcoal hover:border-brand-bronze hover:bg-brand-ivory hover:text-brand-bronze"
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>

            <DeleteStudioDialog
              id={studio._id}
              title={studio.title}
              onDeleted={onDeleted}
            />
          </div>

          <Link
            href={`/studios/${studio._id}`}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-bronze transition-all hover:gap-2"
          >
            View
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
