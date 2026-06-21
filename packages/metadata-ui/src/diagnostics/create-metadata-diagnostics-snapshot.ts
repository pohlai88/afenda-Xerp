import type {
  CreateMetadataDiagnosticsSnapshotInput,
  MetadataDiagnosticsIdentitySnapshot,
  MetadataDiagnosticsSnapshot,
} from "../contracts/diagnostics.contract.js";
import type { MetadataUiRenderContext } from "../contracts/render-context.contract.js";

function createIdentitySnapshot(
  context: MetadataUiRenderContext
): MetadataDiagnosticsIdentitySnapshot | undefined {
  const { runtime } = context;
  const identity: MetadataDiagnosticsIdentitySnapshot = {
    ...(runtime.actorId !== undefined ? { actorId: runtime.actorId } : {}),
    ...(runtime.tenantId !== undefined ? { tenantId: runtime.tenantId } : {}),
    ...(runtime.companyId !== undefined ? { companyId: runtime.companyId } : {}),
    ...(runtime.organizationId !== undefined
      ? { organizationId: runtime.organizationId }
      : {}),
    ...(runtime.workspaceId !== undefined
      ? { workspaceId: runtime.workspaceId }
      : {}),
  };

  return Object.keys(identity).length > 0 ? identity : undefined;
}

export function createMetadataDiagnosticsSnapshot(
  context: MetadataUiRenderContext,
  input: CreateMetadataDiagnosticsSnapshotInput = {}
): MetadataDiagnosticsSnapshot {
  const { runtime } = context;
  const identity = createIdentitySnapshot(context);

  return {
    ...(identity !== undefined ? { identity } : {}),
    ...(input.surface !== undefined ? { surface: input.surface } : {}),
    ...(input.renderer !== undefined ? { renderer: input.renderer } : {}),
    runtime: {
      runtimeState: runtime.state,
      readonlyMode: runtime.readonlyMode,
      diagnosticsEnabled: context.diagnostics.enabled,
      ...(runtime.correlationId !== undefined
        ? { correlationId: runtime.correlationId }
        : {}),
    },
    presentation: {
      densityMode: runtime.density,
      presentationMode: runtime.presentationMode,
    },
  };
}
