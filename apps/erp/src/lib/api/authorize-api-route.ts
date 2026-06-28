import {
  type AfendaAuthSession,
  getAfendaAuthSession,
  isAfendaAuthSessionLinked,
} from "@afenda/auth";
import {
  type ExecutionContext,
  type OperatingContext,
  parseTenantId,
  type TenantId,
} from "@afenda/kernel";
import type {
  AuthorizationContextInput,
  AuthorizationDecision,
  AuthorizationDenialCode,
  PermissionDataSource,
  PolicyDataSource,
  PolicyEvaluationOptions,
} from "@afenda/permissions";
import {
  checkPermission,
  createProductionAuthorizationDataSources,
  evaluateAuthorizationPolicy,
  InMemoryPolicyDataSource,
  isDeniedAuthorizationResult,
  isPolicyGateDecision,
  productionPolicyEvaluationOptions,
  resolveAuthorizationContext,
  resolveBoundaryPermissionKey,
} from "@afenda/permissions";

import { createServerExecutionContext } from "@/lib/context/create-server-execution-context.server";
import { createErpLogger } from "@/lib/observability/create-erp-logger";
import { toErpCorrelationId } from "@/lib/observability/erp-correlation-id";
import { ERP_LOGGER_MODULES } from "@/lib/observability/erp-diagnostic-defaults";
import { ApiRouteError } from "@/server/api/runtime/api-validation";

import {
  createApiRouteErrorFromAuthorizationFailure,
  mapAuthorizationDenialToApiErrorCode,
  resolveSafeAuthorizationMessage,
} from "./api-error-response";
import {
  type ApiRouteProtectionLevel,
  toAuthorizationContextFromOperatingContext,
  toAuthorizationContextInput,
} from "./api-route-context";
import type {
  ApiRouteAuthorizationFailure,
  ApiRouteAuthorizationInput,
  ApiRouteAuthorizationResult,
  ApiRouteAuthorizationSuccess,
} from "./authorize-api-route.contract";
import { resolveVerifiedApiRouteOperatingContext } from "./resolve-api-route-operating-context";

export type {
  ApiRouteAuthorizationFailure,
  ApiRouteAuthorizationInput,
  ApiRouteAuthorizationResult,
  ApiRouteAuthorizationSuccess,
} from "./authorize-api-route.contract";

import type { ResolveOperatingContextFn } from "./resolve-api-route-operating-context";

export interface AuthorizeApiRouteDependencies {
  readonly permission?: PermissionDataSource;
  readonly policy?: PolicyDataSource;
  readonly policyEvaluationOptions?: PolicyEvaluationOptions;
  readonly resolveOperatingContext?: ResolveOperatingContextFn;
  /** Test override — production resolves from request headers when omitted. */
  readonly session?: AfendaAuthSession | null;
}

async function resolveApiRouteAuthSession(input: {
  readonly actorId: string | null;
  readonly dependencies: AuthorizeApiRouteDependencies;
  readonly request: Request;
}): Promise<AfendaAuthSession | null | undefined> {
  if (input.dependencies.session !== undefined) {
    return input.dependencies.session;
  }

  if (input.actorId !== null) {
    return;
  }

  return getAfendaAuthSession(input.request.headers);
}

function createAuthorizationFailure(
  failure: Omit<ApiRouteAuthorizationFailure, "kind">
): ApiRouteAuthorizationFailure {
  return {
    kind: "failure",
    ...failure,
  };
}

function logAuthorizationDenial(input: {
  readonly actorId: string | null;
  readonly companyId: string | null;
  readonly correlationId: string;
  readonly denialCode: ApiRouteAuthorizationFailure["denialCode"];
  readonly method: string;
  readonly organizationId: string | null;
  readonly path: string;
  readonly permissionKey: string;
  readonly tenantId: string | null;
}): void {
  createErpLogger({
    correlationId: toErpCorrelationId(input.correlationId),
    module: ERP_LOGGER_MODULES.apiAuthorization,
  }).warn("api.authorization.denied", {
    actorId: input.actorId,
    companyId: input.companyId,
    denialCode: input.denialCode,
    method: input.method,
    organizationId: input.organizationId,
    path: input.path,
    permissionKey: input.permissionKey,
    tenantId: input.tenantId,
  });
}

function buildExecutionContext(input: {
  readonly actorId: string;
  readonly companyId: string | null;
  readonly correlationId: string;
  readonly organizationId: string | null;
  readonly tenantId: TenantId;
}): ExecutionContext {
  return createServerExecutionContext({
    actorId: input.actorId,
    companyId: input.companyId,
    correlationId: input.correlationId,
    organizationId: input.organizationId,
    source: "api",
    tenantId: input.tenantId,
  });
}

function requiresTenantScope(
  protectionLevel: ApiRouteProtectionLevel
): boolean {
  return (
    protectionLevel === "tenant-protected" ||
    protectionLevel === "company-protected" ||
    protectionLevel === "organization-protected" ||
    protectionLevel === "platform-admin"
  );
}

interface PermissionPolicyEvaluationInput {
  readonly action?: string;
  readonly actorId: string;
  readonly authorizationContextInput: AuthorizationContextInput;
  readonly correlationId: string;
  readonly permissionDataSource: PermissionDataSource;
  readonly permissionKey: string;
  readonly policyDataSource: PolicyDataSource;
  readonly policyEvaluationOptions: PolicyEvaluationOptions;
  readonly targetType?: string | null;
}

type PermissionPolicyEvaluationResult =
  | {
      readonly kind: "denied";
      readonly code: AuthorizationDenialCode;
      readonly decision: AuthorizationDecision;
    }
  | {
      readonly kind: "allowed";
      readonly decision: AuthorizationDecision;
    };

async function evaluatePermissionAndPolicy(
  input: PermissionPolicyEvaluationInput
): Promise<PermissionPolicyEvaluationResult> {
  const permissionResult = await checkPermission(
    {
      actor: { actorId: input.actorId },
      context: input.authorizationContextInput,
      correlationId: input.correlationId,
      permissionKey: input.permissionKey,
      ...(input.action === undefined ? {} : { action: input.action }),
      targetType: input.targetType ?? null,
    },
    input.permissionDataSource
  );

  if (isDeniedAuthorizationResult(permissionResult)) {
    return {
      kind: "denied",
      code: permissionResult.code,
      decision: permissionResult.decision,
    };
  }

  const policyDecision = await evaluateAuthorizationPolicy(
    permissionResult.decision,
    input.policyDataSource,
    input.policyEvaluationOptions
  );

  if (policyDecision.result === "deny") {
    return {
      kind: "denied",
      code: "policy_denied",
      decision: policyDecision,
    };
  }

  if (isPolicyGateDecision(policyDecision.result)) {
    return {
      kind: "denied",
      code: "policy_gated",
      decision: policyDecision,
    };
  }

  return {
    kind: "allowed",
    decision: policyDecision,
  };
}

function resolveAuthorizationDataSources(
  dependencies: AuthorizeApiRouteDependencies
): {
  readonly permission: PermissionDataSource;
  readonly policy: PolicyDataSource;
  readonly policyEvaluationOptions: PolicyEvaluationOptions;
} {
  const hasInjectedPermission = dependencies.permission !== undefined;
  const hasInjectedPolicy = dependencies.policy !== undefined;

  if (hasInjectedPermission) {
    return {
      permission: dependencies.permission,
      policy: dependencies.policy ?? new InMemoryPolicyDataSource(),
      policyEvaluationOptions: dependencies.policyEvaluationOptions ?? {},
    };
  }

  if (hasInjectedPolicy) {
    const production = createProductionAuthorizationDataSources();

    return {
      permission: production.permission,
      policy: dependencies.policy,
      policyEvaluationOptions: dependencies.policyEvaluationOptions ?? {},
    };
  }

  const production = createProductionAuthorizationDataSources();

  return {
    permission: production.permission,
    policy: production.policy,
    policyEvaluationOptions:
      dependencies.policyEvaluationOptions ?? productionPolicyEvaluationOptions,
  };
}

function buildAuthorizationSuccess(input: {
  readonly actorId: string;
  readonly authorizationContextInput: AuthorizationContextInput;
  readonly correlationId: string;
  readonly decision: AuthorizationDecision;
  readonly operatingContext: OperatingContext | null;
}): ApiRouteAuthorizationSuccess {
  const resolvedAuthorization = resolveAuthorizationContext(
    { actorId: input.actorId },
    input.authorizationContextInput
  );

  const membershipId = input.decision.membershipId;
  const roleId = input.decision.roleId;

  if (membershipId === null || roleId === null) {
    throw new ApiRouteError(
      "internal_error",
      "Authorization decision is missing membership or role identifiers."
    );
  }

  if (input.decision.tenantId === null) {
    throw new ApiRouteError(
      "internal_error",
      "Authorization decision is missing tenant context."
    );
  }

  let tenantId: TenantId;
  try {
    tenantId = parseTenantId(input.decision.tenantId);
  } catch {
    throw new ApiRouteError(
      "internal_error",
      "Authorization decision tenant id is invalid."
    );
  }

  return {
    kind: "success",
    authorization: {
      ...resolvedAuthorization,
      membershipId,
      roleId,
    },
    decision: input.decision,
    execution: buildExecutionContext({
      actorId: input.actorId,
      companyId: input.decision.companyId,
      correlationId: input.correlationId,
      organizationId: input.decision.organizationId,
      tenantId,
    }),
    operatingContext: input.operatingContext,
  };
}

function buildAuthorizationFailureFromEvaluation(input: {
  readonly actorId: string;
  readonly code: AuthorizationDenialCode;
  readonly correlationId: string;
  readonly decision: AuthorizationDecision;
  readonly method: string;
  readonly operatingContext?: OperatingContext | null;
  readonly path: string;
  readonly permissionKey: string;
}): ApiRouteAuthorizationFailure {
  const apiCode = mapAuthorizationDenialToApiErrorCode(input.code);
  const failure = createAuthorizationFailure({
    apiCode,
    correlationId: input.correlationId,
    denialCode: input.code,
    message: resolveSafeAuthorizationMessage(input.code, input.decision.reason),
    details:
      input.code === "policy_gated"
        ? { gateDecision: input.decision.result }
        : { denialCode: input.code },
    evaluation: {
      authorizationDenialCode: input.code,
      decision: input.decision,
      operatingContext: input.operatingContext ?? null,
      permissionKey: input.permissionKey,
    },
  });

  logAuthorizationDenial({
    actorId: input.actorId,
    companyId: input.decision.companyId,
    correlationId: input.correlationId,
    denialCode: failure.denialCode,
    method: input.method,
    organizationId: input.decision.organizationId,
    path: input.path,
    permissionKey: input.permissionKey,
    tenantId: input.decision.tenantId,
  });

  return failure;
}

export async function authorizeApiRoute(
  input: ApiRouteAuthorizationInput,
  dependencies: AuthorizeApiRouteDependencies = {}
): Promise<ApiRouteAuthorizationResult> {
  if (input.protectionLevel === "public") {
    throw new ApiRouteError(
      "internal_error",
      "Public routes must not invoke RBAC authorization."
    );
  }

  const session = await resolveApiRouteAuthSession({
    actorId: input.actorId,
    dependencies,
    request: input.request,
  });

  if (
    session !== undefined &&
    session !== null &&
    !isAfendaAuthSessionLinked(session)
  ) {
    const failure = createAuthorizationFailure({
      apiCode: "forbidden",
      correlationId: input.correlationId,
      denialCode: "missing_session",
      message: "Platform user link is required before authorization.",
    });

    logAuthorizationDenial({
      actorId: null,
      companyId: null,
      correlationId: input.correlationId,
      denialCode: failure.denialCode,
      method: input.method,
      organizationId: null,
      path: input.path,
      permissionKey: input.permission.permissionKey,
      tenantId: null,
    });

    return failure;
  }

  const actorId =
    input.actorId ??
    (session !== undefined && session !== null
      ? (session.user.userId?.trim() ?? null)
      : null);

  if (actorId === null) {
    const failure = createAuthorizationFailure({
      apiCode: "unauthenticated",
      correlationId: input.correlationId,
      denialCode: "missing_session",
      message: "Authentication is required.",
    });

    logAuthorizationDenial({
      actorId: null,
      companyId: null,
      correlationId: input.correlationId,
      denialCode: failure.denialCode,
      method: input.method,
      organizationId: null,
      path: input.path,
      permissionKey: input.permission.permissionKey,
      tenantId: null,
    });

    return failure;
  }
  const permissionKey = resolveBoundaryPermissionKey(
    input.permission.permissionKey
  );

  if (requiresTenantScope(input.protectionLevel)) {
    const operatingResolution = await resolveVerifiedApiRouteOperatingContext({
      actorUserId: actorId,
      correlationId: input.correlationId,
      request: input.request,
      ...(dependencies.resolveOperatingContext
        ? { resolveOperatingContextFn: dependencies.resolveOperatingContext }
        : {}),
    });

    if (!operatingResolution.ok) {
      const failure = createAuthorizationFailure({
        apiCode: "forbidden",
        correlationId: input.correlationId,
        denialCode: "missing_context",
        message: operatingResolution.error.message,
        details: {
          operatingContextCode: operatingResolution.error.code,
        },
      });

      logAuthorizationDenial({
        actorId,
        companyId: null,
        correlationId: input.correlationId,
        denialCode: failure.denialCode,
        method: input.method,
        organizationId: null,
        path: input.path,
        permissionKey,
        tenantId: null,
      });

      return failure;
    }

    const { operatingContext } = operatingResolution;
    const authorizationContextInput =
      toAuthorizationContextFromOperatingContext({
        operatingContext,
        request: input.request,
      });

    const dataSources = resolveAuthorizationDataSources(dependencies);

    const evaluation = await evaluatePermissionAndPolicy({
      actorId,
      authorizationContextInput,
      correlationId: input.correlationId,
      permissionDataSource: dataSources.permission,
      permissionKey,
      policyDataSource: dataSources.policy,
      policyEvaluationOptions: dataSources.policyEvaluationOptions,
      targetType: input.permission.targetType ?? null,
      ...(input.permission.action === undefined
        ? {}
        : { action: input.permission.action }),
    });

    if (evaluation.kind === "denied") {
      return buildAuthorizationFailureFromEvaluation({
        actorId,
        code: evaluation.code,
        correlationId: input.correlationId,
        decision: evaluation.decision,
        method: input.method,
        operatingContext: operatingResolution.operatingContext,
        path: input.path,
        permissionKey,
      });
    }

    return buildAuthorizationSuccess({
      actorId,
      authorizationContextInput,
      correlationId: input.correlationId,
      decision: evaluation.decision,
      operatingContext: operatingResolution.operatingContext,
    });
  }

  const authorizationContextInput = toAuthorizationContextInput(null);
  const dataSources = resolveAuthorizationDataSources(dependencies);

  const evaluation = await evaluatePermissionAndPolicy({
    actorId,
    authorizationContextInput,
    correlationId: input.correlationId,
    permissionDataSource: dataSources.permission,
    permissionKey,
    policyDataSource: dataSources.policy,
    policyEvaluationOptions: dataSources.policyEvaluationOptions,
    targetType: input.permission.targetType ?? null,
    ...(input.permission.action === undefined
      ? {}
      : { action: input.permission.action }),
  });

  if (evaluation.kind === "denied") {
    return buildAuthorizationFailureFromEvaluation({
      actorId,
      code: evaluation.code,
      correlationId: input.correlationId,
      decision: evaluation.decision,
      method: input.method,
      operatingContext: null,
      path: input.path,
      permissionKey,
    });
  }

  return buildAuthorizationSuccess({
    actorId,
    authorizationContextInput,
    correlationId: input.correlationId,
    decision: evaluation.decision,
    operatingContext: null,
  });
}

export async function assertAuthorizedApiRoute(
  input: ApiRouteAuthorizationInput,
  dependencies?: AuthorizeApiRouteDependencies
): Promise<ApiRouteAuthorizationSuccess> {
  const result = await authorizeApiRoute(input, dependencies);

  if (result.kind === "failure") {
    throw createApiRouteErrorFromAuthorizationFailure(result);
  }

  return result;
}

export function resolveActorIdFromSession(
  session: { readonly user: { readonly userId: string | null } } | null
): string | null {
  const userId = session?.user.userId?.trim();
  return userId && userId.length > 0 ? userId : null;
}
