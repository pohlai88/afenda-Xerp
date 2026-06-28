import type { PermissionKey } from "@afenda/database";
import {
  normalizeCompanyIdForWire,
  normalizeEntityGroupIdForWire,
  normalizeOrganizationIdForWire,
  normalizeProjectIdForWire,
  normalizeTeamIdForWire,
  normalizeTenantIdForWire,
  type OperatingContext,
  type PermissionModelDescriptor,
  type PolicyDecision,
} from "@afenda/kernel";
import {
  createMetadataUiRenderContext,
  type MetadataUiRenderContext,
} from "@afenda/metadata-ui/server";
import type {
  PermissionDataSource,
  PolicyDataSource,
  PolicyEvaluationOptions,
} from "@afenda/permissions";
import { createMetadataRuntimeContext } from "@afenda/ui-composition";
import type { ApiRouteAuthorizationResult } from "@/lib/api/authorize-api-route.contract";
import { formatActiveWorkspaceId } from "@/lib/context/active-workspace-id.contract";
import { resolveMetadataAuthorizationSnapshotFromPreEvaluationDenial } from "./metadata-authorization-projection.server";
import { resolveMetadataActorUserIdFromOperatingContext } from "./resolve-metadata-auth-actor.server";
import {
  type MetadataAuthorizationSnapshot,
  resolveMetadataAuthorizationFromOperatingContext,
} from "./resolve-metadata-authorization.server";
import {
  isEvaluatedApiRouteAuthorizationDenial,
  isPreEvaluationMetadataContextRequiredDenial,
  resolveMetadataAuthorizationFromApiRouteResult,
  resolveOperatingContextFromApiRouteResult,
} from "./resolve-metadata-authorization-from-api-route.server";
import { resolveMetadataPermissionModelDescriptorsFromOperatingContext } from "./resolve-metadata-permission-model.server";
import { resolveMetadataPolicyDecisionFromOperatingContext } from "./resolve-metadata-policy-decision.server";

export interface ResolveMetadataUiRenderContextInput {
  readonly authorization?: MetadataAuthorizationSnapshot;
  readonly authorizationDenialPreview?: boolean;
  readonly boundaryPermissionKey?: PermissionKey | string;
  readonly capabilities?: readonly string[];
  readonly diagnosticsNamespace?: string;
  readonly operatingContext: OperatingContext;
  readonly permissionDataSource?: PermissionDataSource;
  readonly permissionModelDescriptors?: readonly PermissionModelDescriptor[];
  readonly permissions?: readonly string[];
  readonly policyDataSource?: PolicyDataSource;
  readonly policyDecision?: PolicyDecision;
  readonly policyEvaluationOptions?: PolicyEvaluationOptions;
  readonly skipLiveAuthorization?: boolean;
}

function resolveMetadataWorkspaceId(
  operatingContext: OperatingContext
): string {
  const organizationId =
    operatingContext.organizationUnit?.organizationUnitId ??
    operatingContext.workspace.organizationId;

  const tenantIdWire = normalizeTenantIdForWire(
    operatingContext.tenant.tenantId
  );
  const companyIdWire = normalizeCompanyIdForWire(
    operatingContext.legalEntity.companyId
  );
  if (companyIdWire === null) {
    throw new Error("Operating context legal entity companyId is required.");
  }

  return formatActiveWorkspaceId({
    tenantId: tenantIdWire,
    companyId: companyIdWire,
    organizationId:
      organizationId === undefined || organizationId === null
        ? null
        : normalizeOrganizationIdForWire(organizationId),
  });
}

function resolveMetadataHierarchyScopeCarriers(
  operatingContext: OperatingContext
): {
  readonly entityGroupId?: string;
  readonly projectId?: string;
  readonly teamId?: string;
} {
  const entityGroupId = operatingContext.entityGroup?.entityGroupId;
  const teamId = operatingContext.team?.teamId;
  const projectId =
    operatingContext.project?.projectId ??
    operatingContext.workspace.projectId ??
    undefined;

  const entityGroupIdWire =
    entityGroupId === undefined
      ? undefined
      : normalizeEntityGroupIdForWire(entityGroupId);
  const teamIdWire =
    teamId === undefined ? undefined : normalizeTeamIdForWire(teamId);
  const projectIdWire =
    projectId === undefined || projectId === null
      ? undefined
      : normalizeProjectIdForWire(projectId);

  return {
    ...(entityGroupIdWire === undefined || entityGroupIdWire === null
      ? {}
      : { entityGroupId: entityGroupIdWire }),
    ...(teamIdWire === undefined || teamIdWire === null
      ? {}
      : { teamId: teamIdWire }),
    ...(projectIdWire === undefined || projectIdWire === null
      ? {}
      : { projectId: projectIdWire }),
  };
}

/** Builds a server-side metadata render context from verified ERP operating context. */
export function resolveMetadataUiRenderContextFromOperatingContext(
  input: ResolveMetadataUiRenderContextInput
): MetadataUiRenderContext {
  const { operatingContext } = input;

  const organizationId =
    operatingContext.organizationUnit?.organizationUnitId ??
    operatingContext.workspace.organizationId ??
    undefined;

  const hierarchyScope =
    resolveMetadataHierarchyScopeCarriers(operatingContext);

  const liveAuthorization = input.authorization;
  const useLiveAuthorization =
    liveAuthorization !== undefined && input.skipLiveAuthorization !== true;

  const policyDecision = useLiveAuthorization
    ? liveAuthorization.policyDecision
    : resolveMetadataPolicyDecisionFromOperatingContext({
        operatingContext,
        ...(input.policyDecision === undefined
          ? {}
          : { override: input.policyDecision }),
      });

  const resolvedPermissionKeys = useLiveAuthorization
    ? liveAuthorization.permissionKeys
    : (input.permissions ?? []);

  const permissionModelDescriptors = useLiveAuthorization
    ? liveAuthorization.permissionModelDescriptors
    : resolveMetadataPermissionModelDescriptorsFromOperatingContext({
        operatingContext,
        ...(resolvedPermissionKeys.length === 0
          ? {}
          : { permissionKeys: resolvedPermissionKeys }),
        ...(input.permissionModelDescriptors === undefined
          ? {}
          : { overrides: input.permissionModelDescriptors }),
      });

  const authorizationDenialPreview = input.authorizationDenialPreview === true;

  const tenantIdWire = normalizeTenantIdForWire(
    operatingContext.tenant.tenantId
  );
  const companyIdWire = normalizeCompanyIdForWire(
    operatingContext.legalEntity.companyId
  );
  if (companyIdWire === null) {
    throw new Error("Operating context legal entity companyId is required.");
  }

  const organizationIdWire =
    organizationId === undefined
      ? undefined
      : normalizeOrganizationIdForWire(organizationId);

  const runtime = createMetadataRuntimeContext({
    actorId: resolveMetadataActorUserIdFromOperatingContext(operatingContext),
    tenantId: tenantIdWire,
    companyId: companyIdWire,
    ...(organizationIdWire === undefined || organizationIdWire === null
      ? {}
      : { organizationId: organizationIdWire }),
    ...hierarchyScope,
    workspaceId: resolveMetadataWorkspaceId(operatingContext),
    correlationId: operatingContext.correlationId,
    permissions: [...resolvedPermissionKeys],
    capabilities: input.capabilities ? [...input.capabilities] : [],
    density: "default",
    presentationMode: "default",
    state: authorizationDenialPreview ? "forbidden" : "ready",
    diagnosticsEnabled: authorizationDenialPreview,
    readonlyMode: authorizationDenialPreview,
    policyDecision,
    ...(permissionModelDescriptors.length === 0
      ? {}
      : { permissionModelDescriptors }),
  });

  return createMetadataUiRenderContext({
    runtime,
    source: "server",
    hydration: "none",
    diagnosticsLevel: authorizationDenialPreview ? "verbose" : "off",
    diagnosticsNamespace:
      input.diagnosticsNamespace ?? "erp.metadata-workspace",
  });
}

/** Production path — evaluates live authorization before composing metadata runtime. */
export async function resolveMetadataUiRenderContextFromOperatingContextAsync(
  input: Omit<
    ResolveMetadataUiRenderContextInput,
    "authorization" | "skipLiveAuthorization"
  > &
    Partial<
      Pick<
        ResolveMetadataUiRenderContextInput,
        "authorization" | "skipLiveAuthorization"
      >
    >
): Promise<MetadataUiRenderContext> {
  const authorization =
    input.authorization ??
    (input.skipLiveAuthorization === true
      ? undefined
      : await resolveMetadataAuthorizationFromOperatingContext({
          operatingContext: input.operatingContext,
          ...(input.boundaryPermissionKey === undefined
            ? {}
            : { boundaryPermissionKey: input.boundaryPermissionKey }),
          ...(input.permissionDataSource === undefined
            ? {}
            : { permissionDataSource: input.permissionDataSource }),
          ...(input.policyDataSource === undefined
            ? {}
            : { policyDataSource: input.policyDataSource }),
          ...(input.policyEvaluationOptions === undefined
            ? {}
            : { policyEvaluationOptions: input.policyEvaluationOptions }),
        }));

  return resolveMetadataUiRenderContextFromOperatingContext({
    ...input,
    ...(authorization === undefined ? {} : { authorization }),
  });
}

export interface ResolveMetadataUiRenderContextFromContextRequiredInput {
  readonly actorId: string;
  readonly authorization?: MetadataAuthorizationSnapshot;
  readonly correlationId: string;
}

/** Builds metadata runtime for pre-evaluation context-required preview (no operating context). */
export function resolveMetadataUiRenderContextFromContextRequiredPreview(
  input: ResolveMetadataUiRenderContextFromContextRequiredInput
): MetadataUiRenderContext {
  const authorization =
    input.authorization ??
    resolveMetadataAuthorizationSnapshotFromPreEvaluationDenial({
      denialCode: "missing_context",
    });

  const runtime = createMetadataRuntimeContext({
    actorId: input.actorId,
    correlationId: input.correlationId,
    permissions: [...authorization.permissionKeys],
    capabilities: [],
    density: "default",
    presentationMode: "default",
    state: "readonly",
    diagnosticsEnabled: true,
    readonlyMode: true,
    policyDecision: authorization.policyDecision,
    ...(authorization.permissionModelDescriptors.length === 0
      ? {}
      : {
          permissionModelDescriptors: [
            ...authorization.permissionModelDescriptors,
          ],
        }),
  });

  return createMetadataUiRenderContext({
    runtime,
    source: "server",
    hydration: "none",
    diagnosticsLevel: "verbose",
    diagnosticsNamespace: "erp.metadata-workspace",
  });
}

/** Production path — projects a completed `authorizeApiRoute` result into metadata runtime. */
export async function resolveMetadataUiRenderContextFromApiRouteAuthorization(input: {
  readonly actorId: string;
  readonly authorizationResult: ApiRouteAuthorizationResult;
  readonly capabilities?: readonly string[];
  readonly permissionDataSource?: PermissionDataSource;
}): Promise<MetadataUiRenderContext | null> {
  const operatingContext = resolveOperatingContextFromApiRouteResult(
    input.authorizationResult
  );

  if (operatingContext === null) {
    if (
      !isPreEvaluationMetadataContextRequiredDenial(input.authorizationResult)
    ) {
      return null;
    }

    const authorization = await resolveMetadataAuthorizationFromApiRouteResult({
      result: input.authorizationResult,
      ...(input.permissionDataSource === undefined
        ? {}
        : { permissionDataSource: input.permissionDataSource }),
    });

    if (authorization === null) {
      return null;
    }

    return resolveMetadataUiRenderContextFromContextRequiredPreview({
      actorId: input.actorId,
      correlationId: input.authorizationResult.correlationId,
      authorization,
    });
  }

  const authorization = await resolveMetadataAuthorizationFromApiRouteResult({
    result: input.authorizationResult,
    ...(input.permissionDataSource === undefined
      ? {}
      : { permissionDataSource: input.permissionDataSource }),
  });

  if (authorization === null) {
    return null;
  }

  const authorizationDenialPreview = isEvaluatedApiRouteAuthorizationDenial(
    input.authorizationResult
  );

  return resolveMetadataUiRenderContextFromOperatingContext({
    operatingContext,
    authorization,
    authorizationDenialPreview,
    ...(input.capabilities === undefined
      ? {}
      : { capabilities: input.capabilities }),
  });
}
