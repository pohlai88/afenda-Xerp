"use client";

import {
  ERROR_PAGE_COPY_REGISTRY,
  ErrorPageShell,
} from "@afenda/shadcn-studio/error-ui";

import { ClientSafeRetryButton } from "@/components/client-safe-retry-button.client";

interface RootErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  const copy = ERROR_PAGE_COPY_REGISTRY["500"];

  return (
    <ErrorPageShell
      {...copy}
      action={<ClientSafeRetryButton onClick={reset} />}
      description={
        process.env.NODE_ENV === "development" && error.message
          ? `${copy.description} (${error.message})`
          : copy.description
      }
    />
  );
}
