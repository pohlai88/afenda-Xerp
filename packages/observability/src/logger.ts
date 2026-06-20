import type { DiagnosticContext } from "./contracts/diagnostic-context.contract.js";
import type {
  Logger,
  LoggerSink,
  LogLevel,
  LogMetadata,
  StructuredLogEntry,
} from "./contracts/logger.contract.js";

function createEntry(
  context: DiagnosticContext,
  level: LogLevel,
  message: string,
  metadata?: LogMetadata
): StructuredLogEntry {
  return {
    context,
    correlationId: context.correlationId,
    level,
    message,
    ...(metadata !== undefined ? { metadata } : {}),
    timestamp: new Date().toISOString(),
  };
}

export function createLogger(
  context: DiagnosticContext,
  sink: LoggerSink
): Logger {
  return {
    debug: (message, metadata) =>
      sink.write(createEntry(context, "debug", message, metadata)),
    info: (message, metadata) =>
      sink.write(createEntry(context, "info", message, metadata)),
    warn: (message, metadata) =>
      sink.write(createEntry(context, "warn", message, metadata)),
    error: (message, metadata) =>
      sink.write(createEntry(context, "error", message, metadata)),
  };
}
