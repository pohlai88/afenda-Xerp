import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-dvh bg-background text-foreground"
      data-auth-segment="public"
    >
      {children}
    </div>
  );
}
