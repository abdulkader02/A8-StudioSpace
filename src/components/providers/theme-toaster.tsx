"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import { useMounted } from "@/hooks/use-mounted";

export function ThemeToaster() {
  const mounted = useMounted();
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={mounted && resolvedTheme === "dark" ? "dark" : "light"}
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast: "font-sans",
          title: "font-semibold",
          description: "text-xs leading-5",
        },
      }}
    />
  );
}
