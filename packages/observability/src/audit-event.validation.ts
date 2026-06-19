import {
  AUDIT_ACTOR_TYPES,
  AUDIT_EVENT_VERSION,
  AUDIT_EVENT_VERSIONS,
  AUDIT_FIELD_LIMITS,
  type AuditActorType,
  type AuditEventInsertRow,
  type AuditEventMetadata,
  type AuditMetadataPrimitive,
  type WriteAuditEventInput,
} from "./contracts/audit-event.contract.js";
import {
  FORBIDDEN_AUDIT_METADATA_KEYS,
  SENSITIVE_METADATA_KEY_PATTERN,
} from "./contracts/audit-policy.contract.js";
import {
  AUDIT_RESULTS,
  type AuditResult,
} from "./contracts/audit-result.contract.js";
import {
  AUDIT_SOURCES,
  type AuditSource,
} from "./contracts/audit-source.contract.js";

const MAX_METADATA_DEPTH = 10;
const MAX_METADATA_KEYS = 100;

export class AuditValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuditValidationError";
  }
}

function failValidation(message: string): never {
  throw new AuditValidationError(message);
}

function normalizeRequiredText(
  value: string,
  field: string,
  maxLength: number
): string {
  const normalized = value.trim();

  if (!normalized) {
    failValidation(`Audit field cannot be empty: ${field}`);
  }

  if (normalized.length > maxLength) {
    failValidation(`Audit field "${field}" exceeds ${maxLength} characters.`);
  }

  return normalized;
}

function normalizeOptionalText(
  value: string | null | undefined,
  field: string,
  maxLength: number
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  if (normalized.length > maxLength) {
    failValidation(`Audit field "${field}" exceeds ${maxLength} characters.`);
  }

  return normalized;
}

function assertMetadataKeyAllowed(key: string, path: string): void {
  const isForbiddenKey = FORBIDDEN_AUDIT_METADATA_KEYS.some(
    (forbiddenKey) => forbiddenKey.toLowerCase() === key.toLowerCase()
  );

  if (isForbiddenKey || SENSITIVE_METADATA_KEY_PATTERN.test(key)) {
    failValidation(
      `Audit metadata key "${path}" is blocked because it may contain sensitive data.`
    );
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertJsonSafePrimitive(
  value: unknown,
  path: string
): AuditMetadataPrimitive {
  if (value === null) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      failValidation(
        `Audit metadata value at "${path}" must be a finite number.`
      );
    }
    return value;
  }

  if (typeof value === "boolean") {
    return value;
  }

  failValidation(
    `Audit metadata value at "${path}" must be JSON-safe (string, number, boolean, or null).`
  );
}

function normalizeActorType(value: AuditActorType): AuditActorType {
  if (!AUDIT_ACTOR_TYPES.includes(value)) {
    failValidation(`Unsupported audit actor type: ${String(value)}`);
  }

  return value;
}

function normalizeAuditResult(value: AuditResult): AuditResult {
  if (!AUDIT_RESULTS.includes(value)) {
    failValidation(`Unsupported audit result: ${String(value)}`);
  }

  return value;
}

function normalizeAuditSource(
  value: WriteAuditEventInput["source"]
): AuditSource {
  if (value === undefined || value === "app" || value === "auth") {
    return "api";
  }

  if (value === "cron") {
    return "job";
  }

  if (!AUDIT_SOURCES.includes(value)) {
    failValidation(`Unsupported audit source: ${String(value)}`);
  }

  return value;
}

function normalizeActorId(input: WriteAuditEventInput): string {
  const actorId = normalizeOptionalText(
    input.actorId ?? input.actorUserId,
    "actorId",
    AUDIT_FIELD_LIMITS.scopeId
  );

  if (actorId) {
    return actorId;
  }

  return normalizeRequiredText(
    input.actorType,
    "actorId",
    AUDIT_FIELD_LIMITS.scopeId
  );
}

/** Recursively validates metadata is JSON-safe and blocks sensitive keys. */
export function assertAuditMetadata(
  value: unknown,
  path = "metadata",
  depth = 0
): AuditEventMetadata {
  if (value === undefined || value === null) {
    return {};
  }

  if (!isPlainObject(value)) {
    failValidation(`${path} must be a plain object.`);
  }

  if (depth > MAX_METADATA_DEPTH) {
    failValidation(`${path} exceeds maximum metadata nesting depth.`);
  }

  const keys = Object.keys(value);

  if (keys.length > MAX_METADATA_KEYS) {
    failValidation(`${path} exceeds maximum metadata key count.`);
  }

  const metadata: Record<
    string,
    | AuditMetadataPrimitive
    | readonly AuditMetadataPrimitive[]
    | AuditEventMetadata
  > = {};

  for (const key of keys) {
    const childPath = `${path}.${key}`;
    assertMetadataKeyAllowed(key, childPath);

    const childValue = value[key];

    if (childValue === undefined) {
      failValidation(
        `Audit metadata value at "${childPath}" cannot be undefined.`
      );
    }

    if (Array.isArray(childValue)) {
      metadata[key] = childValue.map((item, index) =>
        assertJsonSafePrimitive(item, `${childPath}[${index}]`)
      );
      continue;
    }

    if (isPlainObject(childValue)) {
      metadata[key] = assertAuditMetadata(childValue, childPath, depth + 1);
      continue;
    }

    metadata[key] = assertJsonSafePrimitive(childValue, childPath);
  }

  return metadata;
}

export function parseWriteAuditEventInput(
  input: WriteAuditEventInput
): AuditEventInsertRow {
  const actorType = normalizeActorType(input.actorType);

  if (
    !AUDIT_EVENT_VERSIONS.includes(input.eventVersion ?? AUDIT_EVENT_VERSION)
  ) {
    failValidation(
      `Unsupported audit event version: ${String(input.eventVersion)}`
    );
  }

  return {
    tenantId: normalizeOptionalText(
      input.tenantId,
      "tenantId",
      AUDIT_FIELD_LIMITS.scopeId
    ),
    companyId: normalizeOptionalText(
      input.companyId,
      "companyId",
      AUDIT_FIELD_LIMITS.scopeId
    ),
    organizationId: normalizeOptionalText(
      input.organizationId,
      "organizationId",
      AUDIT_FIELD_LIMITS.scopeId
    ),
    actorId: normalizeActorId(input),
    actorType,
    actorUserId: normalizeOptionalText(
      input.actorUserId,
      "actorUserId",
      AUDIT_FIELD_LIMITS.scopeId
    ),
    module: normalizeRequiredText(
      input.module,
      "module",
      AUDIT_FIELD_LIMITS.module
    ),
    action: normalizeRequiredText(
      input.action,
      "action",
      AUDIT_FIELD_LIMITS.action
    ),
    targetType: normalizeRequiredText(
      input.targetType,
      "targetType",
      AUDIT_FIELD_LIMITS.targetType
    ),
    targetId: normalizeOptionalText(
      input.targetId,
      "targetId",
      AUDIT_FIELD_LIMITS.targetId
    ),
    result: normalizeAuditResult(input.result),
    reason: normalizeOptionalText(
      input.reason,
      "reason",
      AUDIT_FIELD_LIMITS.reason
    ),
    permission: normalizeOptionalText(
      input.permission,
      "permission",
      AUDIT_FIELD_LIMITS.permission
    ),
    policyId: normalizeOptionalText(
      input.policyId,
      "policyId",
      AUDIT_FIELD_LIMITS.policyId
    ),
    source: normalizeAuditSource(input.source),
    correlationId: normalizeRequiredText(
      input.correlationId,
      "correlationId",
      AUDIT_FIELD_LIMITS.correlationId
    ),
    eventVersion: input.eventVersion ?? AUDIT_EVENT_VERSION,
    ipAddress: normalizeOptionalText(
      input.ipAddress,
      "ipAddress",
      AUDIT_FIELD_LIMITS.ipAddress
    ),
    userAgent: normalizeOptionalText(
      input.userAgent,
      "userAgent",
      AUDIT_FIELD_LIMITS.userAgent
    ),
    metadata: assertAuditMetadata(input.metadata),
  };
}

export const parseInsertAuditEventInput = parseWriteAuditEventInput;
