/**
 * globalErrorHandler.ts
 *
 * A production-grade, centralised error boundary that classifies every
 * error the application can surface and routes it to the correct toast
 * via the existing useNotifier hook.
 *
 * Usage
 * -----
 *   import { initGlobalErrorHandler } from "./globalErrorHandler";
 *   import { useNotifier }            from "./useNotifier";   // your existing hook
 *
 *   // In your App root (called once, after the Toaster provider is mounted)
 *   const notifier = useNotifier();
 *   useEffect(() => {
 *     const teardown = initGlobalErrorHandler(notifier);
 *     return teardown;   // cleans up listeners on unmount
 *   }, []);
 *
 * Design decisions
 * ----------------
 * 1.  Classification is done via a priority-ordered chain so the *most
 *     specific* category wins.  Adding a new category means adding one
 *     entry to ERROR_CLASSIFIERS – nothing else changes.
 * 2.  Every unhandled promise rejection and uncaught window error is
 *     captured so nothing slips through silently in production.
 * 3.  Duplicate suppression: identical error messages shown within a
 *     short window (DEDUP_WINDOW_MS) are swallowed to avoid toast spam
 *     caused by retry storms or re-renders.
 * 4.  Dev-only stack traces are forwarded to the console; in production
 *     only the classified user-facing message is surfaced.
 */

import { useNotifier } from "./NotificationService";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Every recognised error category.  Extend as your domain grows. */
export type ErrorCategory =
  | "AUTH"            // 401 / token expired / session invalid
  | "FORBIDDEN"       // 403 – authenticated but not authorised
  | "NOT_FOUND"       // 404
  | "VALIDATION"      // 422 / field-level errors from the API
  | "RATE_LIMIT"      // 429
  | "SERVER"          // 5xx
  | "NETWORK"         // fetch / XHR failed – no response at all
  | "TIMEOUT"         // request timed out (AbortSignal / axios timeout)
  | "PAYMENT"         // payment / billing failures
  | "UNKNOWN";        // anything that doesn't match above

/**
 * The shape every classifier must satisfy.
 *   match  – returns true when it "owns" this error.
 *   category – the tag attached to the match.
 *   message  – the human-readable string the user will see.
 *              Receives the raw error so you can cherry-pick details.
 */
interface ErrorClassifier {
  category: ErrorCategory;
  match: (error: unknown) => boolean;
  message: (error: unknown) => string;
}

// ---------------------------------------------------------------------------
// Classifier registry  (evaluated top-to-bottom; first match wins)
// ---------------------------------------------------------------------------

const ERROR_CLASSIFIERS: ErrorClassifier[] = [
  // ── Auth ────────────────────────────────────────────────────────────────
  {
    category: "AUTH",
    match: (e) =>
      hasStatus(e, 401) ||
      matchesMessage(e, /token (expired|invalid|revoked)/i) ||
      matchesMessage(e, /session (expired|invalid)/i) ||
      matchesMessage(e, /unauthenticated/i),
    message: () =>
      "Your session has expired. Please log in again.",
  },

  // ── Forbidden ───────────────────────────────────────────────────────────
  {
    category: "FORBIDDEN",
    match: (e) =>
      hasStatus(e, 403) ||
      matchesMessage(e, /forbidden|unauthori[sz]ed/i),
    message: (e) =>
      extractApiMessage(e) || "You don't have permission to perform this action.",
  },

  // ── Not Found ───────────────────────────────────────────────────────────
  {
    category: "NOT_FOUND",
    match: (e) =>
      hasStatus(e, 404) ||
      matchesMessage(e, /not found/i),
    message: (e) => {
      const resource = extractResourceName(e);
      if (resource) return `${resource} could not be found.`;

      const apiMsg = extractApiMessage(e);
      if (apiMsg) return apiMsg;

      return "The requested resource could not be found.";
    },
  },

  // ── Validation ──────────────────────────────────────────────────────────
  {
    category: "VALIDATION",
    match: (e) =>
      hasStatus(e, 422) ||
      hasStatus(e, 400) ||
      matchesMessage(e, /validation (error|failed)/i) ||
      hasFieldErrors(e),
    message: (e) => {
      // Surface the first field error when available
      const fields = extractFieldErrors(e);
      if (fields.length) return fields[0];

      // Fall back to the API's own message
      const apiMsg = extractApiMessage(e);
      if (apiMsg) return apiMsg;

      return "Please review the form and fix any errors.";
    },
  },

  // ── Rate limit ──────────────────────────────────────────────────────────
  {
    category: "RATE_LIMIT",
    match: (e) =>
      hasStatus(e, 429) ||
      matchesMessage(e, /rate.?limit/i) ||
      matchesMessage(e, /too many requests/i),
    message: () =>
      "You're being rate-limited. Please wait a moment and try again.",
  },

  // ── Timeout ─────────────────────────────────────────────────────────────
  {
    category: "TIMEOUT",
    match: (e) =>
      isAbortError(e) ||
      matchesMessage(e, /timeout|timed out/i) ||
      hasAxiosCode(e, "ETIMEDOUT") ||
      hasAxiosCode(e, "ECONNABORTED"),
    message: () =>
      "The request timed out. Please check your connection and try again.",
  },

  // ── Network ─────────────────────────────────────────────────────────────
  {
    category: "NETWORK",
    match: (e) =>
      isNetworkError(e) ||
      matchesMessage(e, /network (error|failure|offline)/i) ||
      matchesMessage(e, /failed to fetch/i),
    message: () =>
      "A network error occurred. Please check your connection and retry.",
  },

  // ── Payment ─────────────────────────────────────────────────────────────
  {
    category: "PAYMENT",
    match: (e) =>
      matchesMessage(e, /payment|billing|card.*(declined|invalid|expired)/i) ||
      hasStatus(e, 402),
    message: (e) => {
      const apiMsg = extractApiMessage(e);
      return apiMsg || "A payment error occurred. Please update your payment details.";
    },
  },

  // ── Server errors (5xx) ─────────────────────────────────────────────────
  {
    category: "SERVER",
    match: (e) => {
      const status = extractStatus(e);
      return status !== null && status >= 500 && status < 600;
    },
    message: () =>
      "Something went wrong on our end. Please try again later.",
  },

  // ── Catch-all ───────────────────────────────────────────────────────────
  {
    category: "UNKNOWN",
    match: () => true,
    message: (e) => {
      const msg = extractApiMessage(e) || extractMessage(e);
      return msg || "An unexpected error occurred.";
    },
  },
];

// ---------------------------------------------------------------------------
// Core classification logic
// ---------------------------------------------------------------------------

export interface ClassifiedError {
  category: ErrorCategory;
  message: string;
  original: unknown;
}

/**
 * Walk the classifier chain and return the first match.
 * Guaranteed to return a result because UNKNOWN is the tail.
 */
export function classifyError(error: unknown): ClassifiedError {
  for (const classifier of ERROR_CLASSIFIERS) {
    if (classifier.match(error)) {
      return {
        category: classifier.category,
        message: classifier.message(error),
        original: error,
      };
    }
  }

  // Unreachable – UNKNOWN always matches – but satisfies the compiler.
  return { category: "UNKNOWN", message: "An unexpected error occurred.", original: error };
}

// ---------------------------------------------------------------------------
// Deduplication
// ---------------------------------------------------------------------------

const DEDUP_WINDOW_MS = 3_000;
let lastToastMessage = "";
let lastToastTime = 0;

function isDuplicate(message: string): boolean {
  const now = Date.now();
  if (message === lastToastMessage && now - lastToastTime < DEDUP_WINDOW_MS) {
    return true;
  }
  lastToastMessage = message;
  lastToastTime = now;
  return false;
}

// ---------------------------------------------------------------------------
// Public surface – initialise once at the app root
// ---------------------------------------------------------------------------

type Notifier = ReturnType<typeof useNotifier>;

/**
 * Attach global `error` and `unhandledrejection` listeners.
 * Returns a teardown function that removes them.
 */
export function initGlobalErrorHandler(): () => void {
  const handleError = (_event: ErrorEvent) => {
    handleAnyError(_event.error ?? _event.message);
  };

  const handleRejection = (event: PromiseRejectionEvent) => {
    handleAnyError(event.reason);
  };

  window.addEventListener("error", handleError);
  window.addEventListener("unhandledrejection", handleRejection);

  return () => {
    window.removeEventListener("error", handleError);
    window.removeEventListener("unhandledrejection", handleRejection);
  };
}

/**
 * The single entry-point every other layer in the app should call when
 * it catches an error it cannot recover from locally.
 *
 *   import { handleAnyError } from "./globalErrorHandler";
 *
 *   try { … } catch (err) { handleAnyError(err); }
 */
export function handleAnyError(error: unknown, notifier?: Notifier): void {
  const classified = classifyError(error);

  // Dev-only: full stack for debugging
  if (import.meta.env.DEV) {
    console.group(`[${classified.category}] ${classified.message}`);
    console.error(classified.original);
    console.groupEnd();
  }

  // Deduplicate before toasting
  if (isDuplicate(classified.message)) return;

  // Route to the correct toast variant
  // AUTH errors get a longer duration so the user has time to read before redirect
  const duration =
    classified.category === "AUTH" ? 6_000 :
      classified.category === "SERVER" ? 6_000 :
        5_000;

  // We accept an optional notifier for imperative call sites;
  // fall back to a lazy singleton for the global listeners.
  const n = notifier ?? getOrWarnNotifier();
  if (!n) return; // safety – should never happen after init

  n.notifyError(classified.message, { duration });
}

// ---------------------------------------------------------------------------
// Lazy singleton – so the global window listeners can call handleAnyError
// without threading the notifier through every call site.
// ---------------------------------------------------------------------------

let _globalNotifier: Notifier | null = null;

/**
 * Call this inside your App component *before* initGlobalErrorHandler
 * so the singleton is wired up.
 *
 *   setGlobalNotifier(notifier);
 *   initGlobalErrorHandler(notifier);
 */
export function setGlobalNotifier(notifier: Notifier): void {
  _globalNotifier = notifier;
}

function getOrWarnNotifier(): Notifier | null {
  if (!_globalNotifier && import.meta.env.DEV) {
    console.warn(
      "[globalErrorHandler] setGlobalNotifier() was never called. " +
      "Toast will not fire for uncaught errors."
    );
  }
  return _globalNotifier;
}

// ---------------------------------------------------------------------------
// Extraction / matching helpers  (intentionally narrow – extend freely)
// ---------------------------------------------------------------------------

/** Pull the HTTP status off Axios-style or generic {status} error objects. */
function extractStatus(e: unknown): number | null {
  if (e && typeof e === "object") {
    const obj = e as Record<string, unknown>;
    // Axios wraps it under response.status
    if (obj.response && typeof obj.response === "object") {
      const status = (obj.response as Record<string, unknown>).status;
      if (typeof status === "number") return status;
    }
    // Direct {status} (e.g. a manually constructed error)
    if (typeof obj.status === "number") return obj.status;
  }
  return null;
}

function hasStatus(e: unknown, code: number): boolean {
  return extractStatus(e) === code;
}

/** Pull the message string from Axios .response.data.message, .message, or raw string. */
function extractApiMessage(e: unknown): string | null {
  if (e && typeof e === "object") {
    const obj = e as Record<string, unknown>;
    if (obj.response && typeof obj.response === "object") {
      const data = (obj.response as Record<string, unknown>).data;
      if (data && typeof data === "object") {
        const msg = (data as Record<string, unknown>).message;
        if (typeof msg === "string" && msg) return msg;
      }
    }
  }
  return null;
}

function extractMessage(e: unknown): string | null {
  if (typeof e === "string" && e) return e;
  if (e instanceof Error) return e.message || null;
  return null;
}

/** Test the error message (from any layer) against a regex. */
function matchesMessage(e: unknown, pattern: RegExp): boolean {
  const candidates = [extractApiMessage(e), extractMessage(e)];
  return candidates.some((m) => m && pattern.test(m));
}

// ── Axios-specific code field (e.g. "ETIMEDOUT") ─────────────────────────
function hasAxiosCode(e: unknown, code: string): boolean {
  return !!(
    e &&
    typeof e === "object" &&
    (e as Record<string, unknown>).code === code
  );
}

// ── AbortSignal / DOMException timeout ────────────────────────────────────
function isAbortError(e: unknown): boolean {
  if (e instanceof DOMException && e.name === "AbortError") return true;
  if (e instanceof Error && e.name === "AbortError") return true;
  return false;
}

// ── Network-level failure (no response received) ──────────────────────────
function isNetworkError(e: unknown): boolean {
  // Axios sets response to undefined when there is no network connectivity
  if (
    e &&
    typeof e === "object" &&
    "isAxiosError" in e &&
    !(e as Record<string, unknown>).response
  ) {
    return true;
  }
  // Fetch throws a plain TypeError with "Failed to fetch"
  if (e instanceof TypeError && /failed to fetch/i.test(e.message)) return true;
  return false;
}

// ── Validation field errors ───────────────────────────────────────────────
// Expects the common API shape: { errors: { fieldName: ["msg", …], … } }

function hasFieldErrors(e: unknown): boolean {
  return extractFieldErrors(e).length > 0;
}

function extractFieldErrors(e: unknown): string[] {
  const data = extractResponseData(e);
  if (!data || typeof data !== "object") return [];

  const dataObj = data as Record<string, unknown>;

  // Format 1: payload: [ { path: string, message: string }, ... ]
  // This is used by the new AI endpoints
  if (Array.isArray(dataObj.payload)) {
    return (dataObj.payload as unknown[])
      .filter(
        (err): err is { path: string; message: string } =>
          !!err &&
          typeof err === "object" &&
          "path" in err &&
          "message" in err &&
          typeof (err as Record<string, unknown>).path === "string" &&
          typeof (err as Record<string, unknown>).message === "string"
      )
      .map((err) => `${capitalise(err.path)}: ${err.message}`);
  }

  // Format 2: errors: { fieldName: ["msg", ...], ... }
  // Legacy format or standard Laravel-style errors
  const errors = dataObj.errors;
  if (!errors || typeof errors !== "object") return [];

  // Flatten { field: ["msg"] } → ["Field: msg", …]
  return Object.entries(errors as Record<string, unknown>).flatMap(
    ([field, messages]) => {
      const msgs = Array.isArray(messages) ? messages : [messages];
      return msgs
        .filter((m): m is string => typeof m === "string")
        .map((m) => `${capitalise(field)}: ${m}`);
    }
  );
}

function extractResponseData(e: unknown): unknown | null {
  if (e && typeof e === "object") {
    const resp = (e as Record<string, unknown>).response;
    if (resp && typeof resp === "object") return (resp as Record<string, unknown>).data;
  }
  return null;
}

// ── Resource name from 404 payloads ───────────────────────────────────────
// Expects: { resource: "User" } or { message: "User not found" }

function extractResourceName(e: unknown): string | null {
  const data = extractResponseData(e);
  if (data && typeof data === "object") {
    const resource = (data as Record<string, unknown>).resource;
    if (typeof resource === "string" && resource) return resource;
  }
  // Try to pull from the message itself: "Xyz not found"
  const msg = extractApiMessage(e);
  if (msg) {
    const match = msg.match(/^(.+?)\s+not\s+found/i);
    if (match) return match[1].trim();
  }
  return null;
}

// ── Micro-utilities ────────────────────────────────────────────────────────
function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
}