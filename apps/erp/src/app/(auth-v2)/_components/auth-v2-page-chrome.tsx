import type { ReactNode } from "react";

import type { AuthV2RouteId } from "@/lib/auth-v2/auth-v2-route.registry";

import { AuthV2PageFooter } from "./auth-v2-page-footer";

export function AuthV2PageChrome({
  route,
  showRouteLinks = true,
}: {
  readonly route: AuthV2RouteId;
  readonly showRouteLinks?: boolean;
}) {
  return <AuthV2PageFooter route={route} showRouteLinks={showRouteLinks} />;
}

export function buildAuthV2PageFooter(route: AuthV2RouteId): ReactNode {
  return <AuthV2PageFooter route={route} />;
}
