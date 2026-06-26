import type { ReactNode } from "react";

import { AUTH_SECURITY_COPY } from "@/lib/auth/auth-copy.registry";

export function AuthSecurityNote({
  children = AUTH_SECURITY_COPY.linkExpiry,
}: {
  readonly children?: ReactNode;
}) {
  return (
    <p className="erp-auth-security-note" role="note">
      {children}
    </p>
  );
}
