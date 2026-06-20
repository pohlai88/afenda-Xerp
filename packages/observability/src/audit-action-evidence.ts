import { writeAuditEvent } from "./audit.writer.js";
import { AuditValidationError } from "./audit-event.validation.js";
import type {
  AuditEventMetadata,
  AuditEventPersistenceAdapter,
  WriteAuditEventInput,
} from "./contracts/audit-event.contract.js";

/**
 * Audit evidence fields required at the call site.
 * Omits `result`, `timestamp`, and `correlationId` — these are resolved by the helper.
 */
export type ActionEvidenceInput = Omit<WriteAuditEventInput, "result"> & {
  /**
   * Optional metadata to attach on success, merged with any caller-provided metadata.
   * Must not contain sensitive values (validated by writeAuditEvent).
   */
  readonly successMetadata?: AuditEventMetadata;
  /**
   * Optional metadata to attach on failure. Defaults to `{ errorCode }` when the thrown
   * value is an Error. Must not contain sensitive values.
   */
  readonly failureMetadata?: AuditEventMetadata;
};

export interface ActionEvidenceResult<T> {
  readonly auditId: string;
  readonly value: T;
}

/**
 * Wraps a protected action with automatic audit evidence.
 *
 * Guarantees:
 * - Every successful execution emits `result: "success"` with actor, target,
 *   correlationId, module, and action.
 * - Every failed execution emits `result: "failure"` without leaking the raw
 *   error message into metadata (only `errorCode` is captured from Error instances).
 * - Audit write failures do not suppress the original error or success value.
 *
 * @example
 * ```ts
 * const { value: membership } = await withAuditEvidence(
 *   {
 *     correlationId: ctx.correlationId,
 *     actorType: "user",
 *     actorUserId: session.userId,
 *     module: "membership",
 *     action: "membership.create",
 *     targetType: "membership",
 *     targetId: newMembership.id,
 *     source: "api",
 *   },
 *   () => membershipService.create(payload),
 *   adapter
 * );
 * ```
 */
export async function withAuditEvidence<T>(
  evidence: ActionEvidenceInput,
  operation: () => Promise<T>,
  adapter: AuditEventPersistenceAdapter | null = null
): Promise<ActionEvidenceResult<T>> {
  let value: T;

  try {
    value = await operation();
  } catch (thrown: unknown) {
    const failureMeta = buildFailureMetadata(thrown, evidence.failureMetadata);

    await writeAuditEventSilently(
      { ...evidence, result: "failure", metadata: failureMeta },
      adapter
    );

    throw thrown;
  }

  const successMeta = mergeMetadata(
    evidence.metadata,
    evidence.successMetadata
  );

  const auditResult = await writeAuditEventSilently(
    { ...evidence, result: "success", metadata: successMeta },
    adapter
  );

  return { value, auditId: auditResult?.id ?? "" };
}

function buildFailureMetadata(
  thrown: unknown,
  override?: AuditEventMetadata
): AuditEventMetadata {
  let errorCode: string | undefined;

  if (thrown instanceof Error) {
    const code =
      "code" in thrown && typeof thrown.code === "string" ? thrown.code : null;

    if (code) {
      errorCode = code;
    }
  }

  const base: AuditEventMetadata = errorCode ? { errorCode } : {};

  return mergeMetadata(base, override);
}

function mergeMetadata(
  base?: AuditEventMetadata,
  override?: AuditEventMetadata
): AuditEventMetadata {
  if (!(base || override)) {
    return {};
  }

  return { ...(base ?? {}), ...(override ?? {}) };
}

async function writeAuditEventSilently(
  input: WriteAuditEventInput,
  adapter: AuditEventPersistenceAdapter | null
): Promise<{ id: string } | null> {
  try {
    return await writeAuditEvent(input, adapter);
  } catch (err) {
    if (err instanceof AuditValidationError) {
      // Programming error or security violation — rethrow so the developer
      // cannot accidentally pass sensitive fields through audit metadata.
      throw err;
    }

    // Infrastructure failure (DB unavailable, adapter error) — swallow silently
    // so audit write failures never block the governed operation.
    return null;
  }
}
