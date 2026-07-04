"use client";

import { ClientSafeRetryButton } from "@/components/client-safe-retry-button.client";

import { AuthSegmentShell } from "./_components/auth-segment-shell";

interface AuthSegmentErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function AuthSegmentError({
  error,
  reset,
}: AuthSegmentErrorProps) {
  return (
    <AuthSegmentShell>
      <main className="flex min-h-dvh items-center justify-center p-6">
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center">
          <h1 className="font-semibold text-foreground text-xl">
            Authentication surface error
          </h1>
          <p className="text-muted-foreground text-sm">
            We could not load this auth route. Please try again.
          </p>
          {process.env.NODE_ENV === "development" && error.message ? (
            <p className="text-muted-foreground text-sm">{error.message}</p>
          ) : null}
          <ClientSafeRetryButton onClick={reset} />
        </div>
      </main>
    </AuthSegmentShell>
  );
}
