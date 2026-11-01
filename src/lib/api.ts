import type { TStudio } from "@/lib/type/type";

/**
 * Base URL of the StudioSpace Express/MongoDB API.
 *
 * The backend lives in its own project (see AGENTS.md) and is not part of this
 * repository. Override it per environment with NEXT_PUBLIC_API_URL; the
 * localhost fallback matches the backend's default port.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
).replace(/\/+$/, "");

const DEFAULT_TIMEOUT_MS = 10_000;

/** Error thrown for non-2xx API responses, network failures and timeouts. */
export class ApiError extends Error {
  /** HTTP status, or 0 when the API could not be reached at all. */
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export type ApiRequestOptions = RequestInit & {
  /** Abort the request after this many milliseconds (default 10s). */
  timeoutMs?: number;
};

const buildUrl = (path: string) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Read a human-readable message from an error response.
 *
 * The backend returns `{ success: false, message: "..." }` for its own errors,
 * and Express' default HTML page for unknown routes, so both are handled.
 */
async function readErrorMessage(response: Response): Promise<string> {
  const body = await response.text().catch(() => "");

  if (body) {
    try {
      const payload = JSON.parse(body) as {
        message?: unknown;
        error?: unknown;
      };

      if (typeof payload?.message === "string" && payload.message.trim()) {
        return payload.message;
      }

      if (typeof payload?.error === "string" && payload.error.trim()) {
        return payload.error;
      }
    } catch {
      // Non-JSON body (Express HTML error page) - fall through.
    }
  }

  return `Request failed with status ${response.status}.`;
}

/** Perform a request against the backend and return the raw Response. */
export async function apiRequest(
  path: string,
  options: ApiRequestOptions = {},
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...init } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(buildUrl(path), {
      ...init,
      signal: init.signal ?? controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(
        "The StudioSpace API took too long to respond. Please try again.",
        0,
      );
    }

    throw new ApiError(
      `Could not reach the StudioSpace API at ${API_BASE_URL}. Make sure the backend is running.`,
      0,
    );
  } finally {
    clearTimeout(timer);
  }
}


export async function apiJson<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const response = await apiRequest(path, options);

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  const body = await response.text();

  // Some endpoints answer 204 No Content; treat an empty body as success.
  if (!body.trim()) {
    return undefined as T;
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    throw new ApiError(
      "The StudioSpace API returned an invalid response.",
      response.status,
    );
  }
}

/** Extract a user-facing message from a caught error. */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.message) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

type StudioListPayload =
  | TStudio[]
  | { studios?: TStudio[]; data?: TStudio[] };

/** Accept either a bare array or `{ studios }` / `{ data }` wrappers. */
export function normalizeStudioList(payload: unknown): TStudio[] {
  if (Array.isArray(payload)) {
    return payload as TStudio[];
  }

  if (payload && typeof payload === "object") {
    const wrapped = payload as { studios?: unknown; data?: unknown };

    if (Array.isArray(wrapped.studios)) {
      return wrapped.studios as TStudio[];
    }

    if (Array.isArray(wrapped.data)) {
      return wrapped.data as TStudio[];
    }
  }

  return [];
}

/** Fetch a studio collection from the backend and normalize its shape. */
export async function fetchStudioList(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TStudio[]> {
  const payload = await apiJson<StudioListPayload>(path, options);

  return normalizeStudioList(payload);
}
