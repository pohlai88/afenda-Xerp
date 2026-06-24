"use client";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
  Button,
} from "@afenda/ui";
import { mapStockButtonProps } from "@afenda/ui/governance";
import { useEffect } from "react";

import { reportClientError } from "@/lib/observability/report-client-error.client";

type RouteSegmentErrorBaseProps = {
  readonly description: string;
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
  readonly segment: string;
  readonly title: string;
};

export type RouteSegmentErrorSectionProps = RouteSegmentErrorBaseProps & {
  readonly variant?: "section";
};

export type RouteSegmentErrorPageProps = RouteSegmentErrorBaseProps & {
  readonly variant: "page";
};

export type RouteSegmentErrorProps =
  | RouteSegmentErrorPageProps
  | RouteSegmentErrorSectionProps;

const PAGE_CONTAINER_CLASS =
  "flex min-h-screen flex-col items-center justify-center gap-4 p-6" as const;

const SECTION_CONTAINER_CLASS = "flex flex-col gap-4 p-6" as const;

export function RouteSegmentError({
  description,
  error,
  reset,
  segment,
  title,
  variant = "section",
}: RouteSegmentErrorProps) {
  useEffect(() => {
    reportClientError({
      digest: error.digest ?? "unknown",
      segment,
    });
  }, [error.digest, segment]);

  const containerClassName =
    variant === "page" ? PAGE_CONTAINER_CLASS : SECTION_CONTAINER_CLASS;

  return (
    <div aria-live="assertive" className={containerClassName}>
      <Alert role="alert" tone="danger">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
        <AlertAction>
          <Button
            {...mapStockButtonProps("outline", "default")}
            onClick={reset}
            type="button"
          >
            Try again
          </Button>
        </AlertAction>
      </Alert>
    </div>
  );
}
