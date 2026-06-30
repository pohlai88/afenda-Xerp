"use client";

import { Button } from "@afenda/shadcn-studio";

import "./globals.css";

interface GlobalErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
          <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center">
            <h1 className="font-semibold text-foreground text-xl">
              Application error
            </h1>
            <p className="text-muted-foreground text-sm">
              A critical error occurred while loading the application. Please
              try again.
            </p>
            {process.env.NODE_ENV === "development" && error.message ? (
              <p className="text-muted-foreground text-sm">{error.message}</p>
            ) : null}
            <Button onClick={reset} type="button">
              Try again
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
