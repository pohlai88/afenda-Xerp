import type { OperatingContext } from "@afenda/kernel";
import {
  createProductionAuthorizationDataSources,
  type PermissionDataSource,
} from "@afenda/permissions";
import type {
  ApiRouteAuthorizationEvaluationArtifact,
  ApiRouteAuthorizationResult,
} from "@/lib/api/authorize-api-route.contract";
import {
  resolveDeniedBoundaryPermissionModelDescriptors,
  resolveMetadataAuthorizationSnapshotFromPreEvaluationDenial,
} from "./metadata-authorization-projection.server";
import type { MetadataAuthorizationSnapshot } from "./resolve-metadata-authorization.server";
import { METADATA_WORKSPACE_BOUNDARY_PERMISSION_KEY } from "./resolve-metadata-authorization.server";
import { resolveMetadataPermissionModelDescriptorsFromGrantedKeys } from "./resolve-metadata-permission-model.server";
import { resolveMetadataPolicyDecisionFromAuthorizationEvaluation } from "./resolve-metadata-policy-decision.server";

async function resolveMetadataAuthorizationFromSuccess(input: {
  readonly operatingContext: OperatingContext;
  readonly permissionDataSource: PermissionDataSource;
  readonly result: Extract<ApiRouteAuthorizationResult, { kind: "success" }>;
}): Promise<MetadataAuthorizationSnapshot> {
  const { decision } = input.result;
  const roleId = decision.roleId;
  const grantedPermissionKeys =
    roleId === null
      ? [decision.permissionKey]
      : await input.permissionDataSource.getPermissionsForRole(roleId);

  return {
    policyDecision: resolveMetadataPolicyDecisionFromAuthorizationEvaluation({
      decision,
    }),
    permissionKeys: [...grantedPermissionKeys],
    permissionModelDescriptors:
      resolveMetadataPermissionModelDescriptorsFromGrantedKeys({
        grantScopeType: input.operatingContext.permissionScope.grantScopeType,
        permissionKeys: grantedPermissionKeys,
      }),
  };
}

function resolveMetadataAuthorizationFromEvaluatedFailure(input: {
  readonly evaluation: ApiRouteAuthorizationEvaluationArtifact;
  readonly operatingContext: OperatingContext;
}): MetadataAuthorizationSnapshot {
  const { evaluation } = input;

  return {
    policyDecision: resolveMetadataPolicyDecisionFromAuthorizationEvaluation({
      decision: evaluation.decision,
      denialCode: evaluation.authorizationDenialCode,
    }),
    permissionKeys: [],
    permissionModelDescriptors: resolveDeniedBoundaryPermissionModelDescriptors(
      {
        operatingContext: input.operatingContext,
        permissionKey: evaluation.permissionKey,
      }
    ),
  };
}

/**
 * Projects `authorizeApiRoute` results into metadata runtime authorization carriers
 * without re-running permission evaluation.
 */
export async function resolveMetadataAuthorizationFromApiRouteResult(input: {
  readonly permissionDataSource?: PermissionDataSource;
  readonly result: ApiRouteAuthorizationResult;
}): Promise<MetadataAuthorizationSnapshot | null> {
  if (input.result.kind === "success") {
    const permissionDataSource =
      input.permissionDataSource ??
      createProductionAuthorizationDataSources().permission;

    const operatingContext = input.result.operatingContext;

    if (operatingContext === null) {
      return {
        policyDecision:
          resolveMetadataPolicyDecisionFromAuthorizationEvaluation({
            decision: input.result.decision,
          }),
        permissionKeys: [input.result.decision.permissionKey],
        permissionModelDescriptors:
          resolveMetadataPermissionModelDescriptorsFromGrantedKeys({
            grantScopeType: "company",
            permissionKeys: [input.result.decision.permissionKey],
          }),
      };
    }

    return resolveMetadataAuthorizationFromSuccess({
      result: input.result,
      operatingContext,
      permissionDataSource,
    });
  }

  const failure = input.result;
  const evaluation = failure.evaluation;
  const operatingContext = evaluation?.operatingContext ?? null;

  if (evaluation !== undefined && operatingContext !== null) {
    return resolveMetadataAuthorizationFromEvaluatedFailure({
      evaluation,
      operatingContext,
    });
  }

  return resolveMetadataAuthorizationSnapshotFromPreEvaluationDenial({
    denialCode: failure.denialCode,
  });
}

export function resolveOperatingContextFromApiRouteResult(
  result: ApiRouteAuthorizationResult
): OperatingContext | null {
  if (result.kind === "success") {
    return result.operatingContext;
  }

  const operatingContext = result.evaluation?.operatingContext ?? null;

  return operatingContext;
}

export type EvaluatedApiRouteAuthorizationDenial = Extract<
  ApiRouteAuthorizationResult,
  { kind: "failure" }
> & {
  readonly evaluation: ApiRouteAuthorizationEvaluationArtifact & {
    readonly operatingContext: OperatingContext;
  };
};

export type PreEvaluationMetadataContextRequiredDenial = Extract<
  ApiRouteAuthorizationResult,
  { kind: "failure" }
> & {
  readonly denialCode: "missing_context";
};

/** True when authorizeApiRoute failed before RBAC because workspace context is missing. */
export function isPreEvaluationMetadataContextRequiredDenial(
  result: ApiRouteAuthorizationResult
): result is PreEvaluationMetadataContextRequiredDenial {
  return result.kind === "failure" && result.denialCode === "missing_context";
}

/** True when authorizeApiRoute completed RBAC evaluation and can drive metadata denial preview. */
export function isEvaluatedApiRouteAuthorizationDenial(
  result: ApiRouteAuthorizationResult
): result is EvaluatedApiRouteAuthorizationDenial {
  if (result.kind !== "failure") {
    return false;
  }

  const operatingContext = result.evaluation?.operatingContext;

  return (
    result.evaluation !== undefined &&
    operatingContext !== undefined &&
    operatingContext !== null
  );
}

/** Re-export boundary key for metadata workspace authorization wiring. */
export { METADATA_WORKSPACE_BOUNDARY_PERMISSION_KEY };
