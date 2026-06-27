import { describe, expect, it } from "vitest";
import { parseIso8601UtcTimestamp } from "../contracts/iso8601-utc-timestamp.js";

describe("parseIso8601UtcTimestamp", () => {
  it("accepts Z-suffixed UTC timestamps", () => {
    expect(parseIso8601UtcTimestamp("2026-06-27T00:00:00.000Z")).toBe(
      Date.parse("2026-06-27T00:00:00.000Z")
    );
  });

  it("accepts explicit +00:00 UTC offsets", () => {
    expect(parseIso8601UtcTimestamp("2026-06-27T00:00:00.000+00:00")).toBe(
      Date.parse("2026-06-27T00:00:00.000Z")
    );
    expect(parseIso8601UtcTimestamp("2026-06-27T00:00:00+00:00")).toBe(
      Date.parse("2026-06-27T00:00:00.000Z")
    );
  });

  it("rejects non-UTC offsets", () => {
    expect(parseIso8601UtcTimestamp("2026-06-27T00:00:00.000+05:30")).toBe(
      undefined
    );
  });

  it("rejects malformed timestamps", () => {
    expect(parseIso8601UtcTimestamp("not-a-date")).toBe(undefined);
    expect(parseIso8601UtcTimestamp("2026-06-27")).toBe(undefined);
  });
});
