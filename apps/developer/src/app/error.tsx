"use client";

import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg rounded-3xl border bg-background/95 p-8 shadow-2xl backdrop-blur">
        <p className="font-medium text-primary text-xs uppercase tracking-[0.28em]">
          Developer Route Lab
        </p>
        <h1 className="mt-4 font-semibold text-3xl tracking-tight">
          The route shell failed before the screen could settle.
        </h1>
        <p className="mt-3 text-muted-foreground">
          The lab stays frontend-only, so failures here should be recoverable
          without runtime authority. Reset the route and verify the current page
          contract.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="rounded-full bg-primary px-5 py-2 font-medium text-primary-foreground"
            onClick={() => reset()}
            type="button"
          >
            Retry route
          </button>
          <a className="rounded-full border px-5 py-2 font-medium" href="/">
            Back to lab index
          </a>
        </div>
      </div>
    </main>
  );
}
