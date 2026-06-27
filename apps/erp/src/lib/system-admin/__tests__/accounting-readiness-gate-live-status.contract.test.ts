import { describe, expect, it } from "vitest";

import type { assertAccountingReadinessGateLiveSnapshotJsonSerializable } from "../accounting-readiness-gate-live-status.contract.js";

describe("AccountingReadinessGateLiveSnapshot — JSON serializability guard", () => {
  it("satisfies compile-time AssertJsonSerializable guard", () => {
    type _Guard = assertAccountingReadinessGateLiveSnapshotJsonSerializable;
    type _GuardSatisfied = _Guard extends true ? true : never;
    const guard: _GuardSatisfied = true;

    expect(guard).toBe(true);
  });
});
