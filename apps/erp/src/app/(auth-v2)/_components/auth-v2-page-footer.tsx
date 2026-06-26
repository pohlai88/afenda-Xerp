import type { AuthV2RouteId } from "@/lib/auth-v2/auth-v2-route.registry";

import { AuthV2LegalLinks } from "./auth-v2-legal-links";
import { AuthV2RouteLinks } from "./auth-v2-route-links";

export function AuthV2PageFooter({
  route,
  showRouteLinks = true,
}: {
  readonly route: AuthV2RouteId;
  readonly showRouteLinks?: boolean;
}) {
  return (
    <div className="erp-auth-v2-page-footer">
      <AuthV2LegalLinks />
      {showRouteLinks ? <AuthV2RouteLinks route={route} /> : null}
    </div>
  );
}
