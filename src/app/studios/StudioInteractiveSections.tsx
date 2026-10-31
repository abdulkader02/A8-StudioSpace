
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import type { TStudio } from "@src/lib/type/type";
import { toast } from "sonner";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock,
  Image as ImageIcon,
  Mail,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Section Label
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-bronze">
      {children}
    </p>
  );
}

// Gallery Carousel
export function StudioGallery({ studio }: { studio: TStudio }) {
  const images = Array.from(
    new Set(
      (studio.imageUrls ?? []).filter(
        (image): image is string =>
          typeof image === "string" && image.trim().length > 0
      )
    )
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const previousImage = () => {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const nextImage = () => {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  const activeImage = images[activeIndex];

  return (
    <section>
      <div className="group relative aspect-[16/10] min-h-[280px] overflow-hidden rounded-[24px] border border-brand-border bg-brand-ivory-dark shadow-brand sm:rounded-[32px]">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={`${studio.title} - Image ${activeIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center text-brand-stone">
              <ImageIcon className="mx-auto mb-3 h-12 w-12 opacity-40" />
              <p className="text-sm">No studio image available</p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

        <div className="absolute bottom-5 left-5 flex items-center gap-2 text-white sm:bottom-7 sm:left-7">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md">
            <ImageIcon className="h-4 w-4" />
          </span>

          <span className="text-sm font-medium">
            {activeImage ? "Studio preview" : "Image unavailable"}
          </span>
        </div>

        <div className="absolute right-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-charcoal backdrop-blur-md">
          {studio.category}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousImage}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/60"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/60"
            >
              <ArrowRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-5 right-5 flex items-center gap-1.5 sm:bottom-7 sm:right-7">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Show image ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    activeIndex === index
                      ? "w-6 bg-white"
                      : "w-2 bg-white/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// Host Details
export function HostDetails({ host }: { host?: TStudio["host"] }) {
  if (!host || (!host.name && !host.email && !host.bio && !host.image)) {
    return null;
  }

  return (
    <Card className="rounded-[24px] border-brand-border bg-white shadow-brand">
      <CardHeader className="space-y-2">
        <SectionLabel>Your space host</SectionLabel>
        <CardTitle className="text-xl font-semibold text-brand-charcoal">
          Meet your host
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-bronze-light text-brand-bronze">
            {host.image ? (
              <Image
                src={host.image}
                alt={host.name ?? "Host"}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold">
                {host.name?.charAt(0).toUpperCase() ?? "H"}
              </span>
            )}
          </div>

          <div className="min-w-0 space-y-1">
            <h3 className="font-semibold text-brand-charcoal">
              {host.name ?? "Studio Host"}
            </h3>

            {host.email && (
              <a
                href={`mailto:${host.email}`}
                className="flex items-center gap-2 break-all text-sm text-brand-stone transition-colors hover:text-brand-bronze"
              >
                <Mail className="h-4 w-4 shrink-0 text-brand-bronze" />
                {host.email}
              </a>
            )}

            {host.bio && (
              <p className="pt-2 text-sm leading-7 text-brand-stone">
                {host.bio}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Reviews
export function StudioReviews({
  reviews,
  rating,
}: {
  reviews?: TStudio["reviews"];
  rating: number;
}) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <Card className="rounded-[24px] border-brand-border bg-white shadow-brand">
      <CardHeader className="space-y-2">
        <SectionLabel>Guest feedback</SectionLabel>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-xl font-semibold text-brand-charcoal sm:text-2xl">
            Reviews & Ratings
          </CardTitle>

          <div className="flex items-center gap-1 rounded-full bg-brand-bronze-light/50 px-3 py-1.5 text-sm font-semibold text-brand-charcoal">
            <Star className="h-4 w-4 fill-brand-bronze text-brand-bronze" />
            {rating > 0 ? rating.toFixed(1) : "New"}

            <span className="font-normal text-brand-stone">
              ({reviews.length})
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {reviews.map((review, index) => (
          <div
            key={review._id ?? `${review.name}-${index}`}
            className="border-b border-brand-border pb-5 last:border-0 last:pb-0"
          >
            <div className="flex items-start gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-bronze-light text-sm font-semibold text-brand-bronze">
                {review.image ? (
                  <Image
                    src={review.image}
                    alt={review.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                ) : (
                  review.name.charAt(0).toUpperCase()
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-brand-charcoal">
                    {review.name}
                  </h4>

                  {review.createdAt && (
                    <span className="text-xs text-brand-stone">
                      {new Date(review.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= review.rating
                          ? "fill-brand-bronze text-brand-bronze"
                          : "text-brand-border"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-3 text-sm leading-7 text-brand-stone">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Booking Modal
export function BookingModal({
  studioId,
  studioTitle,
  price,
  deposit,
  currency,
  priceUnit = "hour",
  buttonText = "Book Workspace Now",
  buttonClassName,
}: {
  studioId: string;
  studioTitle: string;
  price: number;
  deposit: number;
  currency: string;
  priceUnit?: string;
  buttonText?: string;
  buttonClassName?: string;
}) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shootDate, setShootDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("14:00");
  const [crewCount, setCrewCount] = useState(1);
  const [gearNotes, setGearNotes] = useState("");

  const formatPrice = (amount: number) => amount.toLocaleString("en-US");

  const today = new Date().toISOString().split("T")[0];

  const calculateHours = () => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    let diffMinutes = endMinutes - startMinutes;

    if (diffMinutes <= 0) diffMinutes += 24 * 60;

    return diffMinutes / 60;
  };

  const hours = calculateHours();
  const lineTotal = price * hours;
  const estimatedTotal = lineTotal + deposit;

  const formatTime12 = (time24: string) => {
    const [h, m] = time24.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;

    return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";

    return new Date(dateStr + "T00:00:00")
      .toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
  };

  const inputClasses =
    "flex h-11 w-full items-center justify-between rounded-xl border border-brand-border bg-brand-ivory px-3 py-2 text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-bronze focus:border-transparent";

  const handleBookingConfirm = () => {
    if (isSubmitting) return;

    if (!shootDate) {
      toast.error("Please select a booking date.");
      return;
    }

    setIsSubmitting(true);
    setIsOpen(false);

    toast.success("Booking request submitted successfully!")

    router.push("/my-bookings");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setShootDate(today);
          setIsOpen(true);
        }}
        className={
          buttonClassName ??
          "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-bronze px-5 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-bronze-hover"
        }
      >
        {buttonText}
        <ArrowUpRight className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            className="relative my-auto flex w-full max-w-lg flex-col overflow-hidden rounded-[28px] border border-brand-border bg-white shadow-2xl"
          >
            <div className="bg-brand-dark p-6 text-white sm:p-7">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close booking modal"
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-bronze/20 text-brand-bronze">
                <CalendarDays className="h-5 w-5" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-bronze">
                Reserve Creative Slot
              </p>

              <h2
                id="booking-modal-title"
                className="mt-2 pr-8 text-2xl font-semibold"
              >
                {studioTitle}
              </h2>

              <p className="mt-1 text-xs text-white/70">
                Rate: {currency} {formatPrice(price)}/{priceUnit} &bull;
                Deposit: {currency} {formatPrice(deposit)}
              </p>

              <p className="mt-2 text-sm text-white/60">
                Confirm your shoot details before sending the booking request.
              </p>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-6 sm:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-stone">
                  Selected workspace
                </p>

                <h3 className="mt-2 text-lg font-semibold text-brand-charcoal">
                  {studioTitle}
                </h3>
              </div>

              {/* Shoot Date */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-stone">
                  Shoot Date
                </label>

                <input
                  type="date"
                  value={shootDate}
                  onChange={(e) => setShootDate(e.target.value)}
                  min={today}
                  className={inputClasses}
                />

                {shootDate && (
                  <p className="text-xs text-brand-stone">
                    {formatDateDisplay(shootDate)}
                  </p>
                )}
              </div>

              {/* Start / End Time */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-stone">
                    Start Time
                  </label>

                  <div className="relative">
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className={inputClasses}
                    />
                    <div className="pointer-events-none absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-white text-brand-bronze">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <span className="text-xs text-brand-stone">
                    {formatTime12(startTime)}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-stone">
                    End Time
                  </label>

                  <div className="relative">
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className={inputClasses}
                    />
                    <div className="pointer-events-none absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-white text-brand-bronze">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <span className="text-xs text-brand-stone">
                    {formatTime12(endTime)}
                  </span>
                </div>
              </div>

              {/* Crew Count */}
              <div className="space-y-2">
                <label className="flex justify-between gap-2 text-xs font-semibold uppercase tracking-wider text-brand-stone">
                  <span>Expected Crew / Talent Count</span>
                  <span>(Max 30)</span>
                </label>

                <input
                  type="number"
                  min={1}
                  max={30}
                  value={crewCount}
                  onChange={(e) => {
                    const value = Math.min(
                      30,
                      Math.max(1, Number(e.target.value) || 1)
                    );
                    setCrewCount(value);
                  }}
                  className={inputClasses}
                />
              </div>

              {/* Gear Notes */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-stone">
                  Production Requirements / Gear Notes
                </label>

                <span className="text-xs text-brand-stone">(Optional)</span>

                <textarea
                  value={gearNotes}
                  onChange={(e) => setGearNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. Bringing lighting equipment..."
                  className="flex h-28 w-full resize-none rounded-xl border border-brand-border bg-brand-ivory px-3 py-2 text-sm text-brand-charcoal focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-bronze"
                />
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 rounded-2xl bg-brand-ivory/70 p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-brand-stone">
                    {currency} {formatPrice(price)} &times; {hours} shoot hours
                  </span>

                  <span className="font-semibold text-brand-charcoal">
                    {currency} {formatPrice(lineTotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-brand-stone">
                    Refundable Security Deposit
                  </span>

                  <span className="font-semibold text-brand-charcoal">
                    {currency} {formatPrice(deposit)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-brand-border pt-3">
                  <span className="font-semibold text-brand-charcoal">
                    Total Estimated Cost
                  </span>

                  <span className="text-lg font-bold text-brand-charcoal">
                    {currency} {formatPrice(estimatedTotal)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 rounded-xl border border-brand-bronze/20 bg-brand-bronze-light/30 p-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-bronze" />

                <p className="text-xs leading-6 text-brand-stone">
                  The final booking amount and availability will need to be
                  confirmed on the booking page.
                </p>
              </div>

              {/* Booking Actions */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="flex h-12 w-full items-center justify-center rounded-xl border border-brand-border px-4 text-sm font-semibold text-brand-charcoal transition hover:bg-brand-ivory sm:w-1/2"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleBookingConfirm}
                  disabled={isSubmitting}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-bronze px-4 text-sm font-semibold text-white transition hover:bg-brand-bronze-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-1/2"
                >
                  Confirm Booking Request
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
