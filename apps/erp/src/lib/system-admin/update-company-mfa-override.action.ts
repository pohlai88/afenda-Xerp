"use server";

import { updateCompany } from "@afenda/database";
import { AppErrors } from "@afenda/kernel";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { failServerAction } from "@/lib/server-actions/fail-server-action";
import { parseProtectedActionInput } from "@/lib/server-actions/parse-protected-action-input";
import { recordActionAudit } from "@/lib/server-actions/record-action-audit";
import { resolveActionOperatingContext } from "@/lib/server-actions/resolve-action-operating-context.server";
import {
  type ServerActionResult,
  serverActionSuccess,
} from "@/lib/server-actions/server-action-result";

import { guardSystemAdminSection } from "./guard-system-admin-section.server";
import {
  type CompanyMfaOverrideMode,
  companyMfaOverrideToBoolean,
} from "./resolve-security-settings.server";
import { SYSTEM_ADMIN_MUTATION_AUDIT_MODULE } from "./system-admin-mutation-audit.registry";

const UPDATE_COMPANY_MFA_OVERRIDE_ACTION =
  "system_admin.settings.security.company_mfa_override.update" as const;

const companyMfaOverrideSchema = z.enum(["inherit", "require", "waive"]);

const updateCompanyMfaOverrideInputSchema = z.object({
  override: companyMfaOverrideSchema,
});

export interface UpdateCompanyMfaOverrideData {
  readonly companyId: string;
  readonly override: CompanyMfaOverrideMode;
}

export type UpdateCompanyMfaOverrideActionState =
  ServerActionResult<UpdateCompanyMfaOverrideData> | null;

function parseCompanyMfaOverrideActionInput(formData: FormData): unknown {
  return {
    override: formData.get("override"),
  };
}

export async function updateCompanyMfaOverrideAction(
  _prevState: UpdateCompanyMfaOverrideActionState,
  formData: FormData
): Promise<UpdateCompanyMfaOverrideActionState> {
  const parsed = parseProtectedActionInput(
    updateCompanyMfaOverrideInputSchema,
    parseCompanyMfaOverrideActionInput(formData)
  );

  if (!parsed.ok) {
    return failServerAction({
      action: UPDATE_COMPANY_MFA_OVERRIDE_ACTION,
      error: parsed.error,
    });
  }

  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: UPDATE_COMPANY_MFA_OVERRIDE_ACTION,
      error: contextResult.error,
    });
  }

  const { operatingContext } = contextResult;
  const actorUserId = operatingContext.actor.userId;
  const companyId = operatingContext.legalEntity.companyId;

  const guardResult = await guardSystemAdminSection({
    sectionId: "settings",
    operatingContext,
    correlationId: operatingContext.correlationId,
  });

  if (guardResult.kind !== "allowed") {
    await recordActionAudit({
      action: UPDATE_COMPANY_MFA_OVERRIDE_ACTION,
      actorUserId,
      module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
      result: "denied",
      targetType: "system_admin_security_settings",
    });

    return failServerAction({
      action: UPDATE_COMPANY_MFA_OVERRIDE_ACTION,
      error: AppErrors.forbidden(
        "You do not have permission to update security settings."
      ),
      userId: actorUserId,
    });
  }

  await updateCompany(companyId, {
    audit: {
      actorType: "user",
      actorUserId,
      correlationId: operatingContext.correlationId,
      source: "app",
    },
    mfaRequiredOverride: companyMfaOverrideToBoolean(parsed.value.override),
  });

  revalidatePath("/system-admin/settings/security");

  await recordActionAudit({
    action: UPDATE_COMPANY_MFA_OVERRIDE_ACTION,
    actorUserId,
    module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
    result: "success",
    targetId: companyId,
    targetType: "company",
  });

  return serverActionSuccess({
    companyId,
    override: parsed.value.override,
  });
}
