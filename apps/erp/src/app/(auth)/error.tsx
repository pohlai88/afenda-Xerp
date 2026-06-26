"use client";

import { useEffect } from "react";

import {
  AuthErrorSignInEscape,
  AuthErrorSurface,
} from "@/app/(auth)/_components/auth-error-surface.client";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";
import { reportClientError } from "@/lib/observability/report-client-error.client";

interface AuthErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

const segmentError = AUTH_ROUTE_REGISTRY.segmentError;

export default function AuthError({ error, reset }: AuthErrorProps) {
  useEffect(() => {
    reportClientError({
      digest: error.digest ?? "unknown",
      segment: "auth",
    });
  }, [error.digest]);

  return (
    <AuthErrorSurface
      description={segmentError.description}
      eyebrow={segmentError.eyebrow}
      onRetry={reset}
      retryLabel={segmentError.retryLabel}
      title={segmentError.title}
    >
      <AuthErrorSignInEscape />
    </AuthErrorSurface>
  );
}
