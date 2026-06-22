"use client";

import { useEffect } from "react";

import { reportClientError } from "@/lib/observability/report-client-error.client";

interface GlobalErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    reportClientError({
      digest: error.digest ?? "unknown",
      segment: "global",
    });
  }, [error.digest]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <div aria-live="assertive" role="alert">
          <h1 className="font-semibold text-xl">Application error</h1>
          <p className="mt-2 max-w-md text-center text-sm">
            A critical error occurred. Please try again.
          </p>
          <button
            className="mt-4 rounded-md border px-4 py-2 text-sm"
            onClick={reset}
            type="button"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
