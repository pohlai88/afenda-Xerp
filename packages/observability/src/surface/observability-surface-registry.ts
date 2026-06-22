/**
 * Canonical observability surface registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Observability, lines 417–420).
 *
 * `@afenda/observability` owns logging, correlation IDs, and audit evidence.
 * Persistence adapters are injected — this package must not import database authority.
 */
export const OBSERVABILITY_SURFACE_RULE =
  "logging-and-audit-evidence-authority; persistence-via-injected-adapters-only" as const;

/** Serializable contract and runtime modules that form the public surface. */
export const OBSERVABILITY_REQUIRED_MODULES = [
  {
    path: "contracts/correlation.contract.ts",
    role: "Correlation ID contract",
    primaryExports: ["CorrelationContext", "createCorrelationId", "assertCorrelationId"],
  },
  {
    path: "contracts/diagnostic-context.contract.ts",
    role: "Diagnostic context for structured logs",
    primaryExports: ["DiagnosticContext"],
  },
  {
    path: "contracts/logger.contract.ts",
    role: "Structured logger contract",
    primaryExports: ["Logger", "StructuredLogEntry", "LogLevel"],
  },
  {
    path: "contracts/audit-event.contract.ts",
    role: "Audit event row contract",
    primaryExports: ["WriteAuditEventInput", "AuditEventInsertRow"],
  },
  {
    path: "contracts/audit-policy.contract.ts",
    role: "Sensitive metadata blocklist",
    primaryExports: ["FORBIDDEN_AUDIT_METADATA_KEYS"],
  },
  {
    path: "audit-event.validation.ts",
    role: "Audit input normalization and validation",
    primaryExports: ["parseWriteAuditEventInput", "assertAuditMetadata"],
  },
  {
    path: "audit.writer.ts",
    role: "Audit persistence delegation",
    primaryExports: ["writeAuditEvent", "configureAuditEventPersistence"],
  },
  {
    path: "logger.ts",
    role: "Structured logger factory",
    primaryExports: ["createLogger"],
  },
] as const;

/** Directory that must expose an index.ts barrel. */
export const OBSERVABILITY_CONTRACT_BARREL_DIRECTORY = "contracts" as const;

/** Workspace roots scanned for forbidden @afenda/observability deep imports. */
export const OBSERVABILITY_CONSUMER_SCAN_ROOTS = [
  "apps/erp/src",
  "packages/database/src",
  "packages/permissions/src",
  "packages/auth/src",
  "packages/execution/src",
  "packages/appshell/src",
  "packages/kernel/src",
  "packages/metadata-ui/src",
  "packages/ai-governance/src",
] as const;

/** ERP server bootstrap must wire audit persistence before protected actions run. */
export const OBSERVABILITY_ERP_INSTRUMENTATION_MODULE =
  "apps/erp/src/instrumentation.ts" as const;

export const OBSERVABILITY_ERP_AUDIT_BOOTSTRAP_SYMBOLS = [
  "configureAuditEventPersistence",
  "createDatabaseAuditAdapter",
] as const;

/** Modules that must wire sensitive-metadata policy into validation. */
export const OBSERVABILITY_SENSITIVE_AUDIT_POLICY_MODULES = [
  {
    path: "contracts/audit-policy.contract.ts",
    requiredSymbols: [
      "FORBIDDEN_AUDIT_METADATA_KEYS",
      "SENSITIVE_METADATA_KEY_PATTERN",
    ],
  },
  {
    path: "audit-event.validation.ts",
    requiredSymbols: [
      "FORBIDDEN_AUDIT_METADATA_KEYS",
      "SENSITIVE_METADATA_KEY_PATTERN",
      "assertMetadataKeyAllowed",
    ],
  },
] as const;

/** Approved @afenda/observability import suffixes — root and barrels only. */
export const OBSERVABILITY_APPROVED_IMPORT_SUFFIXES = [
  "",
  "/contracts",
  "/surface",
] as const;

/** Dependencies observability must never take — authority lives elsewhere. */
export const OBSERVABILITY_FORBIDDEN_DEPENDENCIES = [
  "@afenda/database",
  "@afenda/permissions",
  "@afenda/auth",
  "@afenda/kernel",
  "next",
  "react",
  "react-dom",
] as const;

/** Approved runtime dependency edges for observability (platform-pure). */
export const OBSERVABILITY_APPROVED_RUNTIME_DEPENDENCIES = [
  "pino",
  "pino-std-serializers",
] as const;

/** Symbols that indicate authority resolution — forbidden in observability production source. */
export const OBSERVABILITY_FORBIDDEN_AUTHORITY_SYMBOLS = [
  "resolveOperatingContext",
  "requirePermission",
  "getDb",
  "insertTenant",
  "resolveScopedMembership",
] as const;
