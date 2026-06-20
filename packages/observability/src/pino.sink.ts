import pino from "pino";
import type { DiagnosticContext } from "./contracts/diagnostic-context.contract.js";
import type {
  LoggerSink,
  StructuredLogEntry,
} from "./contracts/logger.contract.js";
import { PINO_REDACT_CENSOR, PINO_REDACT_PATHS } from "./pino.redact.js";

/**
 * Maps Afenda log levels to pino numeric levels.
 *
 * Pino uses numeric levels internally:
 *  10 = trace, 20 = debug, 30 = info, 40 = warn, 50 = error, 60 = fatal
 */
const LEVEL_MAP = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
} as const;

/**
 * Returns a pino-pretty transport config for development environments.
 *
 * `pino-pretty` is a devDependency of this package and is always present
 * in development. Production and CI always receive undefined (raw JSON).
 */
function resolvePinoTransport(
  isDevelopment: boolean
): pino.TransportSingleOptions | undefined {
  if (!isDevelopment) {
    return;
  }

  return {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
      messageFormat: "[{service}] {msg}",
      levelFirst: false,
    },
  };
}

export interface PinoSinkOptions {
  /** Additional bindings added to every log entry at the pino base level. */
  readonly bindings?: Record<string, string | number | boolean | null>;
  /** Override pino log level. Defaults to "info" in production, "debug" in development. */
  readonly level?: pino.Level;
  /** Whether to activate pino-pretty for human-readable output. */
  readonly pretty?: boolean;
}

/**
 * Creates a pino-backed `LoggerSink`.
 *
 * Pino features maximized:
 * - Child loggers bind correlationId and module from DiagnosticContext
 * - Automatic redaction of 30+ sensitive path patterns
 * - ISO timestamp serialization
 * - Optional pino-pretty transport for development (devDep, always available)
 * - Standard serializers for Error objects and HTTP requests
 */
export function createPinoSink(
  context: DiagnosticContext,
  options: PinoSinkOptions = {}
): LoggerSink {
  const isDevelopment =
    options.pretty ??
    (context.environment === "development" || context.environment === "test");

  const level = options.level ?? (isDevelopment ? "debug" : "info");
  const transport = resolvePinoTransport(isDevelopment);

  const baseLogger = pino({
    level,
    base: {
      service: context.service,
      pkg: context.package,
      env: context.environment,
      version: context.version,
      ...options.bindings,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: [...PINO_REDACT_PATHS],
      censor: PINO_REDACT_CENSOR,
    },
    serializers: {
      ...pino.stdSerializers,
      err: pino.stdSerializers.err,
    },
    ...(transport ? { transport } : {}),
  });

  const childLogger = baseLogger.child({
    correlationId: context.correlationId,
    module: context.module,
  });

  return {
    write(entry: StructuredLogEntry): void {
      const pinoLevel = LEVEL_MAP[entry.level];

      // correlationId and module are already bound on the child logger.
      // Only forward user metadata and the entry timestamp.
      childLogger[pinoLevel](
        {
          ...(entry.metadata ?? {}),
          timestamp: entry.timestamp,
        },
        entry.message
      );
    },
  };
}
