"use client";

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
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="w-full max-w-xl rounded-[1.75rem] border bg-background/95 p-8 shadow-xl">
        <p className="font-medium text-primary text-xs uppercase tracking-[0.28em]">
          Route Segment Failure
        </p>
        <h2 className="mt-4 font-semibold text-2xl tracking-tight">{title}</h2>
        <p className="mt-3 text-muted-foreground">{description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="rounded-full bg-primary px-5 py-2 font-medium text-primary-foreground"
            onClick={() => reset()}
            type="button"
          >
            Retry segment
          </button>
          <a className="rounded-full border px-5 py-2 font-medium" href="/">
            Return to lab index
          </a>
        </div>
      </div>
    </div>
  );
}
