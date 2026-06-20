export const PACKAGE_NAME = "@afenda/observability" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

// biome-ignore lint/performance/noBarrelFile: package root is the curated public API surface.
export {
  configureAuditEventPersistence,
  resetAuditEventPersistence,
  writeAuditEvent,
} from "./audit.writer.js";
export {
  type ActionEvidenceInput,
  type ActionEvidenceResult,
  withAuditEvidence,
} from "./audit-action-evidence.js";
export { buildAuditEventRow } from "./audit-event.builder.js";
export {
  AuditValidationError,
  assertAuditMetadata,
  parseInsertAuditEventInput,
  parseWriteAuditEventInput,
} from "./audit-event.validation.js";
export {
  RESERVED_AUDIT_ACTIONS,
  type ReservedAuditAction,
} from "./contracts/audit-action.contract.js";
export {
  AUDIT_ACTOR_TYPES,
  AUDIT_EVENT_VERSION,
  AUDIT_EVENT_VERSIONS,
  AUDIT_FIELD_LIMITS,
  type AuditActorType,
  type AuditEventInsertRow,
  type AuditEventMetadata,
  type AuditEventPersistenceAdapter,
  type AuditEventRecord,
  type AuditEventVersion,
  type AuditMetadataPrimitive,
  type InsertAuditEventInput,
  type InsertAuditEventResult,
  type WriteAuditEventInput,
  type WriteAuditEventResult,
} from "./contracts/audit-event.contract.js";
export {
  FORBIDDEN_AUDIT_METADATA_KEYS,
  type ForbiddenAuditMetadataKey,
  SENSITIVE_METADATA_KEY_PATTERN,
} from "./contracts/audit-policy.contract.js";
export {
  AUDIT_RESULTS,
  type AuditResult,
  isAuditResult,
} from "./contracts/audit-result.contract.js";
export {
  AUDIT_SOURCES,
  type AuditSource,
  isAuditSource,
} from "./contracts/audit-source.contract.js";
export {
  assertCorrelationId,
  type CorrelationContext,
  createCorrelationId,
} from "./contracts/correlation.contract.js";
export type { DiagnosticContext } from "./contracts/diagnostic-context.contract.js";
export type {
  Logger,
  LoggerSink,
  LogLevel,
  LogMetadata,
  LogMetadataPrimitive,
  StructuredLogEntry,
} from "./contracts/logger.contract.js";
export { createPinoLogger } from "./create-pino-logger.js";
export { createLogger } from "./logger.js";
export {
  PINO_REDACT_CENSOR,
  PINO_REDACT_PATHS,
} from "./pino.redact.js";
export {
  createPinoSink,
  type PinoSinkOptions,
} from "./pino.sink.js";
