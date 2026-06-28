import type { PermissionKey } from "@afenda/database";
import type { OperatingContext } from "@afenda/kernel";
import {
  checkPermission,
  createProductionAuthorizationDataSources,
  evaluateAuthorizationPolicy,
  InMemoryPolicyDataSource,
  isDeniedAuthorizationResult,
  PERMISSION_REGISTRY,
  type PermissionDataSource,
  type PolicyDataSource,
  type PolicyEvaluationOptions,
  productionPolicyEvaluationOptions,
} from "@afenda/permissions";
import type {
  MetadataRuntimePermissionModelDescriptor,
  MetadataRuntimePolicyDecision,
} from "@afenda/ui-composition";

import { toPermissionCheckContextFromOperatingContext } from "@/lib/permissions/to-permission-check-context.server";
import { resolveDeniedBoundaryPermissionModelDescriptors } from "./metadata-authorization-projection.server";
import { resolveMetadataPermissionModelDescriptorsFromGrantedKeys } from "./resolve-metadata-permission-model.server";
import { resolveMetadataPolicyDecisionFromAuthorizationEvaluation } from "./resolve-metadata-policy-decision.server";

/** Default metadata workspace boundary permission for live evaluation. */
export const METADATA_WORKSPACE_BOUNDARY_PERMISSION_KEY =
  PERMISSION_REGISTRY.workspace.dashboard.read;

export interface MetadataAuthorizationSnapshot {
  readonly permissionKeys: readonly string[];
  readonly permissionModelDescriptors: readonly MetadataRuntimePermissionModelDescriptor[];
  readonly policyDecision: MetadataRuntimePolicyDecision;
}

export interface ResolveMetadataAuthorizationInput {
  readonly boundaryPermissionKey?: PermissionKey | string;
  readonly operatingContext: OperatingContext;
  readonly permissionDataSource?: PermissionDataSource;
  readonly policyDataSource?: PolicyDataSource;
  readonly policyEvaluationOptions?: PolicyEvaluationOptions;
}

/**
 * Evaluates live permission + policy authorization for metadata runtime carriers.
 * Mirrors API-route class evaluation — not default-allow operating-context inference.
 */
export async function resolveMetadataAuthorizationFromOperatingContext(
  input: ResolveMetadataAuthorizationInput
): Promise<MetadataAuthorizationSnapshot> {
  const boundaryPermissionKey =
    input.boundaryPermissionKey ?? METADATA_WORKSPACE_BOUNDARY_PERMISSION_KEY;

  const permissionDataSource =
    input.permissionDataSource ??
    createProductionAuthorizationDataSources().permission;

  const permissionRequest = {
    actor: { actorId: input.operatingContext.actor.userId },
    context: toPermissionCheckContextFromOperatingContext(
      input.operatingContext
    ),
    correlationId: input.operatingContext.correlationId,
    permissionKey: boundaryPermissionKey,
  };

  const permissionResult = await checkPermission(
    permissionRequest,
    permissionDataSource
  );

  if (isDeniedAuthorizationResult(permissionResult)) {
    return {
      policyDecision: resolveMetadataPolicyDecisionFromAuthorizationEvaluation({
        decision: permissionResult.decision,
        denialCode: permissionResult.code,
      }),
      permissionKeys: [],
      permissionModelDescriptors:
        resolveDeniedBoundaryPermissionModelDescriptors({
          operatingContext: input.operatingContext,
          permissionKey: boundaryPermissionKey,
        }),
    };
  }

  const policyDataSource =
    input.policyDataSource ??
    (input.permissionDataSource === undefined
      ? createProductionAuthorizationDataSources().policy
      : new InMemoryPolicyDataSource());
  const policyEvaluationOptions =
    input.policyEvaluationOptions ??
    (input.permissionDataSource === undefined &&
    input.policyDataSource === undefined
      ? productionPolicyEvaluationOptions
      : {});

  const evaluatedDecision = await evaluateAuthorizationPolicy(
    permissionResult.decision,
    policyDataSource,
    policyEvaluationOptions
  );

  const roleId = evaluatedDecision.roleId;
  const grantedPermissionKeys =
    roleId === null
      ? [boundaryPermissionKey]
      : await permissionDataSource.getPermissionsForRole(roleId);

  const permissionModelDescriptors =
    resolveMetadataPermissionModelDescriptorsFromGrantedKeys({
      grantScopeType: input.operatingContext.permissionScope.grantScopeType,
      permissionKeys: grantedPermissionKeys,
    });

  return {
    policyDecision: resolveMetadataPolicyDecisionFromAuthorizationEvaluation({
      decision: evaluatedDecision,
    }),
    permissionKeys: [...grantedPermissionKeys],
    permissionModelDescriptors,
  };
}
