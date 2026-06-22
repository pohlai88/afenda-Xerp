import { membershipMatchesGrantScope } from "@afenda/database";

import type { AuthorizationContextInput } from "../authorization-context.js";
import type { AuthorizationDenialCode } from "../authorization-denial-code.js";
import type { AuthorizationResult } from "../authorization-error.js";
import { selectNarrowestMatchingMembership } from "./grant-scope-resolution.js";
import {
  isMembershipActive,
  type MembershipContract,
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

function createScopeMismatchDenial(
  activeMemberships: readonly MembershipContract[],
  context: AuthorizationContextInput & { tenantId: string },
  createDenial: MembershipDenialFactory
): ScopedMembershipResolution {
  const referenceMembership = activeMemberships[0];
  const hasCompanyContext = Boolean(context.companyId);
  const hasOrganizationContext = Boolean(context.organizationId);

  const tenantOnlyMembership = activeMemberships.some(
    (membership) => membership.scopeType === "tenant"
  );

  if (tenantOnlyMembership && (hasCompanyContext || hasOrganizationContext)) {
    return {
      outcome: "denied",
      result: createDenial("company_mismatch", {
        result: "deny",
        reason:
          "Tenant-scoped grant does not authorize legal entity or organization unit access.",
        membershipId: referenceMembership?.id ?? null,
        roleId: referenceMembership?.roleId ?? null,
      }),
    };
  }

  if (hasCompanyContext) {
    return {
      outcome: "denied",
      result: createDenial("company_mismatch", {
        result: "deny",
        reason:
          "Membership legal entity scope does not match the requested company.",
        membershipId: referenceMembership?.id ?? null,
        roleId: referenceMembership?.roleId ?? null,
      }),
    };
  }

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

  const membership = selectNarrowestMatchingMembership(activeMemberships, {
    companyId: context.companyId ?? null,
    organizationId: context.organizationId ?? null,
  });

  if (!membership) {
    return createScopeMismatchDenial(
      activeMemberships,
      context,
      createDenial
    );
  }

  if (
    !membershipMatchesGrantScope(membership, {
      companyId: context.companyId ?? null,
      organizationId: context.organizationId ?? null,
    })
  ) {
    return createScopeMismatchDenial(
      activeMemberships,
      context,
      createDenial
    );
  }

  return { outcome: "matched", membership };
}
