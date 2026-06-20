import type { DiagnosticContext } from "./contracts/diagnostic-context.contract.js";
import type { Logger } from "./contracts/logger.contract.js";
import { createLogger } from "./logger.js";
import { createPinoSink, type PinoSinkOptions } from "./pino.sink.js";

/**
 * Creates a structured `Logger` backed by pino.
 *
 * This is the preferred logger factory for Node.js server processes.
 * For edge runtimes (Next.js middleware), use `createLogger` with a custom sink.
 *
 * @example
 * ```ts
 * const logger = createPinoLogger({
 *   correlationId: requestId,
 *   service: "afenda-erp",
 *   package: "@afenda/erp",
 *   environment: process.env.NODE_ENV,
 *   module: "auth",
 *   version: "1.0.0",
 * });
 *
 * logger.info("user signed in", { userId: "u-001" });
 * ```
 */
export function createPinoLogger(
  context: DiagnosticContext,
  options?: PinoSinkOptions
): Logger {
  const sink = createPinoSink(context, options);
  return createLogger(context, sink);
}
