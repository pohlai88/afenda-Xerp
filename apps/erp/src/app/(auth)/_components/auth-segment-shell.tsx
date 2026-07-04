import type { ReactNode } from "react";

interface AuthSegmentShellProps {
  readonly children: ReactNode;
}

export function AuthSegmentShell({ children }: AuthSegmentShellProps) {
  return (
    <div
      className="min-h-dvh bg-background text-foreground"
      data-auth-segment="public"
    >
      {children}
    </div>
  );
}
