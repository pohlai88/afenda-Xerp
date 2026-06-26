"use client";

import { RouteSegmentError } from "@/components/route-segment-error";

import "../globals.css";

interface GlobalErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <RouteSegmentError
          description="A critical error occurred while loading the application. Please try again."
          error={error}
          reset={reset}
          segment="global"
          title="Application error"
          variant="page"
        />
      </body>
    </html>
  );
}
