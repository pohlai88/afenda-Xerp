import type { OperatingContext } from "@afenda/kernel";
import type { MetadataRuntimePermissionModelDescriptor } from "@afenda/ui-composition";
import type { ApiRouteAuthorizationDenialCode } from "@/lib/api/authorize-api-route.contract";

import {
  parseRegisteredPermissionKeyToWireDescriptor,
  resolveMetadataPermissionModelDescriptorsFromGrantedKeys,
  resolveModelScopeFromGrantScope,
} from "./resolve-metadata-permission-model.server";
import { resolveMetadataPolicyDecisionFromApiRouteDenialCode } from "./resolve-metadata-policy-decision.server";

/** Maps a denied boundary permission key into metadata permission-model carriers. */
export function resolveDeniedBoundaryPermissionModelDescriptors(input: {
  readonly operatingContext: OperatingContext;
  readonly permissionKey: string;
}): readonly MetadataRuntimePermissionModelDescriptor[] {
  const modelScope = resolveModelScopeFromGrantScope(
    input.operatingContext.permissionScope.grantScopeType
  );
  const wire = parseRegisteredPermissionKeyToWireDescriptor(
    input.permissionKey,
    modelScope
  );

  if (wire === null) {
    return [];
  }

  return resolveMetadataPermissionModelDescriptorsFromGrantedKeys({
    grantScopeType: input.operatingContext.permissionScope.grantScopeType,
    permissionKeys: [input.permissionKey],
  });
}

/**
 * Projects pre-evaluation API-route denial codes into metadata policy carriers.
 * Used by the api-route bridge for failures without a completed RBAC evaluation artifact.
 */
export function resolveMetadataAuthorizationSnapshotFromPreEvaluationDenial(input: {
  readonly denialCode: ApiRouteAuthorizationDenialCode;
}): {
  readonly permissionKeys: readonly string[];
  readonly permissionModelDescriptors: readonly MetadataRuntimePermissionModelDescriptor[];
  readonly policyDecision: ReturnType<
    typeof resolveMetadataPolicyDecisionFromApiRouteDenialCode
  >;
} {
  return {
    policyDecision: resolveMetadataPolicyDecisionFromApiRouteDenialCode(
      input.denialCode
    ),
    permissionKeys: [],
    permissionModelDescriptors: [],
  };
}
