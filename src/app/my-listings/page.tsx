"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  LogIn,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";

import EditStudioDialog from "@/components/studio/EditStudioDialog";
import MyListing from "@/components/studio/MyListingCard";
import { authClient } from "@/lib/auth-client";

import type { TStudio } from "@/lib/type/type";

type ListingStudio = TStudio & {
  name?: string;
  email?: string;
};

type StudiosResponse =
  | ListingStudio[]
  | { data?: ListingStudio[]; studios?: ListingStudio[] };

const getOwnerEmail = (studio: ListingStudio) =>
  (
    studio.host?.email ??
    studio.email ??
    ""
  ).toLowerCase();

export default function MyListingsPage() {
  // Get the logged-in user's session
  const { data: session, isPending } = authClient.useSession();

const user = session?.user;

  const [studios, setStudios] = useState<ListingStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [search, setSearch] = useState("");

  const [editTarget, setEditTarget] = useState<TStudio | null>(
    null
  );

  useEffect(() => {
    let active = true;

    const loadStudios = async () => {
      // Wait until Better Auth finishes checking the session
      if (isPending) return;

      if (!user?.email) {
        if (active) {
          setFetchError("Please log in to view your listings.");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setFetchError("");

        const response = await fetch(
         `http://localhost:5000/my-bookings/${(
        user.email
      )}`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data: StudiosResponse = await response.json();

        const result = Array.isArray(data)
          ? data
          : (data.studios ?? data.data ?? []);

        if (active) {
          setStudios(result);
          setFetchError("");
        }
      } catch (error) {
        console.error("Failed to fetch user's studios:", error);

        if (active) {
          setFetchError(
            "Unable to load your listings. Please try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadStudios();

    return () => {
      active = false;
    };
  }, [user?.email, isPending, reloadToken]);

  const retryFetch = () => {
    setLoading(true);
    setReloadToken((current) => current + 1);
  };

  // The API returns every studio, so keep only the ones owned by
  // the signed-in host.
  const ownerStudios = studios.filter(
    (studio) =>
      getOwnerEmail(studio) === user?.email?.toLowerCase()
  );

  const searchText = search.trim().toLowerCase();

  const filteredStudios = ownerStudios.filter((studio) => {
    if (!searchText) return true;

    return (
      studio.title.toLowerCase().includes(searchText) ||
      studio.category.toLowerCase().includes(searchText) ||
      studio.location?.city?.toLowerCase().includes(searchText) ||
      studio.location?.area?.toLowerCase().includes(searchText)
    );
  });

  // Remove deleted studio from the page
  const handleStudioDeleted = (id: string) => {
    setStudios((current) =>
      current.filter((studio) => studio._id !== id)
    );
  };

  // Older listings store the host name/email at the root level,
  // so surface them as host details for the edit dialog.
  const handleEdit = (studio: TStudio) => {
    const listing = studio as ListingStudio;

    const host =
      studio.host ??
      (listing.name || listing.email
        ? { name: listing.name, email: listing.email }
        : undefined);

    setEditTarget(host ? { ...studio, host } : studio);
  };

  // Re-fetch after the edit dialog closes so changes appear
  // without a full page reload.
  const handleEditClose = () => {
    setEditTarget(null);
    setReloadToken((current) => current + 1);
  };

  const needsAuth = !isPending && !user?.email;
  const isInitialLoading = loading && ownerStudios.length === 0;

  return (
    <main className="min-h-screen bg-brand-ivory">
      {/* Header */}
      <section className="border-b border-brand-border bg-white/50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-bronze/25 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-bronze">
                <Sparkles className="h-3 w-3" />
                Host dashboard
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl">
                My{" "}
                <span className="font-serif italic text-brand-bronze">
                  Listings
                </span>
              </h1>

              <p className="mt-2 max-w-lg text-sm leading-6 text-brand-stone">
                Manage your creative spaces, update their details, or
                remove listings you no longer offer.
              </p>
            </div>

            <Link
              href="/add-studio"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-bronze px-5 text-sm font-semibold text-white transition hover:bg-brand-bronze-hover"
            >
              <Plus className="h-4 w-4" />
              Add a new space
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        {/* Search and count */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-bronze/10 text-brand-bronze">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-lg font-semibold text-brand-charcoal">
                Your spaces
              </p>

              <p className="text-xs text-brand-stone">
                {ownerStudios.length} total{" "}
                {ownerStudios.length === 1 ? "listing" : "listings"}
                {loading && ownerStudios.length > 0
                  ? " · refreshing..."
                  : ""}
              </p>
            </div>
          </div>

          <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-brand-border bg-white px-3 sm:max-w-xs">
            <Search className="h-4 w-4 shrink-0 text-brand-bronze" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your listings..."
              aria-label="Search your listings"
              className="w-full bg-transparent text-sm text-brand-charcoal outline-none placeholder:text-brand-stone/70"
            />
          </div>
        </div>

        {/* Loading */}
        {isInitialLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-brand-border bg-white"
              >
                <div className="aspect-[1.5/1] bg-brand-stone/10" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 rounded bg-brand-stone/10" />
                  <div className="h-3 w-1/2 rounded bg-brand-stone/10" />
                  <div className="h-9 rounded bg-brand-stone/10" />
                </div>
              </div>
            ))}
          </div>
        ) : fetchError ? (
          /* Error */
          <div className="rounded-2xl border border-brand-border bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-bronze/10">
              <Building2 className="h-7 w-7 text-brand-bronze" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-brand-charcoal">
              {needsAuth
                ? "Sign in to manage listings"
                : "Could not load listings"}
            </h2>

            <p className="mt-2 text-sm text-brand-stone">
              {fetchError}
            </p>

            {needsAuth ? (
              <Link
                href="/login"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-bronze px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-bronze-hover"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            ) : (
              <button
                type="button"
                onClick={retryFetch}
                className="mt-5 rounded-xl bg-brand-charcoal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-bronze"
              >
                Try again
              </button>
            )}
          </div>
        ) : filteredStudios.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-brand-border bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-bronze/10">
              <Building2 className="h-7 w-7 text-brand-bronze" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-brand-charcoal">
              {ownerStudios.length === 0
                ? "You haven't listed a space yet"
                : "No matching listings"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-stone">
              {ownerStudios.length === 0
                ? "Add your first creative space and manage it from this dashboard."
                : "Try a different search term or clear your search."}
            </p>

            {ownerStudios.length === 0 ? (
              <Link
                href="/add-studio"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-bronze px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-bronze-hover"
              >
                <Plus className="h-4 w-4" />
                Add your first space
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl bg-brand-charcoal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-bronze"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          /* Studio Cards */
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredStudios.map((studio) => (
              <MyListing
                key={studio._id}
                studio={studio}
                onEdit={handleEdit}
                onDeleted={handleStudioDeleted}
              />
            ))}
          </div>
        )}
      </section>

      {/* Edit Dialog */}
      {editTarget && (
        <EditStudioDialog
          studio={editTarget}
          onClose={handleEditClose}
        />
      )}
    </main>
  );
}
