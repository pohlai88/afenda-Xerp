export interface SystemAdminInviteIdentityDraft {
  readonly displayName: string;
  readonly email: string;
}

export type SystemAdminInviteWizardStep =
  | { readonly step: "identity" }
  | { readonly step: "role"; readonly identity: SystemAdminInviteIdentityDraft }
  | {
      readonly step: "confirm";
      readonly identity: SystemAdminInviteIdentityDraft;
      readonly roleId: string;
    };

export type SystemAdminInviteWizardAdvanceAction =
  | {
      readonly kind: "identity-complete";
      readonly identity: SystemAdminInviteIdentityDraft;
    }
  | { readonly kind: "role-selected"; readonly roleId: string };

export type SystemAdminInviteWizardRetreatAction = { readonly kind: "back" };

export function advanceSystemAdminInviteWizardStep(
  current: SystemAdminInviteWizardStep,
  action: SystemAdminInviteWizardAdvanceAction
): SystemAdminInviteWizardStep | null {
  switch (current.step) {
    case "identity":
      return action.kind === "identity-complete"
        ? { step: "role", identity: action.identity }
        : null;
    case "role":
      return action.kind === "role-selected"
        ? { step: "confirm", identity: current.identity, roleId: action.roleId }
        : null;
    case "confirm":
      return null;
    default: {
      const exhaustive: never = current;
      return exhaustive;
    }
  }
}

export function retreatSystemAdminInviteWizardStep(
  current: SystemAdminInviteWizardStep
): SystemAdminInviteWizardStep | null {
  switch (current.step) {
    case "identity":
      return null;
    case "role":
      return { step: "identity" };
    case "confirm":
      return { step: "role", identity: current.identity };
    default: {
      const exhaustive: never = current;
      return exhaustive;
    }
  }
}

export function isSystemAdminInviteIdentityDraft(
  value: unknown
): value is SystemAdminInviteIdentityDraft {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<SystemAdminInviteIdentityDraft>;
  return (
    typeof candidate.displayName === "string" &&
    candidate.displayName.trim().length > 0 &&
    typeof candidate.email === "string" &&
    candidate.email.trim().length > 0
  );
}
