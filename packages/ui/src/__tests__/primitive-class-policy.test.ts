import { describe, expect, it } from "vitest";

import {
  assertGuardedClassName,
  guardClassName,
  validateLayoutClassName,
} from "../governance/class-name-guard";

describe("primitive class-name policy", () => {
  it("allows approved structural layout passthrough", () => {
    const result = guardClassName("flex w-full min-w-0 overflow-hidden");
    expect(result.valid).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it("rejects semantic color classes", () => {
    const result = guardClassName("bg-red-500 flex");
    expect(result.valid).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it("rejects arbitrary visual values and gradient slop", () => {
    expect(guardClassName("w-[123px]").valid).toBe(false);
    expect(guardClassName("bg-gradient-to-r from-purple-500").valid).toBe(false);
    expect(guardClassName("backdrop-blur-md").valid).toBe(false);
    expect(guardClassName("blur-[2px] outline-[3px]").valid).toBe(false);
  });

  it("throws on guarded assertion for violations", () => {
    expect(() => assertGuardedClassName("rounded-[14px]")).toThrow(
      /TIP-004 className policy violation/
    );
  });

  it("delegates base layout validation", () => {
    expect(validateLayoutClassName("flex w-full min-w-0").valid).toBe(true);
  });
});
