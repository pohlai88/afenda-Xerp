"use client";

import { Button } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useEffect, useTransition } from "react";

import { AuthSegmentErrorShell } from "@/app/(auth)/_components/auth-error-surface.client";
import { AUTH_SEGMENT_ERROR_COPY } from "@/lib/auth/auth-segment-error.copy";
import { reportClientError } from "@/lib/observability/report-client-error.client";

export type AuthErrorPageGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button"
>;

interface AuthErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function AuthErrorPage({ error, reset }: AuthErrorPageProps) {
  const [isRetrying, startRetryTransition] = useTransition();

  useEffect(() => {
    reportClientError({
      digest: error.digest ?? "unknown",
      segment: "auth",
    });
  }, [error.digest]);

  const handleRetry = () => {
    startRetryTransition(() => {
      reset();
    });
  };

  return (
    <AuthSegmentErrorShell
      actions={
        <Button
          aria-busy={isRetrying || undefined}
          disabled={isRetrying}
          emphasis="solid"
          intent="primary"
          onClick={handleRetry}
          presentation="default"
          size="md"
          type="button"
        >
          {isRetrying ? "Reloading…" : AUTH_SEGMENT_ERROR_COPY.retryLabel}
        </Button>
      }
      description={AUTH_SEGMENT_ERROR_COPY.description}
      title={AUTH_SEGMENT_ERROR_COPY.title}
      tone="warning"
    />
  );
}
