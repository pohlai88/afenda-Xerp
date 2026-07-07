"use client";

import { AuthIngressChrome } from "@/components/auth/auth-ingress-chrome.client";

import { AuthSegmentShell } from "./_components/auth-segment-shell";

interface AuthSegmentErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function AuthSegmentError({
  error,
  reset,
}: AuthSegmentErrorProps) {
  const message =
    process.env.NODE_ENV === "development" && error.message.length > 0
      ? `${error.message} Please try again.`
      : "We could not load this auth route. Please try again.";

  return (
    <AuthSegmentShell>
      <AuthIngressChrome
        message={message}
        onRetry={reset}
        state="error"
        title="Authentication surface error"
      />
    </AuthSegmentShell>
  );
}
