import type {
  CreateMetadataDiagnosticsSnapshotInput,
  MetadataDiagnosticsIdentitySnapshot,
  MetadataDiagnosticsSnapshot,
} from "../contracts/diagnostics.contract.js";
import type { MetadataUiRenderContext } from "../contracts/render-context.contract.js";

function hasOwnSnapshotKeys(snapshot: object): boolean {
  return Object.keys(snapshot).length > 0;
}

function createMetadataDiagnosticsIdentitySnapshot(
  context: MetadataUiRenderContext,
  inputIdentity?: MetadataDiagnosticsIdentitySnapshot
): MetadataDiagnosticsIdentitySnapshot | undefined {
  const { runtime } = context;

  const identity: MetadataDiagnosticsIdentitySnapshot = {
    ...(runtime.actorId === undefined ? {} : { actorId: runtime.actorId }),
    ...(runtime.tenantId === undefined ? {} : { tenantId: runtime.tenantId }),
    ...(runtime.companyId === undefined
      ? {}
      : { companyId: runtime.companyId }),
    ...(runtime.organizationId === undefined
      ? {}
      : { organizationId: runtime.organizationId }),
    ...(runtime.workspaceId === undefined
      ? {}
      : { workspaceId: runtime.workspaceId }),

    /**
     * Input identity intentionally wins.
     *
     * This allows tests, static previews, or specialized renderers to provide
     * a narrowed/sanitized identity snapshot without mutating runtime context.
     */
    ...(inputIdentity ?? {}),
  };

  return hasOwnSnapshotKeys(identity) ? identity : undefined;
}

function createMetadataDiagnosticsRuntimeSnapshot(
  context: MetadataUiRenderContext
): MetadataDiagnosticsSnapshot["runtime"] {
  const { runtime } = context;

  return {
    runtimeState: runtime.state,
    readonlyMode: runtime.readonlyMode,
    diagnosticsEnabled: context.diagnostics.enabled,
    ...(runtime.correlationId === undefined
      ? {}
      : { correlationId: runtime.correlationId }),
  };
}

function createMetadataDiagnosticsPresentationSnapshot(
  context: MetadataUiRenderContext
): MetadataDiagnosticsSnapshot["presentation"] {
  const { runtime } = context;

  return {
    densityMode: runtime.density,
    presentationMode: runtime.presentationMode,
  };
}

export function createMetadataDiagnosticsSnapshot(
  context: MetadataUiRenderContext,
  input: CreateMetadataDiagnosticsSnapshotInput = {}
): MetadataDiagnosticsSnapshot {
  const identity = createMetadataDiagnosticsIdentitySnapshot(
    context,
    input.identity
  );

  return {
    ...(identity === undefined ? {} : { identity }),
    ...(input.surface === undefined ? {} : { surface: input.surface }),
    ...(input.renderer === undefined ? {} : { renderer: input.renderer }),
    runtime: createMetadataDiagnosticsRuntimeSnapshot(context),
    presentation: createMetadataDiagnosticsPresentationSnapshot(context),
  };
}
