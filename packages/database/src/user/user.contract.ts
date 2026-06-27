/**
 * User write governance — types and pure builders (no I/O).
 *
 * Table: `schema/user.schema.ts`
 * Writes: `user.service.ts`
 */
/**
 * User write governance — types and pure builders (no I/O).
 *
 * Table: `schema/user.schema.ts`
 * Writes: `user.service.ts`
 */
import type { UserStatus } from "../database.types.js";
import { createEnterpriseId } from "../enterprise-id/index.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const MAX_EMAIL_LENGTH = 320;

export class InvalidEmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidEmailError";
  }
}

/**
 * Normalizes platform user email for storage and uniqueness.
 * Always lowercase and trimmed before insert/update.
 */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function assertEmail(value: string): string {
  const normalized = normalizeEmail(value);

  if (!normalized) {
    throw new InvalidEmailError("Email must be non-empty.");
  }

  if (normalized.length > MAX_EMAIL_LENGTH) {
    throw new InvalidEmailError(
      `Email must be ${MAX_EMAIL_LENGTH} characters or less.`
    );
  }

  if (!EMAIL_PATTERN.test(normalized)) {
    throw new InvalidEmailError(`Invalid email address "${value}".`);
  }

  return normalized;
}

/** Only active platform users may act in ERP authority flows. */
export function isPlatformUserActive(
  user: Pick<PlatformUserRecord, "status">
): boolean {
  return user.status === "active";
}

export interface PlatformUserWriteInput {
  readonly displayName: string;
  readonly email: string;
  readonly status?: UserStatus;
}

export interface PlatformUserRecord {
  displayName: string;
  email: string;
  enterpriseId: string;
  status: UserStatus;
}

export type PlatformUserUpdatePatch = Partial<PlatformUserRecord>;

/** Normalizes governed user fields before DB write (no I/O). */
export function buildUserInsertRow(
  input: PlatformUserWriteInput
): PlatformUserRecord {
  return {
    email: assertEmail(input.email),
    enterpriseId: createEnterpriseId("user"),
    displayName: input.displayName.trim(),
    status: input.status ?? "active",
  };
}

export function buildUserUpdatePatch(
  input: PlatformUserUpdatePatch
): PlatformUserUpdatePatch {
  const patch: PlatformUserUpdatePatch = {};

  if (input.email !== undefined) {
    patch.email = assertEmail(input.email);
  }
  if (input.displayName !== undefined) {
    patch.displayName = input.displayName.trim();
  }
  if (input.status !== undefined) {
    patch.status = input.status;
  }

  return patch;
}
