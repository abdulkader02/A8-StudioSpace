import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-background px-4"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-brand-bronze shadow-sm">
        <Spinner className="h-6 w-6" />
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">
          Preparing your space
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Setting the lights and loading the next scene...
        </p>
      </div>
    </div>
  );
}
