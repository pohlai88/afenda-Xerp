import { describe, expect, it } from "vitest";
import {
  MOCK_EXECUTION_TEST_EXECUTION_ALT_ID,
  MOCK_EXECUTION_TEST_EXECUTION_ID,
} from "../execution/execution-test-fixtures.js";
import { createMockExecutionContext } from "../execution/mock-execution-provider.js";
import {
  assertMockExecutionCanonicalIdField,
  isMockExecutionCanonicalId,
  validateMockExecutionContextOverrides,
} from "../execution/validate-mock-execution-context-overrides.js";

describe("mock execution context canonical validation", () => {
  it("accepts canonical enterprise id strings", () => {
    expect(isMockExecutionCanonicalId(MOCK_EXECUTION_TEST_EXECUTION_ID)).toBe(
      true
    );
    expect(isMockExecutionCanonicalId("exe_01ARZ3NDEKTSV4RRFFQ69G5FB0")).toBe(
      true
    );
  });

  it("rejects legacy non-canonical override strings", () => {
    expect(() =>
      assertMockExecutionCanonicalIdField("executionId", "exec-001")
    ).toThrow(/MOCK_EXECUTION_TEST_EXECUTION_ID/);

    expect(() =>
      validateMockExecutionContextOverrides({
        correlationId: "corr-legacy",
        source: "api",
      })
    ).toThrow(/correlationId must be a canonical enterprise ID/);
  });

  it("createMockExecutionContext rejects legacy executionId overrides", () => {
    const legacyExecutionId = "exec-legacy-001";

    expect(() =>
      createMockExecutionContext({
        executionId: legacyExecutionId,
      })
    ).toThrow(/executionId must be a canonical enterprise ID/);
  });

  it("createMockExecutionContext accepts canonical executionId overrides", () => {
    const context = createMockExecutionContext({
      executionId: MOCK_EXECUTION_TEST_EXECUTION_ALT_ID,
    });

    expect(context.executionId).toBe(MOCK_EXECUTION_TEST_EXECUTION_ALT_ID);
  });
});
