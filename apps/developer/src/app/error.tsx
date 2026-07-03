"use client";

interface RootErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  const message = error.message || "The developer route lab could not render.";

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background p-6">
      <div className="flex max-w-md flex-col gap-4 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">
          Developer lab unavailable
        </h1>
        <p className="text-muted-foreground text-sm">{message}</p>
        <div>
          <button
            className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 font-medium text-sm transition-colors hover:bg-accent"
            onClick={reset}
            type="button"
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
