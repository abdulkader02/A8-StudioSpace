import { Skeleton } from "@/components/ui/skeleton";
import { ListingGridSkeleton } from "@/components/shared/LoadingStates";

export default function MyListingsLoading() {
  return (
    <main className="min-h-screen bg-brand-ivory">
      <section className="border-b border-brand-border bg-white/50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="space-y-3">
              <Skeleton className="h-6 w-40 rounded-full bg-brand-stone/10" />
              <Skeleton className="h-10 w-56 max-w-full bg-brand-stone/10" />
              <Skeleton className="h-4 w-80 max-w-full bg-brand-stone/10" />
            </div>

            <Skeleton className="h-11 w-40 rounded-xl bg-brand-stone/10" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-xl bg-brand-stone/10" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 bg-brand-stone/10" />
              <Skeleton className="h-3 w-20 bg-brand-stone/10" />
            </div>
          </div>

          <Skeleton className="h-11 w-full rounded-xl bg-brand-stone/10 sm:max-w-xs" />
        </div>

        <ListingGridSkeleton />
      </section>
    </main>
  );
}
