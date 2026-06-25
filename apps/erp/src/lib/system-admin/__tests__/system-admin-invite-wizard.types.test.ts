import { describe, expect, it } from "vitest";

import {
  advanceSystemAdminInviteWizardStep,
  retreatSystemAdminInviteWizardStep,
} from "@/lib/system-admin/system-admin-invite-wizard.types";

describe("system-admin invite wizard step union", () => {
  const identityDraft = {
    displayName: "Invited User",
    email: "invited@example.com",
  } as const;

  it("advances identity to role with identity payload", () => {
    const next = advanceSystemAdminInviteWizardStep(
      { step: "identity" },
      { kind: "identity-complete", identity: identityDraft }
    );

    expect(next).toEqual({
      step: "role",
      identity: identityDraft,
    });
  });

  it("advances role to confirm with roleId", () => {
    const next = advanceSystemAdminInviteWizardStep(
      { step: "role", identity: identityDraft },
      { kind: "role-selected", roleId: "role-admin" }
    );

    expect(next).toEqual({
      step: "confirm",
      identity: identityDraft,
      roleId: "role-admin",
    });
  });

  it("rejects invalid advance actions for the active step", () => {
    expect(
      advanceSystemAdminInviteWizardStep(
        { step: "identity" },
        { kind: "role-selected", roleId: "role-admin" }
      )
    ).toBeNull();

    expect(
      advanceSystemAdminInviteWizardStep(
        { step: "confirm", identity: identityDraft, roleId: "role-admin" },
        { kind: "identity-complete", identity: identityDraft }
      )
    ).toBeNull();
  });

  it("retreats confirm to role and role to identity", () => {
    expect(
      retreatSystemAdminInviteWizardStep({
        step: "confirm",
        identity: identityDraft,
        roleId: "role-admin",
      })
    ).toEqual({
      step: "role",
      identity: identityDraft,
    });

    expect(
      retreatSystemAdminInviteWizardStep({
        step: "role",
        identity: identityDraft,
      })
    ).toEqual({ step: "identity" });
  });

  it("does not retreat from the first step", () => {
    expect(retreatSystemAdminInviteWizardStep({ step: "identity" })).toBeNull();
  });
});
