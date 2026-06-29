"use client";

/** ADR-0027 stub — appshell protected dashboard hook removed with presentation reset. */
export function useProtectedWorkspaceDashboard(): {
  readonly status: "unavailable";
} {
  return { status: "unavailable" };
}
