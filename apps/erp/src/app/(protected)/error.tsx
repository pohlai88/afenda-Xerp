"use client";

import { RouteSegmentError } from "@/components/route-segment-error";

interface ProtectedErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function ProtectedError({ error, reset }: ProtectedErrorProps) {
  return (
    <RouteSegmentError
      description="The workspace surface failed to render. Please try again."
      error={error}
      reset={reset}
      segment="protected"
      title="Workspace unavailable"
    />
  );
}
