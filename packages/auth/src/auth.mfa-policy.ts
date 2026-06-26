import { randomUUID } from "node:crypto";

import {
  type AfendaAuthDatabase,
  type AfendaDatabase,
  authUser,
  companies,
  getAuthDb,
  getDb,
  tenants,
} from "@afenda/database";
import { eq } from "drizzle-orm";

import { persistAuthAuditEvent } from "./auth.audit.js";
import { AUTH_EVENT } from "./auth.contract.js";

export interface TenantMfaPolicy {
  readonly mfaRequired: boolean;
}

export interface AssertTenantMfaPolicyInput {
  readonly authUserId: string;
  readonly companyId?: string;
  readonly correlationId?: string;
  readonly tenantId: string;
}

/** Optional tenant MFA gate for `requireAfendaAuthSession` (ARCH-AUTH-001 admin policy). */
export interface RequireAfendaAuthSessionOptions {
  readonly companyId?: string;
  readonly tenantId?: string;
}

export class MfaPolicyBypassBlockedError extends Error {
  constructor(tenantId: string) {
    super(
      `Tenant "${tenantId}" requires multi-factor authentication before workspace access.`
    );
    this.name = "MfaPolicyBypassBlockedError";
  }
}

export function isMfaPolicyBypassBlockedError(
  error: unknown
): error is MfaPolicyBypassBlockedError {
  return error instanceof MfaPolicyBypassBlockedError;
}

export interface TenantMfaPolicyDeps {
  readonly authDb?: AfendaAuthDatabase;
  readonly platformDb?: AfendaDatabase;
}

/** Reads canonical tenant MFA enforcement from platform `tenants.mfa_required`. */
export async function getTenantMfaPolicy(
  tenantId: string,
  platformDb: AfendaDatabase = getDb()
): Promise<TenantMfaPolicy | null> {
  const [row] = await platformDb
    .select({ mfaRequired: tenants.mfaRequired })
    .from(tenants)
    .where(eq(tenants.id, tenantId))
    .limit(1);

  if (!row) {
    return null;
  }

  return { mfaRequired: row.mfaRequired };
}

function parseCompanyIdFromActiveWorkspaceId(
  activeWorkspaceId: string | null | undefined
): string | undefined {
  if (activeWorkspaceId === undefined || activeWorkspaceId === null) {
    return;
  }

  const parts = activeWorkspaceId.trim().split(":");
  if (parts.length !== 3) {
    return;
  }

  const companyId = parts[1]?.trim();
  return companyId && companyId.length > 0 ? companyId : undefined;
}

/** Resolves MFA policy with optional company workspace override (FR-A05.3). */
export async function getEffectiveMfaPolicy(
  input: { readonly companyId?: string; readonly tenantId: string },
  platformDb: AfendaDatabase = getDb()
): Promise<TenantMfaPolicy | null> {
  if (input.companyId) {
    const [companyRow] = await platformDb
      .select({ mfaRequiredOverride: companies.mfaRequiredOverride })
      .from(companies)
      .where(eq(companies.id, input.companyId))
      .limit(1);

    if (companyRow && companyRow.mfaRequiredOverride !== null) {
      return { mfaRequired: companyRow.mfaRequiredOverride };
    }
  }

  return getTenantMfaPolicy(input.tenantId, platformDb);
}

export { parseCompanyIdFromActiveWorkspaceId };

/** Returns whether Better Auth reports MFA enabled for the auth user. */
export async function isAuthUserMfaEnabled(
  authUserId: string,
  authDb: AfendaAuthDatabase = getAuthDb()
): Promise<boolean> {
  const [row] = await authDb
    .select({ twoFactorEnabled: authUser.twoFactorEnabled })
    .from(authUser)
    .where(eq(authUser.id, authUserId))
    .limit(1);

  return row?.twoFactorEnabled ?? false;
}

/**
 * Fail-closed gate: when tenant policy requires MFA, block until Better Auth
 * reports `two_factor_enabled` for the auth user.
 */
export async function assertTenantMfaPolicySatisfied(
  input: AssertTenantMfaPolicyInput,
  deps: TenantMfaPolicyDeps = {}
): Promise<void> {
  const platformDb = deps.platformDb ?? getDb();
  const authDb = deps.authDb ?? getAuthDb();
  const policy = await getEffectiveMfaPolicy(
    {
      tenantId: input.tenantId,
      ...(input.companyId === undefined ? {} : { companyId: input.companyId }),
    },
    platformDb
  );

  if (!policy?.mfaRequired) {
    return;
  }

  const mfaEnabled = await isAuthUserMfaEnabled(input.authUserId, authDb);

  if (mfaEnabled) {
    return;
  }

  await persistAuthAuditEvent({
    event: AUTH_EVENT.mfaBypassBlocked,
    result: "failure",
    reason: "Tenant MFA policy requires enrolled two-factor authentication.",
    context: {
      authUserId: input.authUserId,
      correlationId: input.correlationId ?? `auth-mfa-gate-${randomUUID()}`,
      tenantId: input.tenantId,
    },
  });

  throw new MfaPolicyBypassBlockedError(input.tenantId);
}

export interface UpdateTenantMfaPolicyInput {
  readonly auditCorrelationId?: string;
  readonly authUserId?: string;
  readonly mfaRequired: boolean;
  readonly tenantId: string;
}

/** Persists tenant MFA policy toggle and emits auth audit (admin path). */
export async function updateTenantMfaPolicy(
  input: UpdateTenantMfaPolicyInput,
  platformDb: AfendaDatabase = getDb()
): Promise<TenantMfaPolicy> {
  const [updated] = await platformDb
    .update(tenants)
    .set({
      mfaRequired: input.mfaRequired,
      updatedAt: new Date(),
    })
    .where(eq(tenants.id, input.tenantId))
    .returning({ mfaRequired: tenants.mfaRequired });

  if (!updated) {
    throw new Error(`Tenant "${input.tenantId}" was not found.`);
  }

  await persistAuthAuditEvent({
    event: AUTH_EVENT.mfaPolicyUpdated,
    result: "success",
    context: {
      correlationId:
        input.auditCorrelationId ?? `auth-mfa-policy-${randomUUID()}`,
      tenantId: input.tenantId,
      mfaRequired: String(input.mfaRequired),
      ...(input.authUserId === undefined
        ? {}
        : { authUserId: input.authUserId }),
    },
  });

  return { mfaRequired: updated.mfaRequired };
}
