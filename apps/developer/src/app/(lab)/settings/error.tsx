"use client";

import { LabSegmentError } from "@/components/lab-segment-error.client";

interface SettingsSegmentErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function SettingsSegmentError({
  error,
  reset,
}: SettingsSegmentErrorProps) {
  return <LabSegmentError error={error} reset={reset} title="Settings error" />;
}
