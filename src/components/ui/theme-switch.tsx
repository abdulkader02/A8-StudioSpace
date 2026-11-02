"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "cn";
import { useMounted } from "@/hooks/use-mounted";

type ThemeSwitchProps = {
  className?: string;
};

/**
 * Theme toggle built on the same Base UI switch primitive used by the shadcn
 * Switch component. The default shadcn geometry is intentionally replaced with
 * the StudioSpace pill: charcoal track, ivory sliding thumb, Sun/Moon icons.
 */
function ThemeSwitch({ className }: ThemeSwitchProps) {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();

  // The thumb and icon colors are CSS-driven by the `.dark` class so they are
  // correct before hydration. The checked state is deferred until mount to
  // avoid a server/client attribute mismatch from next-themes reading storage.
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <SwitchPrimitive.Root
      data-slot="theme-switch"
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "group/theme-switch relative inline-flex h-8 w-[60px] shrink-0 cursor-pointer items-center rounded-full border border-white/15 bg-brand-dark-soft p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark sm:h-9 sm:w-[68px]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-[9px] sm:px-[10px]"
      >
        <Sun className="h-3.5 w-3.5 text-brand-dark transition-colors dark:text-brand-ivory/50 sm:h-4 sm:w-4" />
        <Moon className="h-3.5 w-3.5 text-brand-ivory/50 transition-colors dark:text-brand-dark sm:h-4 sm:w-4" />
      </span>

      <SwitchPrimitive.Thumb
        data-slot="theme-switch-thumb"
        className="pointer-events-none relative z-0 block h-6 w-6 rounded-full bg-brand-ivory shadow-md transition-transform duration-300 ease-out dark:translate-x-7 sm:h-7 sm:w-7 sm:dark:translate-x-8"
      />
    </SwitchPrimitive.Root>
  );
}

export { ThemeSwitch };
