"use client";

import { useEffect } from "react";

import { reportClientError } from "@/lib/observability/report-client-error.client";

export interface RouteSegmentErrorProps {
  readonly description: string;
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
  readonly segment: string;
  readonly title: string;
  readonly variant?: "page" | "section";
}

export function RouteSegmentError({
  description,
  error,
  reset,
  segment,
  title,
  variant = "section",
}: RouteSegmentErrorProps) {
  useEffect(() => {
    reportClientError({
      digest: error.digest ?? "unknown",
      segment,
    });
  }, [error.digest, segment]);

  const containerClassName =
    variant === "page"
      ? "flex min-h-screen flex-col items-center justify-center gap-4 p-6"
      : "flex flex-col gap-4 p-6";

  return (
    <div
      aria-live="assertive"
      className={containerClassName}
      role="alert"
    >
      <h1
        className={
          variant === "page"
            ? "font-semibold text-foreground text-xl"
            : "font-semibold text-foreground text-lg"
        }
      >
        {title}
      </h1>
      <p className="max-w-md text-foreground-muted text-sm">{description}</p>
      <button
        className="w-fit rounded-md border border-border px-4 py-2 text-sm"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </div>
  );
}
