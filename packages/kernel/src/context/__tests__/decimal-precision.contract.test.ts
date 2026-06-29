import { describe, expect, it } from "vitest";

import {
  assertDecimalPrecisionScale,
  assertWireDecimalPrecisionVocabulary,
} from "../decimal-precision.assert.js";
import type { WireDecimalPrecisionVocabulary } from "../decimal-precision.contract.js";
import {
  parseDecimalPrecisionVocabulary,
  parseUnknownDecimalPrecisionVocabulary,
  serializeDecimalPrecisionVocabulary,
} from "../decimal-precision.parser.js";

const VALID_WIRE: WireDecimalPrecisionVocabulary = { scale: 2 };

describe("decimal precision wire triad (PAS-001 B112 · ADR-0029)", () => {
  it("parses valid wire and round-trips through serialize", () => {
    const vocabulary = parseDecimalPrecisionVocabulary(VALID_WIRE);

    expect(serializeDecimalPrecisionVocabulary(vocabulary)).toEqual(VALID_WIRE);
  });

  it("accepts scale boundaries 0 and 18", () => {
    expect(parseDecimalPrecisionVocabulary({ scale: 0 }).scale).toBe(0);
    expect(parseDecimalPrecisionVocabulary({ scale: 18 }).scale).toBe(18);
  });

  it("parses unknown JSON ingress via parseUnknownDecimalPrecisionVocabulary", () => {
    const vocabulary = parseUnknownDecimalPrecisionVocabulary(
      structuredClone(VALID_WIRE) as unknown
    );

    expect(vocabulary.scale).toBe(2);
  });

  it("rejects non-object wire before branding", () => {
    expect(() => assertWireDecimalPrecisionVocabulary(null)).toThrow(
      /must be an object/i
    );
  });

  it("rejects non-integer scale", () => {
    expect(() => assertDecimalPrecisionScale(2.5)).toThrow(/integer/i);
  });

  it("rejects scale outside 0–18", () => {
    expect(() => parseDecimalPrecisionVocabulary({ scale: 19 })).toThrow(
      /between 0 and 18/i
    );
    expect(() => parseDecimalPrecisionVocabulary({ scale: -1 })).toThrow(
      /between 0 and 18/i
    );
  });
});
