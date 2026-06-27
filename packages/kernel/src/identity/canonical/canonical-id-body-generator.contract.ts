/**
 * PAS-001 §4.1 / Slice B — canonical ID body generation contract.
 *
 * Kernel does not ship a production ULID strategy (no external `ulid` dependency).
 * Callers inject an approved generator at the composition root when persistence
 * or minting is required.
 */

export interface CanonicalIdBodyGenerator {
  generateUlidBody(): string;
}

/** Deterministic PAS §4.1.3 fixture body — tests and explicit composition only. */
export const FIXTURE_CANONICAL_ID_BODY = "01ARZ3NDEKTSV4RRFFQ69G5FAV" as const;

export function createFixtureCanonicalIdBodyGenerator(
  body: string = FIXTURE_CANONICAL_ID_BODY
): CanonicalIdBodyGenerator {
  return {
    generateUlidBody() {
      return body;
    },
  };
}
