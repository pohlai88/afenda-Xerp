import { describe, expect, it } from "vitest";

import {
  assertAllowedLayoutClassName,
  resolveLayoutClassName,
} from "../../governance";

describe("assertAllowedLayoutClassName", () => {
  it("allows approved layout utilities", () => {
    expect(() =>
      assertAllowedLayoutClassName("flex w-full justify-between overflow-hidden")
    ).not.toThrow();
  });

  it("rejects semantic color classes", () => {
    expect(() => assertAllowedLayoutClassName("bg-blue-600")).toThrow(
      "TIP-004 className policy violation"
    );
  });

  it("rejects radius overrides", () => {
    expect(() => assertAllowedLayoutClassName("rounded-[13px]")).toThrow(
      "TIP-004 className policy violation"
    );
  });

  it("rejects shadow overrides", () => {
    expect(() => assertAllowedLayoutClassName("shadow-xl")).toThrow(
      "TIP-004 className policy violation"
    );
  });

  it("rejects typography overrides", () => {
    expect(() => assertAllowedLayoutClassName("text-[15px]")).toThrow(
      "TIP-004 className policy violation"
    );
  });

  it("rejects unknown utilities not approved as layout escape", () => {
    expect(() => assertAllowedLayoutClassName("p-4")).toThrow(
      "not-approved-layout-pattern"
    );
  });

  it("rejects arbitrary layout escape values", () => {
    expect(() =>
      assertAllowedLayoutClassName("w-[calc(100%-1rem)]")
    ).toThrow("arbitrary-value");
  });
});

describe("resolveLayoutClassName", () => {
  it("returns validated className without mutation", () => {
    expect(resolveLayoutClassName("flex w-full")).toBe("flex w-full");
  });

  it("returns empty string for undefined input", () => {
    expect(resolveLayoutClassName(undefined)).toBe("");
  });
});
