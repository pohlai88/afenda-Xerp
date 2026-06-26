import type { AuthRouteId } from "@/lib/auth/auth-route.registry";

import { AuthLegalLinks } from "./auth-legal-links";
import { AuthRouteLinks } from "./auth-route-links";

export function AuthPageFooter({
  route,
  showRouteLinks = true,
}: {
  readonly route: AuthRouteId;
  readonly showRouteLinks?: boolean;
}) {
  return (
    <div className="erp-auth-page-footer">
      <AuthLegalLinks />
      {showRouteLinks ? <AuthRouteLinks route={route} /> : null}
    </div>
  );
}
