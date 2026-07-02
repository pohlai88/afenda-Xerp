"use client";

import { LabSegmentError } from "@/components/lab-segment-error.client";

interface LabLayoutErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function LabLayoutError({ error, reset }: LabLayoutErrorProps) {
  return (
    <LabSegmentError
      error={error}
      reset={reset}
      title="Route lab shell error"
    />
  );
}
