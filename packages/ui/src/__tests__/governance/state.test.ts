import { describe, expect, it } from "vitest";

import {
  assertGovernedState,
  isGovernedState,
  resolveGovernedState,
} from "../../governance";

describe("state governance", () => {
  it("accepts governed states", () => {
    expect(() => assertGovernedState("ready")).not.toThrow();
    expect(() => assertGovernedState("loading")).not.toThrow();
    expect(() => assertGovernedState("forbidden")).not.toThrow();
  });

  it("rejects unsupported state names", () => {
    expect(() => assertGovernedState("pending")).toThrow(
      "TIP-004 state policy violation"
    );
  });

  it("narrows governed states", () => {
    expect(isGovernedState("ready")).toBe(true);
    expect(isGovernedState("approved")).toBe(false);
  });

  it("resolves undefined state to ready by default", () => {
    expect(resolveGovernedState(undefined)).toBe("ready");
  });

  it("rejects domain workflow states", () => {
    expect(() => resolveGovernedState("paid")).toThrow(
      "TIP-004 state policy violation"
    );
  });
});
