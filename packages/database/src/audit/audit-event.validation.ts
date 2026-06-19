/**
 * Runtime validation for audit writes (Zod + metadata sanitizer).
 *
 * Not to be confused with `schema/audit.schema.ts`, which defines the Postgres
 * table shape via Drizzle.
 */
import { z } from "zod";

import { AUDIT_ACTOR_TYPES, auditResultEnum } from "../database.types.js";
import {
  AUDIT_EVENT_VERSION,
  AUDIT_EVENT_VERSIONS,
  AUDIT_FIELD_LIMITS,
  AUDIT_SOURCES,
  type AuditEventInsertRow,
  type AuditEventMetadata,
  type AuditMetadataPrimitive,
  type InsertAuditEventInput,
  SENSITIVE_METADATA_KEY_PATTERN,
} from "./audit-event.contract.js";

export class AuditValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuditValidationError";
  }
}

const AUDIT_RESULTS = auditResultEnum.enumValues;

export const auditSourceSchema = z.enum(AUDIT_SOURCES);

export const auditEventVersionSchema = z.enum(AUDIT_EVENT_VERSIONS);

export const auditActorTypeSchema = z.enum(AUDIT_ACTOR_TYPES);

export const auditResultSchema = z.enum(AUDIT_RESULTS);

export const auditMetadataPrimitiveSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

const MAX_METADATA_DEPTH = 10;
const MAX_METADATA_KEYS = 100;

function failValidation(message: string): never {
  throw new AuditValidationError(message);
}

function normalizeRequiredText(
  value: string,
  field: string,
  maxLength: number
): string {
  const normalized = value.trim();

  if (!normalized) {
    failValidation(`Audit field cannot be empty: ${field}`);
  }

  if (normalized.length > maxLength) {
    failValidation(`Audit field "${field}" exceeds ${maxLength} characters.`);
  }

  return normalized;
}

function normalizeOptionalText(
  value: string | null | undefined,
  field: string,
  maxLength: number
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  if (normalized.length > maxLength) {
    failValidation(`Audit field "${field}" exceeds ${maxLength} characters.`);
  }

  return normalized;
}

function assertMetadataKeyAllowed(key: string, path: string): void {
  if (SENSITIVE_METADATA_KEY_PATTERN.test(key)) {
    failValidation(
      `Audit metadata key "${path}" is blocked because it may contain sensitive data.`
    );
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertJsonSafePrimitive(
  value: unknown,
  path: string
): string | number | boolean | null {
  if (value === null) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      failValidation(
        `Audit metadata value at "${path}" must be a finite number.`
      );
    }
    return value;
  }

  if (typeof value === "boolean") {
    return value;
  }

  failValidation(
    `Audit metadata value at "${path}" must be JSON-safe (string, number, boolean, or null).`
  );
}

/** Recursively validates metadata is JSON-safe and blocks sensitive keys. */
export function assertAuditMetadata(
  value: unknown,
  path = "metadata",
  depth = 0
): AuditEventMetadata {
  if (value === undefined || value === null) {
    return {};
  }

  if (!isPlainObject(value)) {
    failValidation(`${path} must be a plain object.`);
  }

  if (depth > MAX_METADATA_DEPTH) {
    failValidation(`${path} exceeds maximum metadata nesting depth.`);
  }

  const keys = Object.keys(value);

  if (keys.length > MAX_METADATA_KEYS) {
    failValidation(`${path} exceeds maximum metadata key count.`);
  }

  const metadata: Record<
    string,
    | AuditMetadataPrimitive
    | readonly AuditMetadataPrimitive[]
    | AuditEventMetadata
  > = {};

  for (const key of keys) {
    const childPath = `${path}.${key}`;
    assertMetadataKeyAllowed(key, childPath);

    const childValue = value[key];

    if (childValue === undefined) {
      failValidation(
        `Audit metadata value at "${childPath}" cannot be undefined.`
      );
    }

    if (Array.isArray(childValue)) {
      metadata[key] = childValue.map((item, index) =>
        assertJsonSafePrimitive(item, `${childPath}[${index}]`)
      );
      continue;
    }

    if (isPlainObject(childValue)) {
      metadata[key] = assertAuditMetadata(childValue, childPath, depth + 1);
      continue;
    }

    metadata[key] = assertJsonSafePrimitive(childValue, childPath);
  }

  return metadata;
}

export const insertAuditEventInputSchema = z
  .object({
    tenantId: z.string().nullable().optional(),
    companyId: z.string().nullable().optional(),
    organizationId: z.string().nullable().optional(),
    actorType: auditActorTypeSchema,
    actorUserId: z.string().nullable().optional(),
    module: z.string(),
    action: z.string(),
    targetType: z.string(),
    targetId: z.string().nullable().optional(),
    result: auditResultSchema,
    reason: z.string().nullable().optional(),
    permission: z.string().nullable().optional(),
    policyId: z.string().nullable().optional(),
    source: auditSourceSchema.optional(),
    correlationId: z.string(),
    eventVersion: auditEventVersionSchema.optional(),
    ipAddress: z.string().nullable().optional(),
    userAgent: z.string().nullable().optional(),
    metadata: z.unknown().optional(),
  })
  .strict();

export function parseInsertAuditEventInput(
  input: InsertAuditEventInput
): AuditEventInsertRow {
  const parsed = insertAuditEventInputSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    failValidation(issue?.message ?? "Invalid audit event input.");
  }

  const value = parsed.data;

  return {
    tenantId: normalizeOptionalText(
      value.tenantId,
      "tenantId",
      AUDIT_FIELD_LIMITS.scopeId
    ),
    companyId: normalizeOptionalText(
      value.companyId,
      "companyId",
      AUDIT_FIELD_LIMITS.scopeId
    ),
    organizationId: normalizeOptionalText(
      value.organizationId,
      "organizationId",
      AUDIT_FIELD_LIMITS.scopeId
    ),
    actorType: value.actorType,
    actorUserId: normalizeOptionalText(
      value.actorUserId,
      "actorUserId",
      AUDIT_FIELD_LIMITS.scopeId
    ),
    module: normalizeRequiredText(
      value.module,
      "module",
      AUDIT_FIELD_LIMITS.module
    ),
    action: normalizeRequiredText(
      value.action,
      "action",
      AUDIT_FIELD_LIMITS.action
    ),
    targetType: normalizeRequiredText(
      value.targetType,
      "targetType",
      AUDIT_FIELD_LIMITS.targetType
    ),
    targetId: normalizeOptionalText(
      value.targetId,
      "targetId",
      AUDIT_FIELD_LIMITS.targetId
    ),
    result: value.result,
    reason: normalizeOptionalText(
      value.reason,
      "reason",
      AUDIT_FIELD_LIMITS.reason
    ),
    permission: normalizeOptionalText(
      value.permission,
      "permission",
      AUDIT_FIELD_LIMITS.permission
    ),
    policyId: normalizeOptionalText(
      value.policyId,
      "policyId",
      AUDIT_FIELD_LIMITS.policyId
    ),
    source: value.source ?? "app",
    correlationId: normalizeRequiredText(
      value.correlationId,
      "correlationId",
      AUDIT_FIELD_LIMITS.correlationId
    ),
    eventVersion: value.eventVersion ?? AUDIT_EVENT_VERSION,
    ipAddress: normalizeOptionalText(
      value.ipAddress,
      "ipAddress",
      AUDIT_FIELD_LIMITS.ipAddress
    ),
    userAgent: normalizeOptionalText(
      value.userAgent,
      "userAgent",
      AUDIT_FIELD_LIMITS.userAgent
    ),
    metadata: assertAuditMetadata(value.metadata),
  };
}
