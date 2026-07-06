import type { AuthMembershipSwitchTargetDto } from "@/server/api/contracts/auth/auth-memberships.api-contract";

export type AuthWorkspaceSelectionKind = "organization" | "workspace";

export function filterMembershipTargetsByKind(
  targets: readonly AuthMembershipSwitchTargetDto[],
  kind: AuthWorkspaceSelectionKind
): readonly AuthMembershipSwitchTargetDto[] {
  if (kind === "organization") {
    return targets.filter((target) => target.organizationSlug !== undefined);
  }

  return targets;
}

export function resolveWorkspaceSelectionTitle(
  kind: AuthWorkspaceSelectionKind
): string {
  return kind === "organization" ? "Select organization" : "Select workspace";
}

export function resolveWorkspaceSelectionDescription(
  kind: AuthWorkspaceSelectionKind
): string {
  return kind === "organization"
    ? "Choose the organization scope for this sign-in session."
    : "Choose the workspace scope for this sign-in session.";
}
