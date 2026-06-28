import type { PermissionKey } from "@afenda/database";
import type { OperatingContext } from "@afenda/kernel";
import {
  checkPolicyDecision,
  InMemoryPolicyDataSource,
  type PermissionDataSource,
  type PolicyDataSource,
} from "@afenda/permissions";

import { toPermissionCheckContextFromOperatingContext } from "@/lib/permissions/to-permission-check-context.server";

import type { MetadataAuthorizationSnapshot } from "../resolve-metadata-authorization.server";
import { METADATA_WORKSPACE_BOUNDARY_PERMISSION_KEY } from "../resolve-metadata-authorization.server";
import { resolveMetadataPermissionModelDescriptorsFromGrantedKeys } from "../resolve-metadata-permission-model.server";
import { resolveMetadataPolicyDecisionFromAuthorizationEvaluation } from "../resolve-metadata-policy-decision.server";

/**
 * Vitest-only helper using `checkPolicyDecision` — not the production metadata path.
 * Production uses `resolveMetadataAuthorizationFromOperatingContext` or the api-route bridge.
 */
export async function resolveMetadataAuthorizationWithPolicyCheckForTests(input: {
  readonly boundaryPermissionKey?: PermissionKey | string;
  readonly operatingContext: OperatingContext;
  readonly permissionDataSource: PermissionDataSource;
  readonly policyDataSource?: PolicyDataSource;
}): Promise<MetadataAuthorizationSnapshot> {
  const boundaryPermissionKey =
    input.boundaryPermissionKey ?? METADATA_WORKSPACE_BOUNDARY_PERMISSION_KEY;

  const decision = await checkPolicyDecision(
    {
      actor: { actorId: input.operatingContext.actor.userId },
      context: toPermissionCheckContextFromOperatingContext(
        input.operatingContext
      ),
      correlationId: input.operatingContext.correlationId,
      permissionKey: boundaryPermissionKey,
    },
    input.permissionDataSource,
    input.policyDataSource ?? new InMemoryPolicyDataSource()
  );

  const roleId = decision.roleId;
  const grantedPermissionKeys =
    roleId === null
      ? [boundaryPermissionKey]
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
