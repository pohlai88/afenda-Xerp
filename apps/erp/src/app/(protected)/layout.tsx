import { DashboardWidgetRenderContextProvider } from "@afenda/appshell";
import {
  getAfendaAuthSession,
  isAfendaAuthSessionLinked,
  toAfendaAuthIdentity,
} from "@afenda/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { ErpApplicationShell } from "@/components/erp-application-shell.client";
import { SignOutButton } from "@/components/sign-out-button";
import { WorkspaceContextSwitcher } from "@/components/workspace-context-switcher.client";
import { resolveUnlinkedSessionRedirect } from "@/lib/auth/auth-redirect.policy";
import { resolveProtectedPathActorUserIdFromSession } from "@/lib/auth/resolve-protected-path-actor.server";
import { resolveAllowedContextOptions } from "@/lib/context/resolve-allowed-context-options.server";
import { resolveContextSwitchPresentation } from "@/lib/context/resolve-context-switch-presentation";
import { resolveOperatingContextFromHeaders } from "@/lib/context/resolve-operating-context-from-headers.server";
import { toApplicationShellOperatingContext } from "@/lib/context/to-shell-operating-context";
import { internalErpMetadata } from "@/lib/metadata/site-metadata";
import { resolveActiveRoutePathFromHeaders } from "@/lib/modules/resolve-active-route-path-from-headers.server";
import { resolveManifestNavigationFromOperatingContext } from "@/lib/modules/resolve-manifest-navigation.server";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import {
  emptyDashboardWidgetRenderContext,
  resolveDashboardWidgetRenderContextFromOperatingContext,
  resolveWorkspaceDashboardCapabilitiesFromOperatingContext,
} from "@/lib/workspace/resolve-dashboard-widget-render-context.server";
import { toWorkspaceApiScope } from "@/lib/workspace/to-workspace-api-scope";
import { WorkspaceApiScopeBoundary } from "@/lib/workspace/workspace-api-scope-boundary.client";
import { WorkspaceDashboardCapabilitiesProvider } from "@/lib/workspace/workspace-dashboard-capabilities.context";
import { READONLY_WORKSPACE_DASHBOARD_CAPABILITIES } from "@/lib/workspace/workspace-dashboard-capabilities.contract";

export const metadata = internalErpMetadata;

/** Production ApplicationShell layout — identity, context, manifest nav, and dashboard providers. */
export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const session = await getAfendaAuthSession(await headers());

  if (!session) {
    redirect("/sign-in");
  }

  if (!isAfendaAuthSessionLinked(session)) {
    redirect(resolveUnlinkedSessionRedirect());
  }

  const requestHeaders = await headers();
  const activeRoutePath = resolveActiveRoutePathFromHeaders(requestHeaders);
  const identity = toAfendaAuthIdentity(session);
  const actorUserId = resolveProtectedPathActorUserIdFromSession(session);
  const operatingResult = await resolveOperatingContextFromHeaders({
    actorUserId,
    activeWorkspaceId: session.metadata.activeWorkspaceId,
  });

  if (operatingResult.ok) {
    const { gateTenantMfaPolicyFromHeaders } = await import(
      "@/lib/auth/gate-tenant-mfa-policy.server"
    );

    await gateTenantMfaPolicyFromHeaders({
      headerStore: requestHeaders,
      operatingContext: operatingResult.value,
      session,
    });
  }

  const operatingContext = operatingResult.ok
    ? toApplicationShellOperatingContext(operatingResult.value)
    : undefined;
  const allowedContextOptions = operatingResult.ok
    ? await resolveAllowedContextOptions({
        actorUserId,
        selectedCompanySlug: operatingResult.value.legalEntity.slug,
        selectedOrganizationSlug:
          operatingResult.value.organizationUnit?.slug ?? null,
        tenantId: operatingResult.value.tenant.tenantId,
      })
    : { targets: [] };
  const contextSwitchPresentation = resolveContextSwitchPresentation(
    allowedContextOptions
  );
  const contextSwitcher = operatingResult.ok ? (
    contextSwitchPresentation.shouldRender ? (
      <WorkspaceContextSwitcher allowedOptions={allowedContextOptions} />
    ) : undefined
  ) : undefined;
  const workspaceScope = operatingResult.ok
    ? toWorkspaceApiScope(operatingResult.value)
    : null;
  const dashboardRenderContext = operatingResult.ok
    ? await resolveDashboardWidgetRenderContextFromOperatingContext(
        operatingResult.value
      )
    : emptyDashboardWidgetRenderContext();
  const dashboardCapabilities = operatingResult.ok
    ? await resolveWorkspaceDashboardCapabilitiesFromOperatingContext(
        operatingResult.value
      )
    : READONLY_WORKSPACE_DASHBOARD_CAPABILITIES;
  const manifestNavigation = operatingResult.ok
    ? await resolveManifestNavigationFromOperatingContext(
        operatingResult.value,
        undefined,
        activeRoutePath
      )
    : undefined;

  return (
    <ErpApplicationShell
      identity={identity}
      identityAccessory={<SignOutButton />}
      {...(contextSwitcher ? { contextSwitcher } : {})}
      {...(operatingContext ? { operatingContext } : {})}
      {...(operatingResult.ok ? { manifestNavigation } : {})}
    >
      <WorkspaceApiScopeBoundary
        requireScope
        scope={workspaceScope}
        {...(operatingResult.ok
          ? {}
          : { unavailableReason: operatingResult.error.code })}
      >
        <DashboardWidgetRenderContextProvider value={dashboardRenderContext}>
          <WorkspaceDashboardCapabilitiesProvider value={dashboardCapabilities}>
            {children}
          </WorkspaceDashboardCapabilitiesProvider>
        </DashboardWidgetRenderContextProvider>
      </WorkspaceApiScopeBoundary>
    </ErpApplicationShell>
  );
}
