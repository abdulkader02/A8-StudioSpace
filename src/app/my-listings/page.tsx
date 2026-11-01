"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  LogIn,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import EditStudioDialog from "@/components/studio/EditStudioDialog";
import MyListing from "@/components/studio/MyListingCard";
import EmptyState from "@/components/shared/EmptyState";
import { ListingGridSkeleton } from "@/components/shared/LoadingStates";
import { authClient } from "@/lib/auth-client";
import { getErrorMessage } from "@/lib/utils";

import type { TStudio } from "@/lib/type/type";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
).replace(/\/+$/, "");

type ListingStudio = TStudio & {
  name?: string;
  email?: string;
};

const getOwnerEmail = (studio: ListingStudio) =>
  (studio.host?.email || studio.email || "").trim().toLowerCase();

export default function MyListingsPage() {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const [studios, setStudios] = useState<ListingStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [search, setSearch] = useState("");

  const [editTarget, setEditTarget] = useState<TStudio | null>(null);

  useEffect(() => {
    let active = true;

    const loadStudios = async () => {
      if (isPending) {
        return;
      }

      // User is not logged in
      if (!user?.email) {
        if (active) {
          setStudios([]);
          setFetchError("Please log in to view your listings.");
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setFetchError("");

        // GET /my-listings/:email is already scoped to the signed-in user;
        // no cookies/credentials are involved, and the API's CORS policy
        // (Access-Control-Allow-Origin: *) rejects credentialed requests.
        const response = await fetch(
          `${API_URL}/my-listings/${encodeURIComponent(user.email)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Unable to load your listings. Please try again.");
        }

        const data = (await response.json()) as
          | TStudio[]
          | { studios?: TStudio[] };

        const result = Array.isArray(data) ? data : data.studios ?? [];

        if (active) {
          setStudios(result as ListingStudio[]);
          setFetchError("");
        }
      } catch (error) {
        console.error("Failed to fetch user's studios:", error);

        if (active) {
          setFetchError(
            getErrorMessage(
              error,
              "Unable to load your listings. Please try again.",
            ),
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
    if (loading) {
      return;
    }

    setLoading(true);
    setReloadToken((current) => current + 1);
  };

  // Filter listings by the logged-in user's email
  const currentUserEmail = (user?.email ?? "").trim().toLowerCase();

  const ownerStudios = studios.filter(
    (studio) => getOwnerEmail(studio) === currentUserEmail
  );

  const searchText = search.trim().toLowerCase();

  const filteredStudios = ownerStudios.filter((studio) => {
    if (!searchText) {
      return true;
    }

    return (
      studio.title?.toLowerCase().includes(searchText) ||
      studio.category?.toLowerCase().includes(searchText) ||
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

  // Prepare host information for the edit dialog
  const handleEdit = (studio: TStudio) => {
    const listing = studio as ListingStudio;

    const host =
      studio.host ??
      (listing.name || listing.email
        ? {
            name: listing.name,
            email: listing.email,
          }
        : undefined);

    setEditTarget(host ? { ...studio, host } : studio);
  };

  // Close edit dialog and reload listings
  const handleEditClose = () => {
    setEditTarget(null);
    setReloadToken((current) => current + 1);
  };

  const needsAuth = !isPending && !user?.email;

  const isInitialLoading =
    isPending || (loading && ownerStudios.length === 0);

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
          <ListingGridSkeleton />
        ) : fetchError ? (
          <EmptyState
            tone="error"
            icon={needsAuth ? LogIn : Building2}
            eyebrow={needsAuth ? "Account required" : "Dashboard unavailable"}
            title={
              needsAuth
                ? "Sign in to manage listings"
                : "Could not load listings"
            }
            description={fetchError}
            action={
              needsAuth
                ? {
                    label: "Sign in",
                    href: "/login",
                    icon: LogIn,
                  }
                : {
                    label: "Try again",
                    onClick: retryFetch,
                    icon: RotateCcw,
                  }
            }
            secondaryAction={
              needsAuth
                ? {
                    label: "Browse studios",
                    href: "/studios",
                  }
                : {
                    label: "Back to home",
                    href: "/",
                  }
            }
          />
        ) : filteredStudios.length === 0 ? (
          <EmptyState
            icon={Building2}
            eyebrow={
              ownerStudios.length === 0 ? "Start hosting" : "No matches"
            }
            title={
              ownerStudios.length === 0
                ? "You haven't listed a space yet"
                : "No matching listings"
            }
            description={
              ownerStudios.length === 0
                ? "Add your first creative space and manage bookings, details, and availability from this dashboard."
                : "Try a different search term or clear your search to see all of your listings."
            }
            action={
              ownerStudios.length === 0
                ? {
                    label: "Add Your First Studio",
                    href: "/add-studio",
                    icon: Plus,
                  }
                : {
                    label: "Clear search",
                    onClick: () => setSearch(""),
                    icon: X,
                  }
            }
            secondaryAction={
              ownerStudios.length === 0
                ? {
                    label: "Browse studios",
                    href: "/studios",
                    icon: Search,
                  }
                : {
                    label: "Add a studio",
                    href: "/add-studio",
                    icon: Plus,
                  }
            }
          />
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