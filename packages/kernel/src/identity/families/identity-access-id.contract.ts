/**
 * Identity and access enterprise IDs (PAS-001 category: identity-access).
 */

import {
  normalizeBrandedIdForWire,
  normalizeOptionalBrandedIdForWire,
} from "../wire/identity-wire.contract.js";
import {
  defineEnterpriseFamily,
  type EnterpriseBrand,
} from "./define-enterprise-family.js";

const user = defineEnterpriseFamily("user");
const role = defineEnterpriseFamily("role");
const membership = defineEnterpriseFamily("membership");
const permission = defineEnterpriseFamily("permission");
const policy = defineEnterpriseFamily("policy");

export type UserId = EnterpriseBrand<"user">;
export type RoleId = EnterpriseBrand<"role">;
export type MembershipId = EnterpriseBrand<"membership">;
export type PermissionId = EnterpriseBrand<"permission">;
export type PolicyId = EnterpriseBrand<"policy">;

export const parseUserId = user.parse;
export const parseOptionalUserId = user.parseOptional;
export const createUserId = user.create;
export const toUserId = user.to;

export const parseRoleId = role.parse;
export const parseOptionalRoleId = role.parseOptional;
export const createRoleId = role.create;
export const toRoleId = role.to;

export const parseMembershipId = membership.parse;
export const parseOptionalMembershipId = membership.parseOptional;
export const createMembershipId = membership.create;
export const toMembershipId = membership.to;

export const parsePermissionId = permission.parse;
export const parseOptionalPermissionId = permission.parseOptional;
export const createPermissionId = permission.create;
export const toPermissionId = permission.to;

export const parsePolicyId = policy.parse;
export const parseOptionalPolicyId = policy.parseOptional;
export const createPolicyId = policy.create;
export const toPolicyId = policy.to;

export function normalizeUserIdForWire(
  value: string | UserId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toUserId);
}

export function normalizeRoleIdForWire(value: string | RoleId): string {
  return normalizeBrandedIdForWire(value, toRoleId);
}

export function normalizeMembershipIdForWire(
  value: string | MembershipId
): string {
  return normalizeBrandedIdForWire(value, toMembershipId);
}

export function normalizePermissionIdForWire(
  value: string | PermissionId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toPermissionId);
}

export function normalizePolicyIdForWire(
  value: string | PolicyId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toPolicyId);
}
