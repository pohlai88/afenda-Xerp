import {
  createPinoLogger,
  type DiagnosticContext,
  type Logger,
} from "@afenda/observability";

import { getServerRuntimeEnv } from "../env/server-env";
import type { ErpCorrelationId } from "./erp-correlation-id";
import { ERP_DIAGNOSTIC_DEFAULTS } from "./erp-diagnostic-defaults";

export interface ErpLoggerContext {
  readonly correlationId: ErpCorrelationId;
  readonly module: string;
}

export function buildErpDiagnosticContext(
  context: ErpLoggerContext,
  environment: DiagnosticContext["environment"]
): DiagnosticContext {
  return {
    correlationId: context.correlationId,
    environment,
    module: context.module,
    ...ERP_DIAGNOSTIC_DEFAULTS,
  };
}

export function createErpLogger(context: ErpLoggerContext): Logger {
  const runtimeEnv = getServerRuntimeEnv();
  const nextRuntime = process.env["NEXT_RUNTIME"];
  const disablePrettyTransport =
    nextRuntime === "nodejs" || nextRuntime === "edge";

  return createPinoLogger(
    buildErpDiagnosticContext(context, runtimeEnv.NODE_ENV),
    disablePrettyTransport ? { pretty: false } : undefined
  );
}
