import type { ReactNode } from "react";
import type { AuthEntryRouteId } from "@/lib/auth/auth-route.registry";
import { AuthPageFooter } from "./auth-page-footer";
import { AuthSecurityNote } from "./auth-security-note";

export function AuthPageChrome({
  route,
  securityNote,
  showRouteLinks = true,
  showSecurityNote = false,
}: {
  readonly route: AuthEntryRouteId;
  readonly securityNote?: ReactNode;
  readonly showRouteLinks?: boolean;
  readonly showSecurityNote?: boolean;
}) {
  return (
    <>
      {showSecurityNote ? (
        <AuthSecurityNote>{securityNote}</AuthSecurityNote>
      ) : null}
      <AuthPageFooter route={route} showRouteLinks={showRouteLinks} />
    </>
  );
}

export function buildAuthPageFooter(route: AuthEntryRouteId): ReactNode {
  return <AuthPageFooter route={route} />;
}
