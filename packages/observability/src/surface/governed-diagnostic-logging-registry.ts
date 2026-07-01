/**
 * Governed diagnostic logging registry — PKG013_LOGGING.
 *
 * Defines ERP surfaces that must emit correlated structured diagnostics on
 * protected paths and the wiring modules CI validates via
 * `pnpm check:erp-diagnostic-logging`.
 *
 * Server-action paths byte-align with `GOVERNED_MUTATION_SERVER_ACTION_MODULES`
 * in `governed-mutation-audit-registry.ts`. Audit owns mutation audit symbols;
 * logging owns diagnostic emission symbols.
 */
export const GOVERNED_DIAGNOSTIC_LOGGING_EMISSION_SYMBOLS = [
  "createApiHandlerLogger",
  "logApiRequest",
  "createRequestBoundErpLogger",
  "logServerActionError",
] as const;

/** ERP modules that wire diagnostic logging for governed API mutations. */
export const GOVERNED_DIAGNOSTIC_API_MODULES = [
  {
    path: "apps/erp/src/server/api/runtime/api-handler-logging.ts",
    requiredSymbols: ["createApiHandlerLogger", "logApiRequest"],
  },
  {
    path: "apps/erp/src/server/api/runtime/create-api-handler.ts",
    requiredSymbols: ["createApiHandlerLogger", "logApiRequest"],
  },
  {
    path: "apps/erp/src/lib/observability/create-request-bound-logger.ts",
    requiredSymbols: ["createRequestBoundErpLogger"],
  },
  {
    path: "apps/erp/src/lib/server-actions/log-action-error.ts",
    requiredSymbols: ["logServerActionError"],
  },
] as const;

/** ERP server actions on protected paths — paths byte-aligned with PKG013_AUDIT. */
export const GOVERNED_DIAGNOSTIC_SERVER_ACTION_MODULES = [
  {
    path: "apps/erp/src/lib/context/context-switch.action.ts",
    action: "workspace.context.switch",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
  },
] as const;

export const GOVERNED_DIAGNOSTIC_LOGGING_ENFORCEMENT_MODULE =
  "scripts/governance/lib/governed-diagnostic-logging-enforcement.mts" as const;

export const GOVERNED_DIAGNOSTIC_LOGGING_GATE_SCRIPT =
  "scripts/governance/check-erp-diagnostic-logging.mts" as const;
