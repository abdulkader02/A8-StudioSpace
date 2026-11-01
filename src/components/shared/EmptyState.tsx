import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export type EmptyStateAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
};

type EmptyStateProps = {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  tone?: "empty" | "error";
  compact?: boolean;
  className?: string;
};

const actionStyles = {
  primary:
    "bg-brand-bronze text-white hover:bg-brand-bronze-hover focus-visible:ring-brand-bronze",
  secondary:
    "border border-brand-border bg-white text-brand-charcoal hover:border-brand-bronze hover:text-brand-bronze focus-visible:ring-brand-bronze",
};

function EmptyStateActionButton({
  action,
  variant = "primary",
}: {
  action: EmptyStateAction;
  variant?: "primary" | "secondary";
}) {
  const Icon = action.icon;

  const className = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    actionStyles[variant],
  );

  const content = (
    <>
      {action.loading ? (
        <Spinner className="size-4" />
      ) : (
        Icon && <Icon className="h-4 w-4" />
      )}
      {action.label}
    </>
  );

  if (action.href && !action.disabled && !action.loading) {
    return (
      <Link href={action.href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={action.onClick}
      disabled={action.disabled || action.loading}
      className={className}
    >
      {content}
    </button>
  );
}

export default function EmptyState({
  icon: Icon,
  eyebrow,
  title,
  description,
  action,
  secondaryAction,
  tone = "empty",
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-brand-border bg-white text-center shadow-sm",
        compact ? "px-4 py-8" : "px-6 py-14 sm:px-8 sm:py-16",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-brand-bronze/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-brand-bronze-light/60 blur-3xl" />

      <div className="relative mx-auto flex max-w-lg flex-col items-center">
        {Icon && (
          <div
            className={cn(
              "mb-5 flex items-center justify-center rounded-2xl border border-brand-bronze/20 bg-brand-bronze-light/40 text-brand-bronze",
              compact ? "h-12 w-12" : "h-16 w-16",
            )}
          >
            <Icon className={compact ? "h-6 w-6" : "h-8 w-8"} />
          </div>
        )}

        {eyebrow && (
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-bronze">
            {eyebrow}
          </p>
        )}

        <h2
          className={cn(
            "font-semibold tracking-tight text-brand-charcoal",
            compact ? "text-base" : "text-xl sm:text-2xl",
          )}
        >
          {title}
        </h2>

        <p
          className={cn(
            "mt-2 max-w-md leading-6 text-brand-stone",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {description}
        </p>

        {(action || secondaryAction) && (
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
            {action && (
              <EmptyStateActionButton
                action={action}
                variant={action.variant ?? "primary"}
              />
            )}

            {secondaryAction && (
              <EmptyStateActionButton
                action={secondaryAction}
                variant={secondaryAction.variant ?? "secondary"}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
