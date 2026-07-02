"use client";

import { LabSegmentError } from "@/components/lab-segment-error.client";

interface AdminSegmentErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function AdminSegmentError({
  error,
  reset,
}: AdminSegmentErrorProps) {
  return <LabSegmentError error={error} reset={reset} title="Admin error" />;
}
