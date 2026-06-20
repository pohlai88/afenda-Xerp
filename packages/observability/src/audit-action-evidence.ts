import { AuditAdapterMissingError, writeAuditEvent } from "./audit.writer.js";
import { AuditValidationError } from "./audit-event.validation.js";
import type {
  AuditEventMetadata,
  AuditEventPersistenceAdapter,
  WriteAuditEventInput,
} from "./contracts/audit-event.contract.js";

/**
 * Audit evidence fields required at the call site.
 *
 * Omits `result` — that is resolved by the helper based on operation outcome.
 */
export type ActionEvidenceInput = Omit<WriteAuditEventInput, "result"> & {
  /**
   * When `true`, the helper fails closed if no audit adapter is configured.
   * Use for high-stakes actions (permission changes, financial writes, data deletion)
   * where audit evidence is a hard requirement.
   *
   * When `false` (default), a missing adapter silently skips audit and returns
   * `auditId: ""`. Infrastructure failures are always silenced regardless of this flag.
   */
  readonly critical?: boolean;
  /**
   * Optional metadata to attach on success, merged with caller-provided metadata.
   * Must not contain sensitive values — validated by writeAuditEvent.
   */
  readonly successMetadata?: AuditEventMetadata;
  /**
   * Optional metadata to attach on failure.
   * Defaults to `{ errorCode }` when the thrown value is an Error with a `code` field.
   * Must not contain sensitive values.
   */
  readonly failureMetadata?: AuditEventMetadata;
};

export interface ActionEvidenceResult<T> {
  /**
   * The ID assigned by the persistence layer to the audit event.
   * Empty string `""` when audit was silently skipped (non-critical, adapter missing).
   */
  readonly auditId: string;
  readonly value: T;
}

/**
 * Wraps a protected action with automatic audit evidence.
 *
 * ### Guarantees
 * - Every successful execution emits `result: "success"` with actor, target,
 *   correlationId, module, and action.
 * - Every failed execution emits `result: "failure"` with `errorCode` only —
 *   the raw error message is never written to audit metadata.
 * - `AuditValidationError` (sensitive key, bad data) is always re-thrown —
 *   security violations must be fixed by the caller, not silenced.
 * - `AuditAdapterMissingError` is re-thrown when `critical: true`.
 *   For non-critical actions the audit write is silently skipped with `auditId: ""`.
 * - Infrastructure failures (DB down, network error) never block the governed operation.
 *
 * ### Critical vs non-critical
 * Set `critical: true` for high-stakes actions:
 * - Permission grants / revocations
 * - Financial writes (journal entries, approvals)
 * - Data deletions
 * - Tenant or company configuration changes
 *
 * @example
 * ```ts
 * const { value: membership } = await withAuditEvidence(
 *   {
 *     critical: true,
 *     correlationId: ctx.correlationId,
 *     actorType: "user",
 *     actorUserId: session.userId,
 *     tenantId: session.tenantId,
 *     module: "membership",
 *     action: "membership.create",
 *     targetType: "membership",
 *     source: "server_action",
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
  const isCritical = evidence.critical ?? false;

  let value: T;

  try {
    value = await operation();
  } catch (thrown: unknown) {
    const failureMeta = buildFailureMetadata(thrown, evidence.failureMetadata);

    await writeAuditEventSilently(
      {
        ...evidenceWithoutHelperFields(evidence),
        result: "failure",
        metadata: failureMeta,
      },
      adapter,
      isCritical
    );

    throw thrown;
  }

  const successMeta = mergeMetadata(
    evidence.metadata,
    evidence.successMetadata
  );

  const auditResult = await writeAuditEventSilently(
    {
      ...evidenceWithoutHelperFields(evidence),
      result: "success",
      metadata: successMeta,
    },
    adapter,
    isCritical
  );

  return { value, auditId: auditResult?.id ?? "" };
}

/**
 * Strips helper-only fields before forwarding to the audit writer contract.
 */
function evidenceWithoutHelperFields(
  evidence: ActionEvidenceInput
): Omit<WriteAuditEventInput, "result"> {
  const {
    critical: _critical,
    successMetadata: _sm,
    failureMetadata: _fm,
    ...input
  } = evidence;
  return input;
}

function buildFailureMetadata(
  thrown: unknown,
  override?: AuditEventMetadata
): AuditEventMetadata {
  if (thrown instanceof Error) {
    const code =
      "code" in thrown && typeof thrown.code === "string" ? thrown.code : null;

    const base: AuditEventMetadata = code ? { errorCode: code } : {};
    return mergeMetadata(base, override);
  }

  return mergeMetadata({}, override);
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
  adapter: AuditEventPersistenceAdapter | null,
  critical: boolean
): Promise<{ id: string } | null> {
  try {
    return await writeAuditEvent(input, adapter);
  } catch (err) {
    if (err instanceof AuditValidationError) {
      // Programming error or security violation — always re-throw.
      // The caller must fix invalid or sensitive audit metadata.
      throw err;
    }

    if (err instanceof AuditAdapterMissingError && critical) {
      // Critical action with no adapter configured — fail closed.
      // Wire configureAuditEventPersistence() in server bootstrap before
      // calling critical protected actions.
      throw err;
    }

    // Infrastructure failure or non-critical missing adapter — swallow silently
    // so audit write failures never block the governed operation.
    return null;
  }
}
