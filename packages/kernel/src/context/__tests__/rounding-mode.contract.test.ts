import { describe, expect, it } from "vitest";

import {
  assertRoundingMode,
  assertWireRoundingModeVocabulary,
} from "../rounding-mode.assert.js";
import {
  ROUNDING_MODES,
  type WireRoundingModeVocabulary,
} from "../rounding-mode.contract.js";
import {
  parseRoundingModeVocabulary,
  parseUnknownRoundingModeVocabulary,
  serializeRoundingModeVocabulary,
} from "../rounding-mode.parser.js";

const VALID_WIRE: WireRoundingModeVocabulary = { mode: "half_up" };

describe("rounding mode wire triad (PAS-001 B112 · ADR-0029)", () => {
  it("parses valid wire and round-trips through serialize", () => {
    const vocabulary = parseRoundingModeVocabulary(VALID_WIRE);

    expect(serializeRoundingModeVocabulary(vocabulary)).toEqual(VALID_WIRE);
  });

  it("accepts all governed ROUNDING_MODES tokens", () => {
    for (const mode of ROUNDING_MODES) {
      expect(parseRoundingModeVocabulary({ mode }).mode).toBe(mode);
    }
  });

  it("parses unknown JSON ingress via parseUnknownRoundingModeVocabulary", () => {
    const vocabulary = parseUnknownRoundingModeVocabulary(
      structuredClone(VALID_WIRE) as unknown
    );

    expect(vocabulary.mode).toBe("half_up");
  });

  it("rejects non-object wire before branding", () => {
    expect(() => assertWireRoundingModeVocabulary(null)).toThrow(
      /must be an object/i
    );
  });

  it("rejects unknown mode tokens", () => {
    expect(() => assertRoundingMode("HALF_UP")).toThrow(/must be one of/i);
    expect(() => parseRoundingModeVocabulary({ mode: "bankers" })).toThrow(
      /must be one of/i
    );
  });
});
