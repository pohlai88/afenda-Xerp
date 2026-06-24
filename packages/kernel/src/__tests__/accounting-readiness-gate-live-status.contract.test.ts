import { describe, expect, it } from "vitest";

import type { assertAccountingReadinessGateLiveSnapshotJsonSerializable } from "../context/accounting-readiness-gate-live-status.contract.js";

describe("accounting-readiness-gate-live-status.contract", () => {
  it("keeps the live snapshot wire contract JSON-serializable at compile time", () => {
    type _Guard = assertAccountingReadinessGateLiveSnapshotJsonSerializable;
    const guard: _Guard = true;
    expect(guard).toBe(true);
  });
});
