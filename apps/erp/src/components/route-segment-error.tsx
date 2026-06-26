"use client";

import { Button } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useEffect, useTransition } from "react";

import { reportClientError } from "@/lib/observability/report-client-error.client";

type RouteSegmentErrorBaseProps = {
  readonly description: string;
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
  readonly retryLabel?: string;
  readonly segment: string;
  readonly title: string;
};

export type RouteSegmentErrorGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button"
>;

export type RouteSegmentErrorSectionProps = RouteSegmentErrorBaseProps & {
  readonly variant?: "section";
};

export type RouteSegmentErrorPageProps = RouteSegmentErrorBaseProps & {
  readonly variant: "page";
};

export type RouteSegmentErrorProps =
  | RouteSegmentErrorPageProps
  | RouteSegmentErrorSectionProps;

const DEFAULT_RETRY_LABEL = "Try again" as const;

function RouteSegmentErrorIcon() {
  return (
    <div aria-hidden="true" className="erp-route-error__icon">
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
        <title>Error</title>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12 8v5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="16" fill="currentColor" r="0.875" />
      </svg>
    </div>
  );
}

function RouteSegmentErrorPanel({
  description,
  isRetrying,
  onRetry,
  retryLabel,
  title,
}: {
  readonly description: string;
  readonly isRetrying: boolean;
  readonly onRetry: () => void;
  readonly retryLabel: string;
  readonly title: string;
}) {
  return (
    <div className="erp-route-error__panel" role="alert">
      <RouteSegmentErrorIcon />
      <h1 className="erp-route-error__title">{title}</h1>
      <p className="erp-route-error__description">{description}</p>
      <div className="erp-route-error__actions">
        <Button
          aria-busy={isRetrying || undefined}
          disabled={isRetrying}
          emphasis="solid"
          intent="primary"
          onClick={onRetry}
          presentation="default"
          size="md"
          type="button"
        >
          {isRetrying ? "Retrying…" : retryLabel}
        </Button>
      </div>
    </div>
  );
}

export function RouteSegmentError({
  description,
  error,
  reset,
  retryLabel = DEFAULT_RETRY_LABEL,
  segment,
  title,
  variant = "section",
}: RouteSegmentErrorProps) {
  const [isRetrying, startRetryTransition] = useTransition();

  useEffect(() => {
    reportClientError({
      digest: error.digest ?? "unknown",
      segment,
    });
  }, [error.digest, segment]);

  const handleRetry = () => {
    startRetryTransition(() => {
      reset();
    });
  };

  const containerClassName =
    variant === "page" ? "erp-route-error-page" : "erp-route-error-section";

  return (
    <div aria-live="assertive" className={containerClassName}>
      <RouteSegmentErrorPanel
        description={description}
        isRetrying={isRetrying}
        onRetry={handleRetry}
        retryLabel={retryLabel}
        title={title}
      />
    </div>
  );
}
