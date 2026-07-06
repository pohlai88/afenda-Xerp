import { describe, expect, it } from "vitest";

import {
  buildSwitchInputFromMembershipTarget,
  formatMembershipTargetKey,
} from "@/lib/auth/auth-membership-switch.helpers";
import type { AuthMembershipSwitchTargetDto } from "@/server/api/contracts/auth/auth-memberships.api-contract";

function target(
  overrides: Partial<AuthMembershipSwitchTargetDto> = {}
): AuthMembershipSwitchTargetDto {
  return {
    companySlug: "acme",
    isSelected: false,
    label: "Acme Corp",
    ...overrides,
  };
}

describe("auth-membership-switch helpers", () => {
  it("formats target keys with and without organization slug", () => {
    expect(formatMembershipTargetKey(target())).toBe("acme:");
    expect(
      formatMembershipTargetKey(
        target({ organizationSlug: "finance", label: "Acme — Finance" })
      )
    ).toBe("acme:finance");
  });

  it("builds switch input omitting organization slug when absent", () => {
    expect(buildSwitchInputFromMembershipTarget(target())).toEqual({
      companySlug: "acme",
    });
  });

  it("builds switch input including organization slug when present", () => {
    expect(
      buildSwitchInputFromMembershipTarget(
        target({ organizationSlug: "finance" })
      )
    ).toEqual({
      companySlug: "acme",
      organizationSlug: "finance",
    });
  });
});
