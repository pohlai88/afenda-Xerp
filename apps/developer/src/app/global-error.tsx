"use client";

interface GlobalErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const message = error.message || "The developer app could not recover.";

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main className="flex min-h-dvh flex-col items-center justify-center p-6">
          <div className="flex max-w-md flex-col gap-4 text-center">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
              Developer route lab
            </p>
            <h1 className="font-semibold text-2xl tracking-tight">
              Global render failure
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
      </body>
    </html>
  );
}
