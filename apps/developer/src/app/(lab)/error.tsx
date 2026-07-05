"use client";

import { LabSegmentError } from "../lab-segment-error.client";

export default function LabError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <LabSegmentError
      description="The route-lab shell failed while composing an operator surface. Reset the segment and verify the current page contract or loader shape."
      reset={reset}
      title="The operator route shell could not recover the current segment."
    />
  );
}
