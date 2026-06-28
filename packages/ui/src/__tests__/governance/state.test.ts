import { describe, expect, it } from "vitest";

import {
  assertGovernedState,
  assertGovernedStates,
  getGovernedStates,
  getUnknownGovernedStates,
  isGovernedState,
  resolveGovernedState,
} from "../../governance/state";

describe("state governance", () => {
  it("recognizes governed states", () => {
    expect(isGovernedState("ready")).toBe(true);
    expect(isGovernedState("posted")).toBe(false);
  });

  it("accepts all governed states", () => {
    for (const state of getGovernedStates()) {
      expect(isGovernedState(state)).toBe(true);
      expect(() => assertGovernedState(state)).not.toThrow();
    }
  });

  it("resolves fallback state", () => {
    expect(resolveGovernedState(undefined)).toBe("ready");
    expect(resolveGovernedState("loading")).toBe("loading");
  });

  it("throws for unsupported state", () => {
    expect(() => assertGovernedState("approved")).toThrow(
      "Governed UI state policy violation"
    );
  });

  it("rejects domain workflow states", () => {
    expect(() => resolveGovernedState("paid")).toThrow(
      "Governed UI state policy violation"
    );
  });

  it("finds unknown governed states", () => {
    expect(getUnknownGovernedStates(["ready", "posted", "approved"])).toEqual([
      "posted",
      "approved",
    ]);
  });

  it("throws once with all invalid states", () => {
    expect(() => assertGovernedStates(["ready", "posted", "approved"])).toThrow(
      "posted, approved"
    );
  });

  it("exposes governed states", () => {
    expect(getGovernedStates()).toContain("ready");
  });
});
