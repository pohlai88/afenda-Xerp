"use client";

import { ClientSafeRetryButton } from "@/components/client-safe-retry-button.client";
import { ErpErrorPage } from "@/components/presentation/erp-error-page.client";

import "./globals.css";

interface GlobalErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function GlobalError({ error: _error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <head>
        <link href="/favicon-light.png" media="(prefers-color-scheme: light)" rel="icon" sizes="192x192" type="image/png" />
        <link href="/favicon-dark.png" media="(prefers-color-scheme: dark)" rel="icon" sizes="192x192" type="image/png" />
        <link href="/favicon.ico" rel="icon" />
        <link href="/icons/afenda-icon-180-transparent.png" rel="apple-touch-icon" sizes="180x180" />
      </head>
      <body>
        <ErpErrorPage
          action={<ClientSafeRetryButton onClick={reset} />}
          variant="500"
        />
      </body>
    </html>
  );
}
