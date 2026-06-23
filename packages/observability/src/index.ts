export const PACKAGE_NAME = "@afenda/observability" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

export {
  AuditAdapterMissingError,
  configureAuditEventPersistence,
  isAuditPersistenceConfigured,
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
  PinoProductionConfigError,
  type PinoSinkOptions,
} from "./pino.sink.js";
export {
  OBSERVABILITY_APPROVED_IMPORT_SUFFIXES,
  OBSERVABILITY_APPROVED_RUNTIME_DEPENDENCIES,
  OBSERVABILITY_CONSUMER_SCAN_ROOTS,
  OBSERVABILITY_CONTRACT_BARREL_DIRECTORY,
  OBSERVABILITY_ERP_AUDIT_BOOTSTRAP_SYMBOLS,
  OBSERVABILITY_ERP_INSTRUMENTATION_MODULE,
  OBSERVABILITY_FORBIDDEN_AUTHORITY_SYMBOLS,
  OBSERVABILITY_FORBIDDEN_DEPENDENCIES,
  OBSERVABILITY_REQUIRED_MODULES,
  OBSERVABILITY_SENSITIVE_AUDIT_POLICY_MODULES,
  OBSERVABILITY_SURFACE_RULE,
} from "./surface/index.js";
