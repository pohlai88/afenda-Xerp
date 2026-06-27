/** Deterministic Crockford body — PAS §4.1.3 fixture (tests only). */
export const MOCK_FIXTURE_CANONICAL_ID_BODY =
  "01ARZ3NDEKTSV4RRFFQ69G5FAV" as const;

export const mockFixtureCanonicalIdBodyGenerator = {
  generateUlidBody(): string {
    return MOCK_FIXTURE_CANONICAL_ID_BODY;
  },
};

/** Canonical enterprise IDs for mock execution contexts — distinct bodies per family. */
export const MOCK_EXECUTION_TEST_ACTOR_ID =
  "usr_01ARZ3NDEKTSV4RRFFQ69G5FAV" as const;
export const MOCK_EXECUTION_TEST_COMPANY_ID =
  "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAW" as const;
export const MOCK_EXECUTION_TEST_TENANT_ID =
  "ten_01ARZ3NDEKTSV4RRFFQ69G5FAX" as const;
export const MOCK_EXECUTION_TEST_ORGANIZATION_ID =
  "org_01ARZ3NDEKTSV4RRFFQ69G5FAY" as const;
export const MOCK_EXECUTION_TEST_CORRELATION_ID =
  "cor_01ARZ3NDEKTSV4RRFFQ69G5FAZ" as const;
export const MOCK_EXECUTION_TEST_EXECUTION_ID =
  "exe_01ARZ3NDEKTSV4RRFFQ69G5FB0" as const;
export const MOCK_EXECUTION_TEST_CORRELATION_ALT_ID =
  "cor_01ARZ3NDEKTSV4RRFFQ69G5FB2" as const;
export const MOCK_EXECUTION_TEST_EXECUTION_ALT_ID =
  "exe_01ARZ3NDEKTSV4RRFFQ69G5FB3" as const;
