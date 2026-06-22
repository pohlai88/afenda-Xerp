"use client";

import { RouteSegmentError } from "@/components/route-segment-error";

interface RootErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  return (
    <RouteSegmentError
      description="We could not complete your request. Please try again."
      error={error}
      reset={reset}
      segment="root"
      title="Something went wrong"
      variant="page"
    />
  );
}
