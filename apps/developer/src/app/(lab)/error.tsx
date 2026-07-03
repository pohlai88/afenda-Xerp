"use client";

interface LabLayoutErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function LabLayoutError({ error, reset }: LabLayoutErrorProps) {
  const message = error.message || "The route lab shell could not render.";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-semibold text-2xl tracking-tight">
        Route lab shell error
      </h1>
      <p className="max-w-md text-muted-foreground text-sm">{message}</p>
      <button
        className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 font-medium text-sm transition-colors hover:bg-accent"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </div>
  );
}
