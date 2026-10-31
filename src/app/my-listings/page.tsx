
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  MapPin,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";

import EditStudioDialog from "@/components/studio/EditStudioDialog";

type Studio = {
  _id: string;
  title: string;
  category: string;
  price: number;
  currency?: string;
  priceUnit?: string;
  capacity: number;
  securityDeposit?: number;
  location?: {
    city?: string;
    area?: string;
  };
  imageUrl?: string;
  rating?: number;
  amenities?: string[];
  description?: string;
  isPublished?: boolean;
  ownerEmail?: string;
  host?: {
    name?: string;
    email?: string;
  };
};

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

const API_BASE = "http://localhost:5000";

function formatPrice(price: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function MyListingsPage() {
  const ownerEmail = "";

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");

  const [editTarget, setEditTarget] = useState<Studio | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = useCallback(
    (type: "success" | "error", message: string) => {
      setToast({ type, message });

      window.setTimeout(() => {
        setToast(null);
      }, 3500);
    },
    []
  );

  const fetchMyStudios = useCallback(async () => {
    if (!ownerEmail) {
      setFetchError("Your account email is not available yet.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError("");

    try {
      const response = await fetch(
        `${API_BASE}/my-studios?ownerEmail=${encodeURIComponent(ownerEmail)}`,
        {
          cache: "no-store",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();

      const result: Studio[] = Array.isArray(data)
        ? data
        : data.studios ?? data.data ?? [];

      setStudios(result);
    } catch (error) {
      console.error("Failed to fetch user's studios:", error);
      setFetchError("Unable to load your listings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [ownerEmail]);

  useEffect(() => {
    fetchMyStudios();
  }, [fetchMyStudios]);

  const filteredStudios = studios.filter((studio) => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return true;

    return (
      studio.title.toLowerCase().includes(searchText) ||
      studio.category.toLowerCase().includes(searchText) ||
      studio.location?.city?.toLowerCase().includes(searchText) ||
      studio.location?.area?.toLowerCase().includes(searchText)
    );
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      const response = await fetch(
        `${API_BASE}/studio/${deleteTarget._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      setStudios((current) =>
        current.filter((studio) => studio._id !== deleteTarget._id)
      );

      setDeleteTarget(null);
      showToast("success", "Listing deleted successfully.");
    } catch (error) {
      console.error("Failed to delete studio:", error);
      showToast("error", "Could not delete this listing. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-ivory">
      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed right-4 top-5 z-[100] flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl ${
            toast.type === "success"
              ? "border-emerald-200 bg-white text-emerald-800"
              : "border-red-200 bg-white text-red-700"
          }`}
        >
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
                My <span className="font-serif italic text-brand-bronze">Listings</span>
              </h1>

              <p className="mt-2 max-w-lg text-sm leading-6 text-brand-stone">
                Manage your creative spaces, update their details, or remove
                listings you no longer offer.
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
                {studios.length} total listings
              </p>
            </div>
          </div>

          <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-brand-border bg-white px-3 sm:max-w-xs">
            <Search className="h-4 w-4 text-brand-bronze" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your listings..."
              className="w-full bg-transparent text-sm text-brand-charcoal outline-none placeholder:text-brand-stone/70"
            />
          </div>
        </div>

        {loading ? (
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
          <div className="rounded-2xl border border-brand-border bg-white px-6 py-16 text-center">
            <Building2 className="mx-auto h-8 w-8 text-brand-bronze" />
            <h2 className="mt-4 text-lg font-semibold text-brand-charcoal">
              Could not load listings
            </h2>
            <p className="mt-2 text-sm text-brand-stone">{fetchError}</p>

            <button
              type="button"
              onClick={fetchMyStudios}
              className="mt-5 rounded-xl bg-brand-charcoal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-bronze"
            >
              Try again
            </button>
          </div>
        ) : filteredStudios.length === 0 ? (
          <div className="rounded-2xl border border-brand-border bg-white px-6 py-16 text-center">
            <Building2 className="mx-auto h-9 w-9 text-brand-bronze" />
            <h2 className="mt-4 text-lg font-semibold text-brand-charcoal">
              {studios.length === 0
                ? "You haven't listed a space yet"
                : "No matching listings"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-stone">
              {studios.length === 0
                ? "Add your first creative space and manage it from this dashboard."
                : "Try a different search term or clear your search."}
            </p>

            {studios.length === 0 ? (
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
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredStudios.map((studio) => {
              const studioLocation = [
                studio.location?.area,
                studio.location?.city,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <article
                  key={studio._id}
                  className="group overflow-hidden rounded-2xl border border-brand-border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-charcoal/[0.06]"
                >
                  <div className="relative aspect-[1.55/1] overflow-hidden bg-brand-stone/10">
                    {studio.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={studio.imageUrl}
                        alt={studio.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-ivory to-brand-bronze/20">
                        <Sparkles className="h-9 w-9 text-brand-bronze/60" />
                      </div>
                    )}

                    <span
                      className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold ${
                        studio.isPublished
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-white/90 text-brand-stone"
                      }`}
                    >
                      {studio.isPublished ? "Published" : "Draft"}
                    </span>

                    <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-brand-charcoal/70 px-3 py-1 text-[10px] font-medium text-white backdrop-blur">
                      {studio.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="line-clamp-1 text-base font-semibold text-brand-charcoal">
                        {studio.title}
                      </h2>

                      <p className="shrink-0 text-sm font-bold text-brand-charcoal">
                        {formatPrice(studio.price, studio.currency)}
                        <span className="ml-1 text-[10px] font-normal text-brand-stone">
                          /{studio.priceUnit || "hour"}
                        </span>
                      </p>
                    </div>

                    {studioLocation && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-brand-stone">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-bronze" />
                        <span className="truncate">{studioLocation}</span>
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-4 border-b border-brand-border pb-4 text-xs text-brand-stone">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-brand-bronze" />
                        {studio.capacity} guests
                      </span>

                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-brand-bronze" />
                        Hourly booking
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditTarget(studio)}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-charcoal px-3 text-xs font-semibold text-white transition hover:bg-brand-bronze"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Update
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(studio)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>

                      <Link
                        href={`/studios/${studio._id}`}
                        aria-label={`View ${studio.title}`}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-border text-brand-stone transition hover:border-brand-bronze hover:text-brand-bronze"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Edit Dialog */}
      {editTarget && (
        <EditStudioDialog
          studio={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-charcoal/50 p-4 backdrop-blur-sm"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="w-full max-w-md rounded-2xl border border-brand-border bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 className="h-5 w-5" />
            </div>

            <h2
              id="delete-modal-title"
              className="mt-5 text-xl font-semibold text-brand-charcoal"
            >
              Delete this listing?
            </h2>

            <p className="mt-2 text-sm leading-6 text-brand-stone">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-brand-charcoal">
                {deleteTarget.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="h-10 rounded-lg border border-brand-border px-4 text-sm font-semibold text-brand-stone transition hover:bg-brand-ivory disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Deleting..." : "Delete listing"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
