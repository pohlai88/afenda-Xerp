"use client";

import { RouteSegmentError } from "@/components/route-segment-error";

interface DevHarnessErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function DevHarnessError({
  error,
  reset,
}: DevHarnessErrorProps) {
  return (
    <RouteSegmentError
      description="The integration harness failed to render. Please try again."
      error={error}
      reset={reset}
      segment="dev-harness"
      title="Harness unavailable"
    />
  );
}
