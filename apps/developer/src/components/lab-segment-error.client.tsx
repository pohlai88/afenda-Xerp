"use client";

import { ClientSafeRetryButton } from "@/components/client-safe-retry-button.client";

interface LabSegmentErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
  readonly title?: string;
}

/** Segment error UI — must not import @afenda/shadcn-studio (same law as ERP). */
export function LabSegmentError({
  error,
  reset,
  title = "Something went wrong",
}: LabSegmentErrorProps) {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex w-full max-w-lg flex-col gap-4 rounded-xl border bg-card p-6">
        <h2 className="font-semibold text-foreground text-lg">{title}</h2>
        <p className="text-muted-foreground text-sm">
          This screen could not render. Try again or return via navigation.
        </p>
        {process.env.NODE_ENV === "development" && error.message ? (
          <p className="text-muted-foreground text-sm">{error.message}</p>
        ) : null}
        <ClientSafeRetryButton onClick={reset} />
      </div>
    </div>
  );
}
