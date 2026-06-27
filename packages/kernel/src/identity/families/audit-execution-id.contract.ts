/**
 * Audit and execution enterprise IDs (PAS-001 category: audit-execution).
 */

import {
  normalizeBrandedIdForWire,
  normalizeOptionalBrandedIdForWire,
} from "../wire/identity-wire.contract.js";
import {
  defineEnterpriseFamily,
  type EnterpriseBrand,
} from "./define-enterprise-family.js";

const auditEvent = defineEnterpriseFamily("auditEvent");
const execution = defineEnterpriseFamily("execution");
const correlation = defineEnterpriseFamily("correlation");

export type AuditEventId = EnterpriseBrand<"auditEvent">;
export type ExecutionId = EnterpriseBrand<"execution">;
export type CorrelationId = EnterpriseBrand<"correlation">;

export const parseAuditEventId = auditEvent.parse;
export const parseOptionalAuditEventId = auditEvent.parseOptional;
export const createAuditEventId = auditEvent.create;
export const toAuditEventId = auditEvent.to;

export const parseExecutionId = execution.parse;
export const createExecutionId = execution.create;
export const toExecutionId = execution.to;

export const parseCorrelationId = correlation.parse;
export const createCorrelationId = correlation.create;
export const toCorrelationId = correlation.to;

export function normalizeAuditEventIdForWire(
  value: string | AuditEventId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toAuditEventId);
}

export function normalizeExecutionIdForWire(
  value: string | ExecutionId
): string {
  return normalizeBrandedIdForWire(value, toExecutionId);
}

export function normalizeCorrelationIdForWire(
  value: string | CorrelationId
): string {
  return normalizeBrandedIdForWire(value, toCorrelationId);
}
