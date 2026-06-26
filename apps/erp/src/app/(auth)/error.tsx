"use client";

import { AppShellAuthErrorPage02 } from "@afenda/appshell";
import { useEffect } from "react";

import { reportClientError } from "@/lib/observability/report-client-error.client";

interface AuthErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function AuthError({ error, reset }: AuthErrorProps) {
  useEffect(() => {
    reportClientError({
      digest: error.digest ?? "unknown",
      segment: "auth",
    });
  }, [error.digest]);

  return (
    <div role="alert">
      <AppShellAuthErrorPage02
        description="The sign-in surface failed to load. Please try again."
        onRetry={reset}
        title="Something went wrong"
      />
    </div>
  );
}
