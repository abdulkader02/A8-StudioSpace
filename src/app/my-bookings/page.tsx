import { headers } from "next/headers";
import { CalendarDays, LogIn } from "lucide-react";

import { getStudioCoverImage } from "@/lib/studio";
import { auth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
import type { TBooking } from "@/lib/type/booking";
import type { TStudio } from "@/lib/type/type";
import MyBookingsListCard from "@/components/booking/MyBookingsListCard";
import EmptyState from "@/components/shared/EmptyState";

type BookingsResponse =
  | TBooking[]
  | { bookings?: TBooking[]; data?: TBooking[] };

const normalizeBookings = (payload: unknown): TBooking[] => {
  if (Array.isArray(payload)) {
    return payload as TBooking[];
  }

  if (payload && typeof payload === "object") {
    const wrapped = payload as { bookings?: unknown; data?: unknown };

    if (Array.isArray(wrapped.bookings)) {
      return wrapped.bookings as TBooking[];
    }

    if (Array.isArray(wrapped.data)) {
      return wrapped.data as TBooking[];
    }
  }

  return [];
};

const formatLocation = (location?: TStudio["location"]) => {
  if (!location) return undefined;

  const formatted = [location.area, location.city]
    .filter(Boolean)
    .join(", ");

  return formatted || undefined;
};

const getStudios = async (): Promise<TStudio[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studios`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Unable to fetch studios.");
    }

    const data = (await response.json()) as TStudio[];

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("My Bookings Studios Error:", err);
    return [];
  }
};

const MyBookingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user?.email) {
    return (
      <main className="min-h-screen bg-brand-ivory px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <EmptyState
            icon={CalendarDays}
            eyebrow="Your bookings"
            title="Sign in to view your bookings"
            description="Your studio reservations, shoot dates, statuses, and receipts are tied to your StudioSpace account."
            action={{
              label: "Sign in to continue",
              href: "/login",
              icon: LogIn,
            }}
            secondaryAction={{
              label: "Browse studios",
              href: "/studios",
            }}
          />
        </div>
      </main>
    );
  }

  let bookings: TBooking[] = [];
  let error = "";

  // Start fetching studios at the same time as the bookings so we can
  // enrich each booking with its studio image and location.
  const studiosPromise = getStudios();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${encodeURIComponent(user.email)}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error("Unable to load your bookings. Please try again later.");
    }

    const data = (await response.json()) as BookingsResponse;

    bookings = normalizeBookings(data);
  } catch (err) {
    console.error("My Bookings Error:", err);

    error = getErrorMessage(
      err,
      "Unable to load your bookings. Please try again later.",
    );
  }

  const studios = await studiosPromise;
  const studioById = new Map(
    studios.map((studio) => [String(studio._id), studio])
  );

  bookings = bookings.map((booking) => {
    const studio = studioById.get(String(booking.studioId));

    return {
      ...booking,
      imageUrl: booking.imageUrl ?? getStudioCoverImage(studio),
      location: booking.location ?? formatLocation(studio?.location),
    };
  });

  return (
    <MyBookingsListCard
      initialBookings={bookings}
      error={error}
    />
  );
};

export default MyBookingsPage;
