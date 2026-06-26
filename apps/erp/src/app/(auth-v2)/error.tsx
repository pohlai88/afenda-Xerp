"use client";

import { Button } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useEffect, useTransition } from "react";

import { AuthV2SegmentErrorShell } from "@/app/(auth-v2)/_components/auth-v2-error-surface.client";
import { AUTH_V2_SEGMENT_ERROR_COPY } from "@/lib/auth-v2/auth-v2-segment-error.copy";
import { reportClientError } from "@/lib/observability/report-client-error.client";

export type AuthV2ErrorPageGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button"
>;

interface AuthV2ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function AuthV2ErrorPage({
  error,
  reset,
}: AuthV2ErrorPageProps) {
  const [isRetrying, startRetryTransition] = useTransition();

  useEffect(() => {
    reportClientError({
      digest: error.digest ?? "unknown",
      segment: "auth-v2",
    });
  }, [error.digest]);

  const handleRetry = () => {
    startRetryTransition(() => {
      reset();
    });
  };

  return (
    <AuthV2SegmentErrorShell
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
          {isRetrying ? "Reloading…" : AUTH_V2_SEGMENT_ERROR_COPY.retryLabel}
        </Button>
      }
      description={AUTH_V2_SEGMENT_ERROR_COPY.description}
      title={AUTH_V2_SEGMENT_ERROR_COPY.title}
      tone="warning"
    />
  );
}
