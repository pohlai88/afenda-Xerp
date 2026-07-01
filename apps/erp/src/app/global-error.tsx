"use client";

import {
  ERROR_PAGE_COPY_REGISTRY,
  ErrorPageShell,
} from "@afenda/shadcn-studio/error-ui";

import { ClientSafeRetryButton } from "@/components/client-safe-retry-button.client";

import "./globals.css";

interface GlobalErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const copy = ERROR_PAGE_COPY_REGISTRY["500"];

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <ErrorPageShell
          {...copy}
          action={<ClientSafeRetryButton onClick={reset} />}
          description={
            process.env.NODE_ENV === "development" && error.message
              ? `${copy.description} (${error.message})`
              : copy.description
          }
        />
      </body>
    </html>
  );
}
