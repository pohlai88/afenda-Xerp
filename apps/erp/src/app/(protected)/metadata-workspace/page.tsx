import { AppShellMain } from "@afenda/appshell";
import { getAfendaAuthSession, isAfendaAuthSessionLinked } from "@afenda/auth";
import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import { connection } from "next/server";
import { MetadataWorkspacePreviewSurface } from "@/components/metadata-workspace-preview-surface";
import { authorizeApiRoute } from "@/lib/api/authorize-api-route";
import { isOperatingContextContextRequiredError } from "@/lib/context/context-errors";
import { resolveOperatingContextFromHeaders } from "@/lib/context/resolve-operating-context-from-headers.server";
import { resolveMetadataActorUserIdFromAfendaAuthSession } from "@/lib/metadata/resolve-metadata-auth-actor.server";
import {
  isEvaluatedApiRouteAuthorizationDenial,
  isPreEvaluationMetadataContextRequiredDenial,
} from "@/lib/metadata/resolve-metadata-authorization-from-api-route.server";
import {
  resolveMetadataUiRenderContextFromApiRouteAuthorization,
  resolveMetadataUiRenderContextFromContextRequiredPreview,
} from "@/lib/metadata/resolve-metadata-ui-render-context.server";
import { resolveCorrelationIdFromHeaders } from "@/lib/observability/resolve-correlation-id";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";

const CONTEXT_REQUIRED_TENANT_DISPLAY = "Not selected";
const CONTEXT_REQUIRED_COMPANY_DISPLAY = "—";

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

  const actorUserId = resolveMetadataActorUserIdFromAfendaAuthSession(session);
  const correlationId = resolveCorrelationIdFromHeaders(requestHeaders);
  const operatingResult = await resolveOperatingContextFromHeaders({
    actorUserId,
  });

  if (!operatingResult.ok) {
    if (!isOperatingContextContextRequiredError(operatingResult.error)) {
      forbidden();
    }

    const metadataContext =
      resolveMetadataUiRenderContextFromContextRequiredPreview({
        actorId: actorUserId,
        correlationId,
      });

    return (
      <AppShellMain
        contentLabel="Metadata workspace preview"
        description="Metadata defer preview when workspace context is not yet selected."
        title="Metadata workspace"
      >
        <MetadataWorkspacePreviewSurface
          companyDisplayName={CONTEXT_REQUIRED_COMPANY_DISPLAY}
          context={metadataContext}
          organizationDisplayName={null}
          tenantDisplayName={CONTEXT_REQUIRED_TENANT_DISPLAY}
        />
      </AppShellMain>
    );
  }

  const operatingContext = operatingResult.value;
  const authorizationRequest = new Request(
    "http://localhost/metadata-workspace",
    {
      headers: requestHeaders,
    }
  );

  const authorizationResult = await authorizeApiRoute({
    actorId: actorUserId,
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
    !isEvaluatedApiRouteAuthorizationDenial(authorizationResult) &&
    !isPreEvaluationMetadataContextRequiredDenial(authorizationResult)
  ) {
    forbidden();
  }

  const metadataContext =
    await resolveMetadataUiRenderContextFromApiRouteAuthorization({
      actorId: actorUserId,
      authorizationResult,
    });

  if (metadataContext === null) {
    forbidden();
  }

  const contextRequiredPreview =
    isPreEvaluationMetadataContextRequiredDenial(authorizationResult);

  const previewOperatingContext = isEvaluatedApiRouteAuthorizationDenial(
    authorizationResult
  )
    ? authorizationResult.evaluation.operatingContext
    : operatingContext;

  return (
    <AppShellMain
      contentLabel="Metadata workspace preview"
      description={
        contextRequiredPreview
          ? "Metadata defer preview when workspace context is not yet selected."
          : "Production metadata renderer composition from server-resolved operating context."
      }
      title="Metadata workspace"
    >
      <MetadataWorkspacePreviewSurface
        companyDisplayName={
          contextRequiredPreview
            ? CONTEXT_REQUIRED_COMPANY_DISPLAY
            : previewOperatingContext.legalEntity.displayName
        }
        context={metadataContext}
        organizationDisplayName={
          contextRequiredPreview
            ? null
            : (previewOperatingContext.organizationUnit?.displayName ?? null)
        }
        tenantDisplayName={
          contextRequiredPreview
            ? CONTEXT_REQUIRED_TENANT_DISPLAY
            : previewOperatingContext.tenant.displayName
        }
      />
    </AppShellMain>
  );
}
