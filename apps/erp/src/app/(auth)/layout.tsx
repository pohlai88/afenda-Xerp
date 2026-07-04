import type { ReactNode } from "react";

import { AuthSegmentShell } from "./_components/auth-segment-shell";

interface AuthLayoutProps {
  readonly children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <AuthSegmentShell>{children}</AuthSegmentShell>;
}
