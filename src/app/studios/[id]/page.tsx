import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import type { TStudio } from "@src/lib/type/type";
import { getErrorMessage } from "@/lib/utils";

import {
  MapPin,
  Users,
  Star,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  ArrowLeft,
  ShieldCheck,
  CalendarDays,
  DollarSign,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import EmptyState from "@/components/shared/EmptyState";

import {
  StudioGallery,
  HostDetails,
  StudioReviews,
  BookingModal,
} from "@/components/booking/BookingCard";

export const dynamic = "force-dynamic";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
).replace(/\/+$/, "");

const formatPrice = (amount: number) => amount.toLocaleString("en-US");

function CurrencyMark({ currency }: { currency: string }) {
  return currency === "USD" ? (
    <DollarSign className="h-4 w-4 text-brand-bronze" />
  ) : (
    <span className="text-xs font-semibold text-brand-bronze">{currency}</span>
  );
}

type StudioResult = { studio: TStudio } | { error: string };

/**
 * GET /studio/:id
 *
 * The backend answers 404 for a missing studio and 400 for a malformed id;
 * both mean "this page does not exist". Any other failure (API offline, 5xx)
 * is rendered as a friendly message instead of a crash page.
 */
async function getStudio(id: string): Promise<StudioResult> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/studio/${id}`, {
      cache: "no-store",
    });
  } catch (error) {
    return {
      error: getErrorMessage(error, "We couldn't load this studio right now."),
    };
  }

  if (response.status === 404 || response.status === 400) {
    notFound();
  }

  if (!response.ok) {
    return { error: "We couldn't load this studio right now." };
  }

  let studio: TStudio;

  try {
    studio = (await response.json()) as TStudio;
  } catch {
    return { error: "The StudioSpace API returned an invalid response." };
  }

  if (!studio || typeof studio !== "object" || !studio.title) {
    notFound();
  }

  return { studio };
}

export default async function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getStudio(id);

  if ("error" in result) {
    return <StudioLoadError message={result.error} />;
  }

  const { studio } = result;

  const studioId = String(studio._id ?? id);

  const location = [studio.location?.area, studio.location?.city]
    .filter(Boolean)
    .join(", ");

  const price =
    typeof studio.price === "number" && Number.isFinite(studio.price)
      ? studio.price
      : 0;

  const rating =
    typeof studio.rating === "number" && Number.isFinite(studio.rating)
      ? studio.rating
      : 0;

  const capacity =
    typeof studio.capacity === "number" && Number.isFinite(studio.capacity)
      ? studio.capacity
      : 0;

  const deposit =
    typeof studio.securityDeposit === "number" &&
    Number.isFinite(studio.securityDeposit)
      ? studio.securityDeposit
      : 0;

  const total = price + deposit;

  const currency = studio.currency ?? "USD";
  const priceUnit = studio.priceUnit ?? "hour";

  const amenities = studio.amenities ?? [];

  return (
    <main className="min-h-screen bg-brand-ivory text-brand-charcoal">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-brand-border/80 bg-brand-ivory/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/studios"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-stone transition-colors hover:text-brand-charcoal"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-white transition-colors group-hover:border-brand-bronze">
              <ArrowLeft className="h-4 w-4" />
            </span>
            Back to studios
          </Link>

          <Badge
            variant="outline"
            className="border-brand-bronze/30 bg-brand-bronze-light/30 px-3 py-1.5 text-brand-charcoal"
          >
            {studio.category}
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Studio heading */}
        <section className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-brand-stone">
              <span>StudioSpace</span>
              <span className="text-brand-bronze">/</span>

              <Link
                href="/studios"
                className="transition-colors hover:text-brand-bronze"
              >
                Studios
              </Link>

              <span className="text-brand-bronze">/</span>
              <span>{studio.category}</span>
            </div>

            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl lg:text-5xl">
              {studio.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-brand-stone">
              {location && (
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-bronze" />
                  {location}
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-brand-bronze text-brand-bronze" />

                <strong className="text-brand-charcoal">
                  {rating > 0 ? rating.toFixed(1) : "New"}
                </strong>

                <span>{rating > 0 ? "Rating" : "No ratings yet"}</span>
              </span>
            </div>
          </div>

          {/* Header price */}
          <div className="flex items-center">
            <div className="flex items-center gap-1 rounded-full bg-brand-charcoal px-4 py-2 text-sm font-semibold text-white">
              <CurrencyMark currency={currency} />

              {formatPrice(price)}

              <span className="ml-1 font-normal text-white/70">
                / {priceUnit}
              </span>
            </div>
          </div>
        </section>

        {/* Main layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left content */}
          <div className="space-y-8 lg:col-span-8">
            {/* Studio Gallery */}
            <StudioGallery studio={studio} />

            {/* Studio information */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetaItem
                label="Capacity"
                value={`${capacity} guests`}
                icon={<Users className="h-5 w-5" />}
              />

              <MetaItem
                label="Security deposit"
                value={`${currency} ${formatPrice(deposit)}`}
                icon={<ShieldCheck className="h-5 w-5" />}
              />

              <MetaItem
                label="Price unit"
                value={`Per ${priceUnit}`}
                icon={<Clock className="h-5 w-5" />}
              />

              <MetaItem
                label="Category"
                value={studio.category}
                icon={<ImageIcon className="h-5 w-5" />}
              />
            </section>

            {/* Overview */}
            {studio.description && (
              <Card className="overflow-hidden rounded-[24px] border-brand-border bg-white shadow-brand">
                <CardHeader className="pb-3">
                  <SectionLabel>About this space</SectionLabel>

                  <CardTitle className="text-xl font-semibold tracking-tight text-brand-charcoal sm:text-2xl">
                    Studio overview
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="max-w-3xl whitespace-pre-line text-sm leading-8 text-brand-stone sm:text-base">
                    {studio.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <Card className="rounded-[24px] border-brand-border bg-white shadow-brand">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-2">
                    <SectionLabel>Studio facilities</SectionLabel>

                    <CardTitle className="text-xl font-semibold tracking-tight text-brand-charcoal sm:text-2xl">
                      Equipment & Amenities
                    </CardTitle>
                  </div>

                  <span className="rounded-full bg-brand-ivory px-3 py-1.5 text-xs font-semibold text-brand-stone">
                    {amenities.length} items
                  </span>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {amenities.map((amenity) => (
                      <AmenityChip key={amenity} name={amenity} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Host Details */}
            <HostDetails host={studio.host} />

            {/* Reviews */}
            <StudioReviews reviews={studio.reviews} rating={rating} />
          </div>

          {/* Right booking column */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <BookingCard
                price={price}
                rating={rating}
                deposit={deposit}
                total={total}
                currency={currency}
                priceUnit={priceUnit}
                studioId={studioId}
                studioTitle={studio.title}
                capacity={capacity}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

// Shown when the backend is unreachable or returns an unexpected error.
function StudioLoadError({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-ivory px-4 py-16 text-brand-charcoal">
      <div className="w-full max-w-lg">
        <EmptyState
          tone="error"
          icon={ImageIcon}
          eyebrow="Studio unavailable"
          title="Unable to load this studio"
          description={message}
          action={{
            label: "Back to studios",
            href: "/studios",
            icon: ArrowLeft,
          }}
          secondaryAction={{
            label: "Return home",
            href: "/",
          }}
        />
      </div>
    </main>
  );
}

// Section label
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-bronze">
      {children}
    </p>
  );
}

// Studio metadata
function MetaItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-brand">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-bronze-light/50 text-brand-bronze">
        {icon}
      </div>

      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-brand-stone">
        {label}
      </p>

      <p className="break-words text-sm font-semibold text-brand-charcoal">
        {value}
      </p>
    </div>
  );
}

// Amenities chip
function AmenityChip({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-ivory/50 px-4 py-3 transition-colors hover:border-brand-bronze/50">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-bronze-light/60 text-brand-bronze">
        <CheckCircle2 className="h-4 w-4" />
      </span>

      <span className="text-sm font-medium text-brand-charcoal">{name}</span>
    </div>
  );
}

// Original Booking Card
function BookingCard({
  price,
  rating,
  deposit,
  total,
  currency,
  priceUnit,
  studioId,
  studioTitle,
  capacity,
}: {
  price: number;
  rating: number;
  deposit: number;
  total: number;
  currency: string;
  priceUnit: string;
  studioId: string;
  studioTitle: string;
  capacity: number;
}) {
  return (
    <Card className="overflow-hidden rounded-[28px] border-brand-border bg-white shadow-brand">
      {/* Booking header */}
      <div className="bg-brand-dark p-6 text-white sm:p-7">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
          Booking details
        </p>

        <div className="mt-4 flex items-center gap-1">
          <CurrencyMark currency={currency} />

          <h2 className="text-3xl font-semibold tracking-tight">
            {formatPrice(price)}
          </h2>

          <span className="pb-1 text-sm text-white/50">/ {priceUnit}</span>
        </div>

        <p className="mt-1 text-xs text-white/50">{currency}</p>

        <div className="mt-4 flex items-center gap-2">
          <Star className="h-4 w-4 fill-brand-bronze text-brand-bronze" />

          <span className="text-sm font-semibold">
            {rating > 0 ? rating.toFixed(1) : "New"}
          </span>

          <span className="text-xs text-white/50">
            {rating > 0 ? "Studio rating" : "No ratings yet"}
          </span>
        </div>
      </div>

      <CardContent className="space-y-6 p-6 sm:p-7">
        {/* Booking information */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-brand-stone">
              <CalendarDays className="h-4 w-4" />
              Booking duration
            </span>

            <span className="text-sm font-semibold text-brand-charcoal">
              1 {priceUnit}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-brand-stone">
              <ShieldCheck className="h-4 w-4" />
              Security deposit
            </span>

            <span className="flex items-center gap-1 text-sm font-semibold text-brand-charcoal">
              <CurrencyMark currency={currency} />
              {formatPrice(deposit)}
            </span>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="space-y-3 border-t border-dashed border-brand-border pt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-stone">Studio price</span>

            <span className="flex items-center gap-1 font-medium text-brand-charcoal">
              <CurrencyMark currency={currency} />
              {formatPrice(price)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-stone">Security deposit</span>

            <span className="flex items-center gap-1 font-medium text-brand-charcoal">
              <CurrencyMark currency={currency} />
              {formatPrice(deposit)}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-brand-border pt-4">
            <span className="font-semibold text-brand-charcoal">
              Estimated total
            </span>

            <span className="flex items-center gap-1 text-xl font-bold text-brand-charcoal">
              <CurrencyMark currency={currency} />
              {formatPrice(total)}
            </span>
          </div>

          <p className="text-[11px] leading-relaxed text-brand-stone">
            Estimated amount for one booking unit, including the listed security
            deposit. Confirm the final amount on the booking page.
          </p>
        </div>

        {/* Single Booking Modal CTA */}
        <BookingModal
          studioId={studioId}
          studioTitle={studioTitle}
          price={price}
          deposit={deposit}
          currency={currency}
          priceUnit={priceUnit}
          capacity={capacity}
        />

        <p className="text-center text-[11px] leading-relaxed text-brand-stone">
          Review your booking details before proceeding.
        </p>
      </CardContent>
    </Card>
  );
}
