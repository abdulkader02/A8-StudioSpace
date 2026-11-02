import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StudioCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-[22px] border border-border bg-card",
        className,
      )}
    >
      <Skeleton className="aspect-[1.28/1] w-full rounded-none bg-muted-foreground/10" />

      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4 bg-muted-foreground/10" />
            <Skeleton className="h-4 w-1/2 bg-muted-foreground/10" />
          </div>

          <Skeleton className="h-5 w-16 shrink-0 bg-muted-foreground/10" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full bg-muted-foreground/10" />
          <Skeleton className="h-3.5 w-5/6 bg-muted-foreground/10" />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <Skeleton className="h-4 w-24 bg-muted-foreground/10" />
          <Skeleton className="h-10 w-28 rounded-xl bg-muted-foreground/10" />
        </div>
      </div>
    </div>
  );
}

export function StudioGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label="Loading studios"
      className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      <span className="sr-only">Loading studios...</span>

      {Array.from({ length: count }).map((_, index) => (
        <StudioCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ListingCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card",
        className,
      )}
    >
      <Skeleton className="aspect-[1.5/1] w-full rounded-none bg-muted-foreground/10" />

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-2/3 bg-muted-foreground/10" />
            <Skeleton className="h-3.5 w-1/2 bg-muted-foreground/10" />
          </div>

          <Skeleton className="h-5 w-16 shrink-0 bg-muted-foreground/10" />
        </div>

        <Skeleton className="h-3.5 w-full bg-muted-foreground/10" />
        <Skeleton className="h-3.5 w-4/5 bg-muted-foreground/10" />

        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <Skeleton className="h-9 w-20 bg-muted-foreground/10" />
          <Skeleton className="h-9 w-56 bg-muted-foreground/10" />
        </div>
      </div>
    </div>
  );
}

export function ListingGridSkeleton({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label="Loading your studio listings"
      className={cn("grid gap-5 md:grid-cols-2 xl:grid-cols-3", className)}
    >
      <span className="sr-only">Loading your studio listings...</span>

      {Array.from({ length: count }).map((_, index) => (
        <ListingCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function BookingCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:gap-4 sm:rounded-2xl sm:p-4 md:flex-row md:items-center"
    >
      <Skeleton className="h-40 w-full shrink-0 rounded-lg bg-muted-foreground/10 sm:h-44 md:h-24 md:w-28 lg:h-28 lg:w-32" />

      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-6 w-20 rounded-full bg-muted-foreground/10" />
          <Skeleton className="h-4 w-32 bg-muted-foreground/10" />
        </div>

        <Skeleton className="h-5 w-2/3 bg-muted-foreground/10" />

        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-4 w-24 bg-muted-foreground/10" />
          <Skeleton className="h-4 w-28 bg-muted-foreground/10" />
          <Skeleton className="h-4 w-20 bg-muted-foreground/10" />
        </div>

        <Skeleton className="h-4 w-1/2 bg-muted-foreground/10" />
      </div>

      <div className="flex shrink-0 flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between md:w-44 md:flex-col md:items-end md:justify-center md:border-l md:border-t-0 md:pl-4 md:pt-0 lg:w-52">
        <div className="space-y-2 md:text-right">
          <Skeleton className="h-3 w-20 bg-muted-foreground/10" />
          <Skeleton className="h-7 w-24 bg-muted-foreground/10" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-lg bg-muted-foreground/10" />
          <Skeleton className="h-9 w-28 rounded-lg bg-muted-foreground/10" />
        </div>
      </div>
    </div>
  );
}

export function BookingListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading bookings"
      className="space-y-3 sm:space-y-4"
    >
      <span className="sr-only">Loading bookings...</span>

      {Array.from({ length: count }).map((_, index) => (
        <BookingCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function StudioDetailsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading studio details"
      className="min-h-screen bg-background"
    >
      <span className="sr-only">Loading studio details...</span>

      <div className="border-b border-border/80 bg-background/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Skeleton className="h-9 w-36 rounded-full bg-muted-foreground/10" />
          <Skeleton className="h-7 w-28 rounded-full bg-muted-foreground/10" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="w-full space-y-4">
            <Skeleton className="h-3 w-48 bg-muted-foreground/10" />
            <Skeleton className="h-10 w-full max-w-xl bg-muted-foreground/10" />
            <Skeleton className="h-4 w-64 max-w-full bg-muted-foreground/10" />
          </div>

          <Skeleton className="h-10 w-32 shrink-0 rounded-full bg-muted-foreground/10" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-8 lg:col-span-8">
            <Skeleton className="h-[350px] w-full rounded-2xl bg-muted-foreground/10 md:h-[480px]" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-32 rounded-2xl bg-muted-foreground/10"
                />
              ))}
            </div>

            <Skeleton className="h-56 w-full rounded-[24px] bg-muted-foreground/10" />
            <Skeleton className="h-44 w-full rounded-[24px] bg-muted-foreground/10" />
            <Skeleton className="h-40 w-full rounded-2xl bg-muted-foreground/10" />
          </div>

          <div className="lg:col-span-4">
            <Skeleton className="h-[520px] w-full rounded-[28px] bg-muted-foreground/10 lg:sticky lg:top-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FormPageSkeleton() {
  return (
    <main
      role="status"
      aria-label="Loading form"
      className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8"
    >
      <span className="sr-only">Loading form...</span>

      <div className="mx-auto max-w-5xl">
        <div className="mb-8 space-y-3">
          <Skeleton className="h-6 w-40 rounded-full bg-muted-foreground/10" />
          <Skeleton className="h-9 w-64 max-w-full bg-muted-foreground/10" />
          <Skeleton className="h-4 w-96 max-w-full bg-muted-foreground/10" />
        </div>

        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
            >
              <Skeleton className="h-5 w-40 bg-muted-foreground/10" />

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Skeleton className="h-12 w-full bg-muted-foreground/10" />
                <Skeleton className="h-12 w-full bg-muted-foreground/10" />
                <Skeleton className="h-12 w-full bg-muted-foreground/10" />
                <Skeleton className="h-12 w-full bg-muted-foreground/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
