"use client";

import { RouteSegmentError } from "@/components/route-segment-error";

interface AuthErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function AuthError({ error, reset }: AuthErrorProps) {
  return (
    <RouteSegmentError
      description="The sign-in surface failed to load. Please try again."
      error={error}
      reset={reset}
      segment="auth"
      title="Authentication unavailable"
      variant="page"
    />
  );
}
