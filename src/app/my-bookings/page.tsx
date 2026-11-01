import Link from "next/link";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import type { TBooking } from "@/lib/type/booking";
import type { TStudio } from "@/lib/type/type";
import MyBookingsListCard from "@/components/booking/MyBookingsListCard";

type StudiosResponse =
  | TStudio[]
  | { data?: TStudio[]; studios?: TStudio[] };

const formatLocation = (location?: TStudio["location"]) => {
  if (!location) return undefined;

  const formatted = [location.area, location.city]
    .filter(Boolean)
    .join(", ");

  return formatted || undefined;
};

const getStudios = async (): Promise<TStudio[]> => {
  try {
    const res = await fetch("http://localhost:5000/studios", {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data: StudiosResponse = await res.json();

    return Array.isArray(data)
      ? data
      : (data.studios ?? data.data ?? []);
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
      <main className="min-h-screen bg-brand-ivory px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-brand-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-brand-charcoal">
            Please sign in
          </h1>

          <p className="mt-2 text-brand-stone">
            Sign in to view your bookings.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand-bronze px-6 text-sm font-semibold text-white transition hover:bg-brand-bronze-hover"
          >
            Sign in to continue
          </Link>
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
    const res = await fetch(
      `http://localhost:5000/my-bookings/${(
        user.email
      )}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch bookings.");
    }

    const data: TBooking[] = await res.json();

    bookings = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("My Bookings Error:", err);

    error =
      "Unable to load your bookings. Please try again later.";
  }

  const studios = await studiosPromise;
  const studioById = new Map(
    studios.map((studio) => [String(studio._id), studio])
  );

  bookings = bookings.map((booking) => {
    const studio = studioById.get(String(booking.studioId));

    return {
      ...booking,
      imageUrl:
        booking.imageUrl ??
        studio?.imageUrls?.find((image) => Boolean(image)),
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
