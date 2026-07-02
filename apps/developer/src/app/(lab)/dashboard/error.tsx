"use client";

import { LabSegmentError } from "@/components/lab-segment-error.client";

interface DashboardSegmentErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function DashboardSegmentError({
  error,
  reset,
}: DashboardSegmentErrorProps) {
  return (
    <LabSegmentError error={error} reset={reset} title="Dashboard error" />
  );
}
