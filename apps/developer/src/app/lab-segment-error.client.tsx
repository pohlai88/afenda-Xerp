"use client";

import Link from "next/link";

interface LabSegmentErrorProps {
  readonly description: string;
  readonly reset: () => void;
  readonly title: string;
}

export function LabSegmentError({
  description,
  reset,
  title,
}: LabSegmentErrorProps) {
  return (
    <section
      aria-labelledby="lab-segment-error-title"
      className="flex min-h-[50vh] items-center justify-center"
    >
      <div
        className="w-full max-w-xl rounded-[1.75rem] border bg-background/95 p-8 shadow-xl"
        role="alert"
      >
        <p className="font-medium text-primary text-xs uppercase tracking-[0.28em]">
          Route Segment Failure
        </p>
        <h2
          className="mt-4 font-semibold text-2xl tracking-tight"
          id="lab-segment-error-title"
        >
          {title}
        </h2>
        <p className="mt-3 text-muted-foreground">{description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="rounded-full bg-primary px-5 py-2 font-medium text-primary-foreground"
            onClick={() => reset()}
            type="button"
          >
            Retry segment
          </button>
          <Link className="rounded-full border px-5 py-2 font-medium" href="/">
            Return to lab index
          </Link>
        </div>
      </div>
    </section>
  );
}
