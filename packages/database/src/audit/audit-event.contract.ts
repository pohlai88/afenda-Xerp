import type { AuditActorType, AuditResult } from "../database.types.js";

/**
 * Audit write contract — types and constants only (no I/O, no validation).
 *
 * Module layout:
 * - `audit-event.contract.ts` — types/constants
 * - `audit-event.validation.ts` — runtime validation (Zod)
 * - `audit-event.builder.ts` — pure row builder
 * - `audit.writer.ts` — append-only DB insert
 * - `schema/audit.schema.ts` — Drizzle table definition
 */

/** Current audit event schema version written to `event_version`. */
export const AUDIT_EVENT_VERSION = "1.0" as const;

export const AUDIT_EVENT_VERSIONS = [AUDIT_EVENT_VERSION] as const;

export type AuditEventVersion = (typeof AUDIT_EVENT_VERSIONS)[number];

export const AUDIT_SOURCES = [
  "app",
  "auth",
  "api",
  "cron",
  "import",
  "integration",
  "system",
] as const;

export type AuditSource = (typeof AUDIT_SOURCES)[number];

export type AuditMetadataPrimitive = string | number | boolean | null;

/** Controlled JSON metadata contract — no untyped `any`. */
export interface AuditEventMetadata {
  readonly [key: string]:
    | AuditMetadataPrimitive
    | readonly AuditMetadataPrimitive[]
    | AuditEventMetadata;
}

export interface InsertAuditEventInput {
  readonly action: string;
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly companyId?: string | null;
  readonly correlationId: string;
  readonly eventVersion?: AuditEventVersion;
  readonly ipAddress?: string | null;
  readonly metadata?: AuditEventMetadata;
  readonly module: string;
  readonly organizationId?: string | null;
  readonly permission?: string | null;
  readonly policyId?: string | null;
  readonly reason?: string | null;
  readonly result: AuditResult;
  readonly source?: AuditSource;
  readonly targetId?: string | null;
  readonly targetType: string;
  readonly tenantId?: string | null;
  readonly userAgent?: string | null;
}

export interface AuditEventInsertRow {
  action: string;
  actorType: AuditActorType;
  actorUserId: string | null;
  companyId: string | null;
  correlationId: string;
  eventVersion: AuditEventVersion;
  ipAddress: string | null;
  metadata: AuditEventMetadata;
  module: string;
  organizationId: string | null;
  permission: string | null;
  policyId: string | null;
  reason: string | null;
  result: AuditResult;
  source: AuditSource;
  targetId: string | null;
  targetType: string;
  tenantId: string | null;
  userAgent: string | null;
}

/** Field length limits for append-only audit evidence. */
export const AUDIT_FIELD_LIMITS = {
  module: 64,
  action: 96,
  targetType: 96,
  targetId: 191,
  reason: 500,
  permission: 191,
  policyId: 191,
  correlationId: 191,
  ipAddress: 64,
  userAgent: 512,
  scopeId: 191,
} as const;

export const SENSITIVE_METADATA_KEY_PATTERN =
  /(?:^|_)(password|passwd|secret|token|session|authorization|cookie|apikey|api_key|access_token|refresh_token|private_key|credential|credentials|bearer)(?:_|$)/iu;
