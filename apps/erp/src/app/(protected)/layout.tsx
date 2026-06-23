import {
  AppShell,
  DashboardWidgetRenderContextProvider,
} from "@afenda/appshell";
import {
  getAfendaAuthSession,
  isAfendaAuthSessionLinked,
  toAfendaAuthIdentity,
} from "@afenda/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { ReactNode } from "react";

import { SignOutButton } from "@/components/sign-out-button";
import { WorkspaceContextSwitcher } from "@/components/workspace-context-switcher.client";
import { resolveAllowedContextOptions } from "@/lib/context/resolve-allowed-context-options.server";
import { resolveOperatingContextFromHeaders } from "@/lib/context/resolve-operating-context-from-headers.server";
import { toApplicationShellOperatingContext } from "@/lib/context/to-shell-operating-context";
import { internalErpMetadata } from "@/lib/metadata/site-metadata";
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
    redirect("/sign-in?error=unlinked");
  }

  const identity = toAfendaAuthIdentity(session);
  const operatingResult = await resolveOperatingContextFromHeaders({
    actorUserId: identity.userId,
  });
  const operatingContext = operatingResult.ok
    ? toApplicationShellOperatingContext(operatingResult.value)
    : undefined;
  const allowedContextOptions = operatingResult.ok
    ? await resolveAllowedContextOptions({
        actorUserId: identity.userId,
        selectedCompanySlug: operatingResult.value.legalEntity.slug,
        selectedOrganizationSlug:
          operatingResult.value.organizationUnit?.slug ?? null,
        tenantId: operatingResult.value.tenant.tenantId,
      })
    : { targets: [] };
  const contextSwitcher =
    operatingResult.ok && allowedContextOptions.targets.length > 1 ? (
      <WorkspaceContextSwitcher allowedOptions={allowedContextOptions} />
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

  return (
    <AppShell
      identity={identity}
      identityAccessory={<SignOutButton />}
      {...(contextSwitcher ? { contextSwitcher } : {})}
      {...(operatingContext ? { operatingContext } : {})}
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
    </AppShell>
  );
}
