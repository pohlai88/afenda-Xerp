import type { CorrelationContext } from "./correlation.contract.js";
import type { DiagnosticContext } from "./diagnostic-context.contract.js";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogMetadataPrimitive = string | number | boolean | null;

export interface LogMetadata {
  readonly [key: string]:
    | LogMetadataPrimitive
    | readonly LogMetadataPrimitive[]
    | LogMetadata;
}

export interface StructuredLogEntry extends CorrelationContext {
  readonly context: DiagnosticContext;
  readonly level: LogLevel;
  readonly message: string;
  readonly metadata?: LogMetadata;
  readonly timestamp: string;
}

export interface Logger {
  debug(message: string, metadata?: LogMetadata): void;
  error(message: string, metadata?: LogMetadata): void;
  info(message: string, metadata?: LogMetadata): void;
  warn(message: string, metadata?: LogMetadata): void;
}

export interface LoggerSink {
  write(entry: StructuredLogEntry): void;
}
