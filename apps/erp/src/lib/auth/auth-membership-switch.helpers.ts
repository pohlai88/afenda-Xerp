import type { SwitchOperatingContextInput } from "@/lib/context/context-switch.action";
import { switchOperatingContextAction } from "@/lib/context/context-switch.action";
import type { AuthMembershipSwitchTargetDto } from "@/server/api/contracts/auth/auth-memberships.api-contract";

export function formatMembershipTargetKey(
  target: AuthMembershipSwitchTargetDto
): string {
  return `${target.companySlug}:${target.organizationSlug ?? ""}`;
}

export function buildSwitchInputFromMembershipTarget(
  target: AuthMembershipSwitchTargetDto
): SwitchOperatingContextInput {
  return {
    companySlug: target.companySlug,
    ...(target.organizationSlug === undefined
      ? {}
      : { organizationSlug: target.organizationSlug }),
  };
}

export async function persistAuthMembershipTarget(
  target: AuthMembershipSwitchTargetDto
): Promise<void> {
  const result = await switchOperatingContextAction(
    buildSwitchInputFromMembershipTarget(target)
  );

  if (!result.ok) {
    throw new Error(result.userMessage);
  }
}
