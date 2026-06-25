import {
  type AfendaAuthSession,
  getTenantMfaPolicy,
  isAuthUserMfaEnabled,
} from "@afenda/auth";
import type { OperatingContext } from "@afenda/kernel";

export interface SecuritySettingsViewModel {
  readonly authUserId: string;
  readonly mfaPolicyRequired: boolean;
  readonly tenantId: string;
  readonly userMfaEnabled: boolean;
}

export async function resolveSecuritySettings(
  operatingContext: OperatingContext,
  session: AfendaAuthSession
): Promise<SecuritySettingsViewModel> {
  const tenantId = operatingContext.tenant.tenantId;
  const policy = await getTenantMfaPolicy(tenantId);
  const userMfaEnabled = await isAuthUserMfaEnabled(session.user.authUserId);

  return {
    authUserId: session.user.authUserId,
    mfaPolicyRequired: policy?.mfaRequired ?? false,
    tenantId,
    userMfaEnabled,
  };
}
