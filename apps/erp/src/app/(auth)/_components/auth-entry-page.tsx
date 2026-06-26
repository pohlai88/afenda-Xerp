import {
  AuthShellEntryPage,
  type AuthShellEntryPageProps,
} from "@afenda/appshell/auth-shell";
import type { ReactNode } from "react";

import {
  type AuthEntryRouteId,
  resolveAuthEntryRouteCopy,
} from "@/lib/auth/auth-route.registry";

import { AuthPageChrome } from "./auth-page-chrome";

export type AuthEntryPageProps = Pick<AuthShellEntryPageProps, "children"> & {
  readonly brandPanel?: ReactNode;
  readonly footer?: ReactNode;
  readonly route: AuthEntryRouteId;
  readonly showDefaultChrome?: boolean;
  readonly showRouteLinks?: boolean;
  readonly showSecurityNote?: boolean;
  readonly securityNote?: ReactNode;
};

/**
 * Canonical app-level auth page adapter.
 *
 * Ownership:
 * - resolves route-specific auth copy from AUTH_ROUTE_REGISTRY
 * - composes the shared AppShell auth entry page
 * - attaches default auth chrome when enabled
 *
 * Does not own:
 * - form mutation
 * - auth provider calls
 * - session validation
 * - redirect policy
 * - raw provider error mapping
 */
export function AuthEntryPage({
  brandPanel,
  children,
  footer,
  route,
  showDefaultChrome = true,
  showRouteLinks = true,
  showSecurityNote = false,
  securityNote,
}: AuthEntryPageProps) {
  const { formDescription, formEyebrow, formHeading } =
    resolveAuthEntryRouteCopy(route);

  const resolvedFooter =
    footer ??
    (showDefaultChrome ? (
      <AuthPageChrome
        route={route}
        securityNote={securityNote}
        showRouteLinks={showRouteLinks}
        showSecurityNote={showSecurityNote}
      />
    ) : null);

  return (
    <AuthShellEntryPage
      brandPanel={brandPanel}
      formDescription={formDescription}
      formEyebrow={formEyebrow}
      formFooter={resolvedFooter}
      formHeading={formHeading}
    >
      {children}
    </AuthShellEntryPage>
  );
}
