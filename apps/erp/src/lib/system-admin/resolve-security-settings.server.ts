import {
  type AfendaAuthSession,
  getEffectiveMfaPolicy,
  getTenantMfaPolicy,
  isAuthUserMfaEnabled,
} from "@afenda/auth";
import { companies, getDb } from "@afenda/database";
import type { OperatingContext } from "@afenda/kernel";
import { eq } from "drizzle-orm";

export type CompanyMfaOverrideMode = "inherit" | "require" | "waive";

export interface SecuritySettingsViewModel {
  readonly authUserId: string;
  readonly companyId: string;
  readonly companyLabel: string;
  readonly companyMfaOverride: CompanyMfaOverrideMode;
  readonly effectiveMfaRequired: boolean;
  readonly mfaPolicyRequired: boolean;
  readonly tenantId: string;
  readonly userMfaEnabled: boolean;
}

function resolveCompanyMfaOverrideMode(
  value: boolean | null | undefined
): CompanyMfaOverrideMode {
  if (value === true) {
    return "require";
  }

  if (value === false) {
    return "waive";
  }

  return "inherit";
}

export async function resolveSecuritySettings(
  operatingContext: OperatingContext,
  session: AfendaAuthSession
): Promise<SecuritySettingsViewModel> {
  const tenantId = operatingContext.tenant.tenantId;
  const companyId = operatingContext.legalEntity.companyId;
  const [policy, companyRow, effectivePolicy, userMfaEnabled] =
    await Promise.all([
      getTenantMfaPolicy(tenantId),
      getDb()
        .select({ mfaRequiredOverride: companies.mfaRequiredOverride })
        .from(companies)
        .where(eq(companies.id, companyId))
        .limit(1)
        .then((rows) => rows[0] ?? null),
      getEffectiveMfaPolicy({ tenantId, companyId }),
      isAuthUserMfaEnabled(session.user.authUserId),
    ]);

  return {
    authUserId: session.user.authUserId,
    companyId,
    companyLabel: operatingContext.legalEntity.displayName,
    companyMfaOverride: resolveCompanyMfaOverrideMode(
      companyRow?.mfaRequiredOverride
    ),
    effectiveMfaRequired: effectivePolicy?.mfaRequired ?? false,
    mfaPolicyRequired: policy?.mfaRequired ?? false,
    tenantId,
    userMfaEnabled,
  };
}

export function companyMfaOverrideToBoolean(
  mode: CompanyMfaOverrideMode
): boolean | null {
  switch (mode) {
    case "require":
      return true;
    case "waive":
      return false;
    default:
      return null;
  }
}
