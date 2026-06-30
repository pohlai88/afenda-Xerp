import type { OperatingContext } from "@afenda/kernel";
import {
  checkPermission,
  createProductionAuthorizationDataSources,
  isDeniedAuthorizationResult,
} from "@afenda/permissions";

import { authorizationContextFromOperatingContext } from "./authorization-context-from-operating-context";

export async function isOperatingContextPermissionGranted(input: {
  readonly operatingContext: OperatingContext;
  readonly permissionKey: string;
}): Promise<boolean> {
  const dataSources = createProductionAuthorizationDataSources();
  const result = await checkPermission(
    {
      actor: { actorId: input.operatingContext.actor.userId },
      context: authorizationContextFromOperatingContext(input.operatingContext),
      correlationId: input.operatingContext.correlationId,
      permissionKey: input.permissionKey,
    },
    dataSources.permission
  );

  return !isDeniedAuthorizationResult(result);
}
