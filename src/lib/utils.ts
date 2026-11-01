export { cn } from "cn"

/** Extract a user-facing message from a caught error. */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error) || !error.message) {
    return fallback;
  }

  const networkErrors = ["Failed to fetch", "fetch failed", "Load failed"];

  return networkErrors.includes(error.message) ? fallback : error.message;
}

