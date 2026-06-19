import type { AuditResult } from "./audit-result.contract.js";
import type { AuditSource } from "./audit-source.contract.js";

export const AUDIT_EVENT_VERSION = "1.0" as const;
export const AUDIT_EVENT_VERSIONS = [AUDIT_EVENT_VERSION] as const;

export type AuditEventVersion = (typeof AUDIT_EVENT_VERSIONS)[number];

export const AUDIT_ACTOR_TYPES = [
  "user",
  "system",
  "service",
  "integration",
  "cron",
  "import",
] as const;

export type AuditActorType = (typeof AUDIT_ACTOR_TYPES)[number];

export type AuditMetadataPrimitive = string | number | boolean | null;

export interface AuditEventMetadata {
  readonly [key: string]:
    | AuditMetadataPrimitive
    | readonly AuditMetadataPrimitive[]
    | AuditEventMetadata;
}

export interface WriteAuditEventInput {
  readonly action: string;
  readonly actorId?: string | null;
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
  readonly source?: AuditSource | "app" | "auth" | "cron";
  readonly targetId?: string | null;
  readonly targetType: string;
  readonly tenantId?: string | null;
  readonly userAgent?: string | null;
}

export interface AuditEventInsertRow {
  action: string;
  actorId: string;
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

export interface AuditEventRecord extends AuditEventInsertRow {
  readonly eventId: string;
  readonly timestamp: string;
}

export interface WriteAuditEventResult {
  readonly id: string;
}

export interface AuditEventPersistenceAdapter {
  write(row: AuditEventInsertRow): Promise<WriteAuditEventResult>;
}

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

export type InsertAuditEventInput = WriteAuditEventInput;
export type InsertAuditEventResult = WriteAuditEventResult;
