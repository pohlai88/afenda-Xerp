import { describe, expect, it } from "vitest";

import {
  filterMembershipTargetsByKind,
  resolveWorkspaceSelectionDescription,
  resolveWorkspaceSelectionTitle,
} from "@/lib/auth/auth-workspace-selection.helpers";
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

describe("auth workspace selection helpers", () => {
  it("filters organization-scoped targets only for organization kind", () => {
    const targets = [
      target(),
      target({
        organizationSlug: "finance",
        label: "Acme — Finance",
      }),
    ];

    expect(filterMembershipTargetsByKind(targets, "organization")).toEqual([
      target({
        organizationSlug: "finance",
        label: "Acme — Finance",
      }),
    ]);
    expect(filterMembershipTargetsByKind(targets, "workspace")).toEqual(
      targets
    );
  });

  it("resolves copy for organization and workspace kinds", () => {
    expect(resolveWorkspaceSelectionTitle("organization")).toBe(
      "Select organization"
    );
    expect(resolveWorkspaceSelectionTitle("workspace")).toBe(
      "Select workspace"
    );
    expect(resolveWorkspaceSelectionDescription("organization")).toContain(
      "organization scope"
    );
    expect(resolveWorkspaceSelectionDescription("workspace")).toContain(
      "workspace scope"
    );
  });
});
