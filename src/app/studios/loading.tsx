import { Skeleton } from "@/components/ui/skeleton";
import { StudioGridSkeleton } from "@/components/shared/LoadingStates";

export default function StudiosLoading() {
  return (
    <main className="min-h-screen bg-brand-ivory">
      <section className="border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <Skeleton className="mx-auto h-7 w-44 rounded-full bg-brand-stone/10" />
            <Skeleton className="mx-auto h-10 w-full max-w-lg bg-brand-stone/10" />
            <Skeleton className="mx-auto h-4 w-full max-w-md bg-brand-stone/10" />
          </div>

          <Skeleton className="mx-auto mt-8 h-28 w-full max-w-5xl rounded-2xl bg-brand-stone/10" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-3">
            <Skeleton className="h-3 w-36 bg-brand-stone/10" />
            <Skeleton className="h-8 w-72 max-w-full bg-brand-stone/10" />
            <Skeleton className="h-4 w-64 max-w-full bg-brand-stone/10" />
          </div>

          <Skeleton className="h-9 w-32 rounded-full bg-brand-stone/10" />
        </div>

        <StudioGridSkeleton />
      </section>
    </main>
  );
}
