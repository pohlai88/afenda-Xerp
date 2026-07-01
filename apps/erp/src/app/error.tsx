"use client";

import { ClientSafeRetryButton } from "@/components/client-safe-retry-button.client";

interface RootErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center">
        <h1 className="font-semibold text-foreground text-xl">
          Something went wrong
        </h1>
        <p className="text-muted-foreground text-sm">
          We could not complete your request. Please try again.
        </p>
        {process.env.NODE_ENV === "development" && error.message ? (
          <p className="text-muted-foreground text-sm">{error.message}</p>
        ) : null}
        <ClientSafeRetryButton onClick={reset} />
      </div>
    </main>
  );
}
