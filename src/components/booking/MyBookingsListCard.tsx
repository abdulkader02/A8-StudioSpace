
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ReceiptText,
  XCircle,
  LoaderCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import type { TBooking } from "@/lib/type/booking";

type MyBookingsListProps = {
  initialBookings: TBooking[];
  error?: string;
};

export default function MyBookingsList({
  initialBookings,
  error,
}: MyBookingsListProps) {
  const [bookings, setBookings] = useState<TBooking[]>(initialBookings);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [receiptBooking, setReceiptBooking] = useState<TBooking | null>(null);

  const handleCancelBooking = async (bookingId: string) => {
    const booking = bookings.find((item) => item._id === bookingId);

    if (!booking) {
      toast.error("Booking not found.");
      return;
    }

    if (booking.status !== "Pending") {
      toast.error("Only pending bookings can be cancelled.");
      return;
    }

    setCancellingId(bookingId);

    try {
      const response = await fetch(
        `http://localhost:5000/booking/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to cancel the booking.");
      }

      setBookings((previousBookings) =>
        previousBookings.map((item) =>
          item._id === bookingId
            ? { ...item, status: "Cancelled" }
            : item
        )
      );

      toast.success(result.message || "Booking cancelled successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      toast.error(message);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusStyle = (status: TBooking["status"]) => {
    switch (status) {
      case "Pending":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "Confirmed":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "Completed":
        return "border-green-200 bg-green-50 text-green-700";

      case "Cancelled":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-7xl border-x border-gray-200/50 px-4 pt-8 pb-16 sm:px-6 sm:pt-10 sm:pb-20 lg:px-8 lg:pt-12 lg:pb-24">

        {/* Page Heading */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-bronze">
              <CalendarDays className="h-3.5 w-3.5" />
              Production Schedule
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              My Studio Bookings
            </h1>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Track reservation statuses, cancellation requests, and shoot times
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-brand-bronze px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-bronze/90 focus:outline-none focus:ring-2 focus:bg-brand-bronze sm:self-center"
          >
            Explore More Studios
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Error Message */}
        {error && bookings.length > 0 && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {error}
          </div>
        )}

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center shadow-sm sm:px-8 sm:py-16">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <CalendarDays className="h-7 w-7 text-gray-400" />
            </div>

            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
              {error ? "Could not load bookings" : "No bookings yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              {error || "Your studio bookings will appear here."}
            </p>
          </div>
        ) : (
          /* Booking Cards */
          <div className="space-y-3 sm:space-y-4">
            {bookings.map((booking) => {
              const isCancelling = cancellingId === booking._id;
              const canCancel = booking.status === "Pending";

              return (
                <article
                  key={booking._id}
                  className="group overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm transition hover:border-gray-300 hover:shadow-md sm:rounded-2xl"
                >
                  <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4 md:flex-row md:items-center">

                    {/* Studio Image */}
                    <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-44 md:h-24 md:w-28 lg:h-28 lg:w-32">
                      {booking.imageUrl ? (
                        <Image
                          src={booking.imageUrl}
                          alt={booking.studioTitle}
                          fill
                          sizes="(max-width: 768px) 100vw, 128px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                          No studio image
                        </div>
                      )}
                    </div>

                    {/* Booking Details */}
                    <div className="min-w-0 flex-1">

                      {/* Title and Status */}
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                          {booking.status}
                        </span>

                        <span
                          title={booking._id}
                          className="max-w-full truncate text-xs text-gray-400"
                        >
                          ID: #{booking._id}
                        </span>
                      </div>

                      <h2 className="mt-1.5 break-words text-base font-semibold leading-snug text-gray-900 sm:text-lg">
                        {booking.studioTitle}
                      </h2>

                      {/* Booking Information */}
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 sm:text-sm">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-brand-bronze" />
                          <span>{formatDate(booking.date)}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-brand-bronze" />
                          <span>
                            {booking.startTime} · {booking.duration} hours
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 shrink-0 text-brand-bronze" />
                          <span>{booking.crewCount} people</span>
                        </div>
                      </div>

                      {booking.location && (
                        <p className="mt-2 flex min-w-0 items-start gap-1.5 text-xs leading-5 text-gray-500 sm:text-sm">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-bronze" />
                          <span className="break-words">{booking.location}</span>
                        </p>
                      )}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex shrink-0 flex-col gap-3 border-t border-gray-100 pt-3 sm:flex-row sm:items-center sm:justify-between md:w-44 md:flex-col md:items-end md:justify-center md:border-l md:border-t-0 md:pl-4 md:pt-0 lg:w-52">
                      <div className="md:text-right">
                        <p className="text-xs text-gray-400">
                          Total amount
                        </p>

                        <p className="mt-0.5 text-xl font-bold tracking-tight text-brand-bronze sm:text-2xl">
                          {formatCurrency(booking.total, booking.currency)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        <button
                          type="button"
                          onClick={() => setReceiptBooking(booking)}
                          className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:text-sm"
                        >
                          <ReceiptText className="h-3.5 w-3.5" />
                          Receipt
                        </button>

                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={isCancelling}
                            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                          >
                            {isCancelling ? (
                              <>
                                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3.5 w-3.5" />
                                Cancel Booking
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Receipt Modal */}
        {receiptBooking && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-5"
            onClick={() => setReceiptBooking(null)}
          >
            <div
              className="my-auto w-full max-w-md rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    StudioSpace
                  </p>

                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
                    Booking Receipt
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setReceiptBooking(null)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                  aria-label="Close receipt"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              {/* Receipt Details */}
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="shrink-0 text-gray-500">Studio</span>
                  <span className="break-words text-right font-medium text-gray-900">
                    {receiptBooking.studioTitle}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="shrink-0 text-gray-500">Booking ID</span>
                  <span className="break-all text-right font-medium text-gray-900">
                    {receiptBooking._id}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Date</span>
                  <span className="text-right font-medium text-gray-900">
                    {formatDate(receiptBooking.date)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Time</span>
                  <span className="text-right font-medium text-gray-900">
                    {receiptBooking.startTime}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Duration</span>
                  <span className="text-right font-medium text-gray-900">
                    {receiptBooking.duration} hours
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                      receiptBooking.status
                    )}`}
                  >
                    {receiptBooking.status}
                  </span>
                </div>

                {/* Receipt Amounts */}
                <div className="space-y-3 border-t border-dashed border-gray-200 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-right font-medium text-gray-900">
                      {formatCurrency(
                        receiptBooking.subtotal,
                        receiptBooking.currency
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">Security deposit</span>
                    <span className="text-right font-medium text-gray-900">
                      {formatCurrency(
                        receiptBooking.deposit,
                        receiptBooking.currency
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-3.5">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-right text-lg font-bold text-gray-900">
                      {formatCurrency(
                        receiptBooking.total,
                        receiptBooking.currency
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setReceiptBooking(null)}
                className="mt-6 min-h-11 w-full rounded-xl bg-brand-charcoal px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
