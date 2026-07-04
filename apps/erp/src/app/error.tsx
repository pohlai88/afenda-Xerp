"use client";

import { ClientSafeRetryButton } from "@/components/client-safe-retry-button.client";
import { ErpErrorPage } from "@/components/presentation/erp-error-page.client";

interface RootErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function RootError({ error: _error, reset }: RootErrorProps) {
  return (
    <ErpErrorPage
      action={<ClientSafeRetryButton onClick={reset} />}
      variant="500"
    />
  );
}
