import { AppShellMain } from "@afenda/appshell";
import {
  getAfendaAuthSession,
  isAfendaAuthSessionLinked,
  toAfendaAuthIdentity,
} from "@afenda/auth";
import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import { connection } from "next/server";
import { MetadataWorkspacePreviewSurface } from "@/components/metadata-workspace-preview-surface";
import { authorizeApiRoute } from "@/lib/api/authorize-api-route";
import { resolveOperatingContextFromHeaders } from "@/lib/context/resolve-operating-context-from-headers.server";
import { isEvaluatedApiRouteAuthorizationDenial } from "@/lib/metadata/resolve-metadata-authorization-from-api-route.server";
import { resolveMetadataUiRenderContextFromApiRouteAuthorization } from "@/lib/metadata/resolve-metadata-ui-render-context.server";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";

export default async function MetadataWorkspacePreviewPage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const requestHeaders = await headers();
  const session = await getAfendaAuthSession(requestHeaders);

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

  if (!operatingResult.ok) {
    forbidden();
  }

  const operatingContext = operatingResult.value;
  const authorizationRequest = new Request(
    "http://localhost/metadata-workspace",
    {
      headers: requestHeaders,
    }
  );

  const authorizationResult = await authorizeApiRoute({
    actorId: identity.userId,
    correlationId: operatingContext.correlationId,
    method: "GET",
    path: "/metadata-workspace",
    permission: {
      permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
    },
    protectionLevel: "tenant-protected",
    request: authorizationRequest,
  });

  if (
    authorizationResult.kind === "failure" &&
    !isEvaluatedApiRouteAuthorizationDenial(authorizationResult)
  ) {
    forbidden();
  }

  const metadataContext =
    await resolveMetadataUiRenderContextFromApiRouteAuthorization({
      authorizationResult,
    });

  if (metadataContext === null) {
    forbidden();
  }

  const previewOperatingContext = isEvaluatedApiRouteAuthorizationDenial(
    authorizationResult
  )
    ? authorizationResult.evaluation.operatingContext
    : operatingContext;

  return (
    <AppShellMain
      contentLabel="Metadata workspace preview"
      description="Production metadata renderer composition from server-resolved operating context."
      title="Metadata workspace"
    >
      <MetadataWorkspacePreviewSurface
        companyDisplayName={previewOperatingContext.legalEntity.displayName}
        context={metadataContext}
        organizationDisplayName={
          previewOperatingContext.organizationUnit?.displayName ?? null
        }
        tenantDisplayName={previewOperatingContext.tenant.displayName}
      />
    </AppShellMain>
  );
}
