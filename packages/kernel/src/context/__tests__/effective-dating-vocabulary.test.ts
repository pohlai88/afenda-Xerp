import { describe, expect, it } from "vitest";

import {
  isNullableEffectiveRangeAt,
  isRecordEffectiveAt,
} from "../effective-dating-vocabulary.contract.js";

describe("effective dating vocabulary (PAS-001 amendment)", () => {
  it("evaluates closed effective ranges", () => {
    expect(isRecordEffectiveAt("2026-01-01", null, "2026-06-01")).toBe(true);
    expect(isRecordEffectiveAt("2026-06-01", null, "2026-01-01")).toBe(false);
    expect(isRecordEffectiveAt("2026-01-01", "2026-05-31", "2026-06-01")).toBe(
      false
    );
  });

  it("evaluates nullable lower bounds", () => {
    expect(isNullableEffectiveRangeAt(null, null, "2026-06-01")).toBe(true);
    expect(isNullableEffectiveRangeAt("2026-07-01", null, "2026-06-01")).toBe(
      false
    );
  });
});
