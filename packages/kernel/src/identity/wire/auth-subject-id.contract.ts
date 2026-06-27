import type { Brand } from "../brand/brand.contract.js";
import { unbrand } from "../brand/brand.contract.js";
import { isCanonicalEnterpriseId } from "../canonical/canonical-id-parser.contract.js";
import { TENANT_HUMAN_REFERENCE_PATTERN } from "../primitives/primitive-brand.helpers.js";

/** Better Auth login subject (`auth_user.id`) — OAuth/login identity text PK (PAS-001 §4.1.11). */
export type AuthSubjectId = Brand<string, "AuthSubjectId">;

export function parseAuthSubjectId(value: string): AuthSubjectId {
  const raw = value.trim();

  if (!raw) {
    throw new Error("AuthSubjectId is required.");
  }

  if (isCanonicalEnterpriseId(raw)) {
    throw new Error("AuthSubjectId must not be a canonical enterprise ID.");
  }

  if (TENANT_HUMAN_REFERENCE_PATTERN.test(raw)) {
    throw new Error("AuthSubjectId must not be a tenant human reference.");
  }

  return raw as AuthSubjectId;
}

export function parseOptionalAuthSubjectId(
  value: string | null | undefined
): AuthSubjectId | null {
  if (value == null || value === "") {
    return null;
  }

  return parseAuthSubjectId(value);
}

export function toAuthSubjectId(value: AuthSubjectId): string {
  return unbrand(value);
}

export function isAuthSubjectId(value: string): value is AuthSubjectId {
  try {
    parseAuthSubjectId(value);
    return true;
  } catch {
    return false;
  }
}
