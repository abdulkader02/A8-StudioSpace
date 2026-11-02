import { Skeleton } from "@/components/ui/skeleton";
import { BookingListSkeleton } from "@/components/shared/LoadingStates";

export default function MyBookingsLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8 lg:pb-24 lg:pt-12">
        <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-6 w-44 rounded-full bg-muted-foreground/10" />
            <Skeleton className="h-8 w-64 max-w-full bg-muted-foreground/10" />
            <Skeleton className="h-4 w-80 max-w-full bg-muted-foreground/10" />
          </div>

          <Skeleton className="h-11 w-44 rounded-xl bg-muted-foreground/10" />
        </div>

        <BookingListSkeleton />
      </div>
    </main>
  );
}
