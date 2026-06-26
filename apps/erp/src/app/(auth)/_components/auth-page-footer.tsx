import type { AuthRouteId } from "@/lib/auth/auth-route.registry";

import { AuthLegalLinks } from "./auth-legal-links";
import { AuthRouteLinks } from "./auth-route-links";

export function AuthPageFooter({ route }: { readonly route: AuthRouteId }) {
  return (
    <div className="erp-auth-page-footer">
      <AuthLegalLinks />
      <AuthRouteLinks route={route} />
    </div>
  );
}
