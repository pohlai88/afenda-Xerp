import { describe, expect, it } from "vitest";

import {
  type AcceptanceRecordWire,
  assertAcceptanceRecordWire,
  isAcceptanceRecordWire,
  isSealEligibleLifecycleState,
} from "../meta-contracts/acceptance-record.contract.js";
import { validateAcceptanceRecordSeal } from "../meta-contracts/acceptance-record.validator.js";

describe("acceptance record contract (PAS-006C P06-005)", () => {
  const baseRecord: AcceptanceRecordWire = {
    acceptanceRecordId: "acceptance-record:login-page-04",
    blockId: "login-page-04",
    lifecycleStateAtSeal: "metadata-bound",
    presentationLabProof: "storybook:shadcn-studio-login-page-04",
    acpaProfileVersion: "acpa-2026-06",
    wcagAaAuthAdjacent: true,
    criteriaResults: {
      "lab-story": "pass",
      keyboard: "pass",
      acpa: "pass",
    },
    sealedAt: "2026-06-29T00:00:00.000Z",
    sealedBy: "role:presentation-steward",
  };

  it("is JSON-serializable", () => {
    expect(() => JSON.stringify(baseRecord)).not.toThrow();
    const parsed: unknown = JSON.parse(JSON.stringify(baseRecord));
    expect(isAcceptanceRecordWire(parsed)).toBe(true);
  });

  it("requires metadata-bound or later lifecycle to seal", () => {
    expect(isSealEligibleLifecycleState("imported")).toBe(false);
    expect(isSealEligibleLifecycleState("metadata-bound")).toBe(true);
    expect(isSealEligibleLifecycleState("accepted")).toBe(true);

    expect(
      validateAcceptanceRecordSeal({
        ...baseRecord,
        lifecycleStateAtSeal: "imported",
      })
    ).toEqual({ ok: false, code: "lifecycle-not-eligible" });

    expect(validateAcceptanceRecordSeal(baseRecord).ok).toBe(true);
  });

  it("rejects seal when any criterion fails", () => {
    expect(
      validateAcceptanceRecordSeal({
        ...baseRecord,
        criteriaResults: { keyboard: "fail" },
      })
    ).toEqual({ ok: false, code: "criteria-not-all-pass" });
  });

  it("rejects invalid lifecycle and criterion wire shapes", () => {
    expect(
      isAcceptanceRecordWire({
        ...baseRecord,
        lifecycleStateAtSeal: "not-a-state",
      })
    ).toBe(false);
    expect(
      isAcceptanceRecordWire({
        ...baseRecord,
        criteriaResults: { keyboard: "maybe" },
      })
    ).toBe(false);
  });

  it("rejects whitespace-only ids but allows empty presentationLabProof at wire layer", () => {
    expect(
      isAcceptanceRecordWire({
        ...baseRecord,
        blockId: "   ",
      })
    ).toBe(false);

    const emptyProofRecord = {
      ...baseRecord,
      presentationLabProof: "",
    };
    expect(isAcceptanceRecordWire(emptyProofRecord)).toBe(true);
    expect(validateAcceptanceRecordSeal(emptyProofRecord)).toEqual({
      ok: false,
      code: "missing-lab-proof",
    });
  });

  it("assertAcceptanceRecordWire throws on invalid payload", () => {
    expect(() => assertAcceptanceRecordWire(baseRecord)).not.toThrow();
    expect(() => assertAcceptanceRecordWire(null)).toThrow(
      "Invalid acceptance record wire payload."
    );
  });
});
