import type { ReactNode } from "react";

export function AuthStatusMessage({
  children,
  tone = "neutral",
}: {
  readonly children: ReactNode;
  readonly tone?: "neutral" | "positive" | "negative";
}) {
  return (
    <div
      aria-live="polite"
      className={`erp-auth-status-message erp-auth-status-message--${tone}`}
      role="status"
    >
      {children}
    </div>
  );
}
