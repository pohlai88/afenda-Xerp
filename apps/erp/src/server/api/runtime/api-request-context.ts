import type { AfendaAuthSession } from "@afenda/auth";
import type {
  ExecutionContext,
  OperatingContext,
  UserId,
} from "@afenda/kernel";
import type {
  AuthorizationDecision,
  ResolvedAuthorizationContext,
} from "@afenda/permissions";
import {
  resolveRoutePermissionRequirement,
  resolveRouteProtectionLevel,
} from "@/lib/api/api-route-permissions";
import {
  assertAuthorizedApiRoute,
  resolveActorIdFromSession,
} from "@/lib/api/authorize-api-route";
import type {
  ApiRouteContract,
  ApiRoutePermissionPolicy,
} from "../contracts/api-contract";
import type { PaginationQuery } from "../contracts/pagination.contract";
import { ApiRouteError } from "./api-validation";

export interface ApiRequestContext<TRequest = undefined> {
  readonly authorization: ResolvedAuthorizationContext | null;
  readonly authorizationDecision: AuthorizationDecision | null;
  readonly contract: ApiRouteContract<TRequest, unknown>;
  readonly correlationId: string;
  readonly execution: ExecutionContext;
  readonly operatingContext: OperatingContext | null;
  readonly paginationQuery?: PaginationQuery;
  readonly request: Request;
  readonly requestBody: TRequest;
  readonly requestId: string;
  readonly session: AfendaAuthSession | null;
  readonly userId: UserId | null;
}

export function createApiRequestContext<TRequest>(input: {
  readonly contract: ApiRouteContract<TRequest, unknown>;
  readonly correlationId: string;
  readonly execution: ExecutionContext;
  readonly operatingContext?: OperatingContext | null;
  readonly request: Request;
  readonly requestBody: TRequest;
  readonly requestId: string;
  readonly session: AfendaAuthSession | null;
  readonly userId: UserId | null;
  readonly authorization?: ResolvedAuthorizationContext | null;
  readonly authorizationDecision?: AuthorizationDecision | null;
  readonly paginationQuery?: PaginationQuery;
}): ApiRequestContext<TRequest> {
  return {
    authorization: input.authorization ?? null,
    authorizationDecision: input.authorizationDecision ?? null,
    contract: input.contract,
    correlationId: input.correlationId,
    execution: input.execution,
    operatingContext: input.operatingContext ?? null,
    ...(input.paginationQuery === undefined
      ? {}
      : { paginationQuery: input.paginationQuery }),
    request: input.request,
    requestBody: input.requestBody,
    requestId: input.requestId,
    session: input.session,
    userId: input.userId,
  };
}

export async function assertRoutePermission(
  context: ApiRequestContext<unknown>,
  permissionPolicy: ApiRoutePermissionPolicy | undefined
): Promise<ApiRequestContext<unknown>> {
  if (permissionPolicy === undefined) {
    return context;
  }

  if (permissionPolicy.permission.trim().length === 0) {
    throw new ApiRouteError(
      "internal_error",
      "Permission policy is misconfigured."
    );
  }

  const authorization = await assertAuthorizedApiRoute({
    actorId: resolveActorIdFromSession(context.session),
    correlationId: context.correlationId,
    method: context.contract.method,
    path: context.contract.path,
    permission: resolveRoutePermissionRequirement(permissionPolicy.permission),
    protectionLevel: resolveRouteProtectionLevel(context.contract),
    request: context.request,
  });

  return createApiRequestContext({
    ...context,
    authorization: authorization.authorization,
    authorizationDecision: authorization.decision,
    execution: authorization.execution,
    operatingContext: authorization.operatingContext,
  });
}
