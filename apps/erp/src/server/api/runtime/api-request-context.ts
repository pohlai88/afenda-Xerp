import type { AfendaAuthSession } from "@afenda/auth";
import {
  brandCorrelationId,
  brandUserId,
  createExecutionContext,
  type ExecutionContext,
  type UserId,
} from "@afenda/kernel";

import type { ApiRouteContract } from "../contracts/api-contract";
import type { ApiRoutePermissionPolicy } from "../contracts/api-contract";
import { ApiRouteError } from "./api-validation";

export interface ApiRequestContext<TRequest = undefined> {
  readonly contract: ApiRouteContract<TRequest, unknown>;
  readonly correlationId: string;
  readonly execution: ExecutionContext;
  readonly request: Request;
  readonly requestBody: TRequest;
  readonly requestId: string;
  readonly session: AfendaAuthSession | null;
  readonly userId: UserId | null;
}

export function createApiRequestContext<TRequest>(input: {
  readonly contract: ApiRouteContract<TRequest, unknown>;
  readonly correlationId: string;
  readonly request: Request;
  readonly requestBody: TRequest;
  readonly requestId: string;
  readonly session: AfendaAuthSession | null;
}): ApiRequestContext<TRequest> {
  const userId = brandUserId(input.session?.user.userId ?? null);
  const execution = createExecutionContext({
    actorId: userId,
    correlationId: brandCorrelationId(input.correlationId),
    source: "api",
  });

  return {
    contract: input.contract,
    correlationId: input.correlationId,
    execution,
    request: input.request,
    requestBody: input.requestBody,
    requestId: input.requestId,
    session: input.session,
    userId,
  };
}

export async function assertRoutePermission(
  context: ApiRequestContext<unknown>,
  permissionPolicy: ApiRoutePermissionPolicy | undefined
): Promise<void> {
  if (permissionPolicy === undefined) {
    return;
  }

  if (context.session === null || context.userId === null) {
    throw new ApiRouteError("unauthenticated", "Authentication is required.");
  }

  if (permissionPolicy.permission.trim().length === 0) {
    throw new ApiRouteError(
      "internal_error",
      "Permission policy is misconfigured."
    );
  }

  // Interim gate: authenticated session required. Full RBAC via checkPermission
  // is wired when tenant execution context is available on ERP API routes.
}
