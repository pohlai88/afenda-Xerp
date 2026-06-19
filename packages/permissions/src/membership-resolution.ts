import type { AuthorizationContextInput } from "./authorization-context.js";
import type { AuthorizationDenialCode } from "./authorization-denial-code.js";
import type { AuthorizationResult } from "./authorization-error.js";
import {
  isMembershipActive,
  type MembershipContract,
  membershipMatchesCompany,
  membershipMatchesOrganization,
} from "./membership.contract.js";

interface MembershipDenialFields {
  readonly membershipId: string | null;
  readonly reason: string;
  readonly result: "deny";
  readonly roleId: string | null;
}

type MembershipDenialFactory = (
  code: AuthorizationDenialCode,
  partial: MembershipDenialFields
) => AuthorizationResult;

export type ScopedMembershipResolution =
  | { readonly outcome: "denied"; readonly result: AuthorizationResult }
  | { readonly outcome: "matched"; readonly membership: MembershipContract };

export function isDeniedScopedMembershipResolution(
  resolution: ScopedMembershipResolution
): resolution is Extract<ScopedMembershipResolution, { outcome: "denied" }> {
  return resolution.outcome === "denied";
}

export function isMatchedScopedMembershipResolution(
  resolution: ScopedMembershipResolution
): resolution is Extract<ScopedMembershipResolution, { outcome: "matched" }> {
  return resolution.outcome === "matched";
}

export function resolveScopedMembership(
  memberships: readonly MembershipContract[],
  context: AuthorizationContextInput & { tenantId: string },
  createDenial: MembershipDenialFactory
): ScopedMembershipResolution {
  const activeMemberships = memberships.filter(isMembershipActive);

  if (activeMemberships.length === 0) {
    return {
      outcome: "denied",
      result: createDenial("missing_membership", {
        result: "deny",
        reason: "No active membership found for actor in the requested tenant.",
        membershipId: null,
        roleId: null,
      }),
    };
  }

  const companyScopedMemberships = activeMemberships.filter((membership) =>
    membershipMatchesCompany(membership, context.companyId)
  );

  if (companyScopedMemberships.length === 0) {
    const referenceMembership = activeMemberships[0];
    return {
      outcome: "denied",
      result: createDenial("company_mismatch", {
        result: "deny",
        reason:
          "Membership company scope does not match the requested company.",
        membershipId: referenceMembership?.id ?? null,
        roleId: referenceMembership?.roleId ?? null,
      }),
    };
  }

  const organizationScopedMemberships = companyScopedMemberships.filter(
    (membership) =>
      membershipMatchesOrganization(membership, context.organizationId)
  );

  if (organizationScopedMemberships.length === 0) {
    const referenceMembership = companyScopedMemberships[0];
    return {
      outcome: "denied",
      result: createDenial("company_mismatch", {
        result: "deny",
        reason:
          "Membership organization scope does not match the requested organization.",
        membershipId: referenceMembership?.id ?? null,
        roleId: referenceMembership?.roleId ?? null,
      }),
    };
  }

  const membership = organizationScopedMemberships[0];

  if (!membership) {
    return {
      outcome: "denied",
      result: createDenial("missing_membership", {
        result: "deny",
        reason: "No membership matched the requested authorization scope.",
        membershipId: null,
        roleId: null,
      }),
    };
  }

  return { outcome: "matched", membership };
}
