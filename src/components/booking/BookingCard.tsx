"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { CalendarDays, Clock, Star, UserRound, Users } from "lucide-react";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import type { TBookingPayload } from "@/lib/type/booking";
import type { TStudio } from "@src/lib/type/type";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ----------------------------------
   Studio Gallery
---------------------------------- */

export function StudioGallery({ studio }: { studio: TStudio }) {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = studio.imageUrls?.filter(Boolean) ?? [];

  if (images.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl bg-brand-stone/10 text-sm text-muted-foreground">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative h-[350px] overflow-hidden rounded-2xl bg-brand-stone/10 md:h-[480px]">
        <Image
          src={images[selectedImage]}
          alt={studio.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 70vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={selectedImage === index}
              className={`relative h-20 overflow-hidden rounded-xl border-2 transition ${
                selectedImage === index
                  ? "border-brand-bronze"
                  : "border-transparent opacity-75 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`${studio.title} image ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------
   Host Details
---------------------------------- */

type HostDetailsProps = {
  host?: TStudio["host"];
};

export function HostDetails({ host }: HostDetailsProps) {
  const hostName = host?.name || "Studio Host";

  return (
    <section className="rounded-2xl border border-border p-5">
      <h2 className="mb-4 text-lg font-semibold">Meet your host</h2>

      <div className="flex items-start gap-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-stone/30">
          {host?.image ? (
            <Image
              src={host.image}
              alt={hostName}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <UserRound className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-medium">{hostName}</h3>

          {host?.email && (
            <p className="mt-1 break-all text-sm text-muted-foreground">
              {host.email}
            </p>
          )}

          {host?.bio && (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {host.bio}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------
   Studio Reviews
---------------------------------- */

type StudioReviewsProps = {
  reviews?: TStudio["reviews"];
  rating?: number;
};

export function StudioReviews({ reviews = [], rating }: StudioReviewsProps) {
  const averageRating =
    rating ??
    (reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Guest reviews</h2>

        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-brand-bronze text-brand-bronze" />

          <span className="font-semibold">{averageRating.toFixed(1)}</span>

          <span className="text-sm text-muted-foreground">
            ({reviews.length} reviews)
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="rounded-xl bg-brand-stone/10 p-5 text-sm text-muted-foreground">
          No reviews have been added yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review, index) => (
            <article
              key={review._id || `${review.name}-${index}`}
              className="rounded-2xl border border-border p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium">{review.name}</h3>

                  {review.createdAt && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-brand-bronze text-brand-bronze" />

                  <span className="text-sm font-medium">{review.rating}</span>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {review.comment}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/* ----------------------------------
   Booking Modal
---------------------------------- */

type BookingModalProps = {
  studioId: string;
  studioTitle: string;
  price: number;
  deposit: number;
  currency: string;
  priceUnit: string;
};

export function BookingModal({
  studioId,
  studioTitle,
  price,
  deposit,
  currency,
  priceUnit,
}: BookingModalProps) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("1");
  const [crewCount, setCrewCount] = useState("1");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedDuration = Number(duration);
  const parsedCrewCount = Number(crewCount);

  const subtotal =
    Number.isFinite(parsedDuration) && parsedDuration > 0
      ? price * parsedDuration
      : 0;

  const total = subtotal + deposit;

  const today = new Date().toISOString().split("T")[0];

  /* ----------------------------------
     Handle Booking Form Submit
  ---------------------------------- */

  const handleBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      toast.error("Please sign in to book this studio.");
      router.push("/login");
      return;
    }

    if (!date || !startTime) {
      toast.error("Please select a date and start time.");
      return;
    }

    if (
      !Number.isFinite(parsedDuration) ||
      parsedDuration < 1 ||
      !Number.isInteger(parsedDuration) ||
      !Number.isFinite(parsedCrewCount) ||
      parsedCrewCount < 1 ||
      !Number.isInteger(parsedCrewCount)
    ) {
      toast.error("Please enter valid booking details.");
      return;
    }

    if (date < today) {
      toast.error("Please select today or a future date.");
      return;
    }

    try {
      setIsSubmitting(true);
      const data: TBookingPayload = {
        studioId,
        studioTitle,
        date,
        startTime,
        duration: parsedDuration,
        crewCount: parsedCrewCount,
        notes,
        price,
        deposit,
        subtotal,
        total,
        currency,
        priceUnit,
        user: {
          name: user.name,
          email: user.email,
        },
      };

      const res = await fetch("http://localhost:5000/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const bookingRes = await res.json();

      if (!res.ok) {
        throw new Error(bookingRes.message || "Booking failed.");
      }

      toast.success("Booking request submitted successfully!");

      setOpen(false);

      router.push("/my-bookings");
    } catch (error) {
      console.error("Booking error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        className="w-full bg-brand-charcoal text-brand-ivory hover:bg-brand-charcoal/90"
        disabled={isPending}
        onClick={() => setOpen(true)}
      >
        {isPending ? "Loading..." : "Book this studio"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Book this studio</DialogTitle>

            <DialogDescription>
              Complete the details below to request your booking.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBooking} className="space-y-5">
            <div className="rounded-xl bg-brand-stone/10 p-4">
              <h3 className="font-semibold">{studioTitle}</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {currency} {price} / {priceUnit}
              </p>
            </div>

            {/* Booking Date */}
            <div className="space-y-2">
              <Label htmlFor="booking-date">
                <CalendarDays className="mr-2 inline h-4 w-4" />
                Booking date
              </Label>

              <Input
                id="booking-date"
                name="bookingDate"
                type="date"
                min={today}
                required
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="booking-time">
                <Clock className="mr-2 inline h-4 w-4" />
                Start time
              </Label>

              <Input
                id="booking-time"
                name="startTime"
                type="time"
                required
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </div>

            {/* Duration & Crew Count */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="booking-duration">Duration ({priceUnit})</Label>

                <Input
                  id="booking-duration"
                  name="duration"
                  type="number"
                  min={1}
                  step={1}
                  required
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-crew">
                  <Users className="mr-2 inline h-4 w-4" />
                  Crew count
                </Label>

                <Input
                  id="booking-crew"
                  name="crewCount"
                  type="number"
                  min={1}
                  step={1}
                  required
                  value={crewCount}
                  onChange={(event) => setCrewCount(event.target.value)}
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="booking-notes">Additional notes</Label>

              <Textarea
                id="booking-notes"
                name="notes"
                placeholder="Tell the host about your requirements..."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
              />
            </div>

            {/* Price Summary */}
            <div className="space-y-3 rounded-xl border border-border p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {currency} {price} × {duration || 0} {priceUnit}
                </span>

                <span>
                  {currency} {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Security deposit</span>

                <span>
                  {currency} {deposit.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>

                  <span>
                    {currency} {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || isPending}
              className="w-full bg-brand-bronze text-white hover:bg-brand-bronze/90"
            >
              {isSubmitting ? "Submitting..." : "Confirm booking"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
