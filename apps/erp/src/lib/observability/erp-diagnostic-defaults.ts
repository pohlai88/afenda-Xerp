import type { DiagnosticContext } from "@afenda/observability";

import erpPackage from "../../../package.json" with { type: "json" };

export const ERP_APP_VERSION = erpPackage.version;

export const ERP_DIAGNOSTIC_DEFAULTS = {
  package: "@afenda/erp",
  service: "afenda-erp",
  version: ERP_APP_VERSION,
} as const satisfies Pick<DiagnosticContext, "package" | "service" | "version">;

export const ERP_LOGGER_MODULES = {
  apiAuthorization: "api-authorization",
  apiHandler: "api-handler",
  audit: "audit",
  operatingContext: "operating-context",
  serverAction: "server-action",
} as const satisfies Record<string, string>;
