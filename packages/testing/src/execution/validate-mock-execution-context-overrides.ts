import type { ExecutionContextInput } from "@afenda/execution";

/** PAS §4.1.3 / ADR-0021 — same shape enforced at mock execution boundaries. */
const MOCK_EXECUTION_CANONICAL_ID_PATTERN = /^[a-z]{3}_[0-9A-HJKMNP-TV-Z]{26}$/;

const MOCK_EXECUTION_ID_FIELDS = [
  "actorId",
  "companyId",
  "correlationId",
  "executionId",
  "organizationId",
  "tenantId",
] as const satisfies readonly (keyof ExecutionContextInput)[];

export function isMockExecutionCanonicalId(value: string): boolean {
  return MOCK_EXECUTION_CANONICAL_ID_PATTERN.test(value.trim());
}

export function assertMockExecutionCanonicalIdField(
  field: (typeof MOCK_EXECUTION_ID_FIELDS)[number],
  value: string
): void {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return;
  }

  if (isMockExecutionCanonicalId(trimmed)) {
    return;
  }

  throw new Error(
    `createMockExecutionContext: ${field} must be a canonical enterprise ID ` +
      `(prefix_ulid body, e.g. MOCK_EXECUTION_TEST_EXECUTION_ID). Received: "${value}".`
  );
}

export function validateMockExecutionContextOverrides(
  input: ExecutionContextInput
): void {
  for (const field of MOCK_EXECUTION_ID_FIELDS) {
    const value = input[field];

    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value !== "string") {
      continue;
    }

    assertMockExecutionCanonicalIdField(field, value);
  }
}
