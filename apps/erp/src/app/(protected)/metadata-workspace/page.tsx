import { AppShellMain } from "@afenda/appshell";
import {
  getAfendaAuthSession,
  isAfendaAuthSessionLinked,
  toAfendaAuthIdentity,
} from "@afenda/auth";
import { headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import { connection } from "next/server";

import { MetadataWorkspacePreviewSurface } from "@/components/metadata-workspace-preview-surface";
import { resolveOperatingContextFromHeaders } from "@/lib/context/resolve-operating-context-from-headers.server";
import { resolveMetadataUiRenderContextFromOperatingContext } from "@/lib/metadata/resolve-metadata-ui-render-context.server";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";

export default async function MetadataWorkspacePreviewPage() {
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

  if (!operatingResult.ok) {
    forbidden();
  }

  const operatingContext = operatingResult.value;
  const metadataContext = resolveMetadataUiRenderContextFromOperatingContext({
    operatingContext,
  });

  return (
    <AppShellMain
      contentLabel="Metadata workspace preview"
      description="Production metadata renderer composition from server-resolved operating context."
      title="Metadata workspace"
    >
      <MetadataWorkspacePreviewSurface
        companyDisplayName={operatingContext.legalEntity.displayName}
        context={metadataContext}
        organizationDisplayName={
          operatingContext.organizationUnit?.displayName ?? null
        }
        tenantDisplayName={operatingContext.tenant.displayName}
      />
    </AppShellMain>
  );
}
