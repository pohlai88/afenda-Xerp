"use client";

import { LabSegmentError } from "@/components/lab-segment-error.client";

interface RootErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background p-6">
      <LabSegmentError error={error} reset={reset} />
    </main>
  );
}
