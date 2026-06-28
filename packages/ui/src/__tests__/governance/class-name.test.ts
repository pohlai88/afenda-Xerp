import { describe, expect, it } from "vitest";

import {
  assertAllowedLayoutClassName,
  assertAllowedLayoutClassNameStrict,
  resolveLayoutClassName,
  validateLayoutClassName,
} from "../../governance";

describe("className governance", () => {
  it("allows layout-only class names", () => {
    expect(
      validateLayoutClassName("flex w-full justify-between overflow-hidden")
        .valid
    ).toBe(true);
  });

  it("blocks semantic color classes", () => {
    expect(validateLayoutClassName("bg-red-500").valid).toBe(false);
  });

  it("blocks arbitrary values", () => {
    expect(validateLayoutClassName("w-[123px]").valid).toBe(false);
  });

  it("blocks unapproved layout classes", () => {
    expect(validateLayoutClassName("container").valid).toBe(false);
  });

  it("treats undefined and empty className as valid", () => {
    expect(validateLayoutClassName(undefined).valid).toBe(true);
    expect(validateLayoutClassName("").valid).toBe(true);
  });

  it("strict assertion throws outside development assumptions", () => {
    expect(() => assertAllowedLayoutClassNameStrict("text-white")).toThrow(
      "Governed UI className policy violation"
    );
  });
});

describe("assertAllowedLayoutClassName", () => {
  it("allows approved layout utilities", () => {
    expect(() =>
      assertAllowedLayoutClassName(
        "flex w-full justify-between overflow-hidden"
      )
    ).not.toThrow();
  });

  it("rejects semantic color classes", () => {
    expect(() => assertAllowedLayoutClassName("bg-blue-600")).toThrow(
      "Governed UI className policy violation"
    );
  });

  it("rejects radius overrides", () => {
    expect(() => assertAllowedLayoutClassName("rounded-[13px]")).toThrow(
      "Governed UI className policy violation"
    );
  });

  it("rejects shadow overrides", () => {
    expect(() => assertAllowedLayoutClassName("shadow-xl")).toThrow(
      "Governed UI className policy violation"
    );
  });

  it("rejects typography overrides", () => {
    expect(() => assertAllowedLayoutClassName("text-[15px]")).toThrow(
      "Governed UI className policy violation"
    );
  });

  it("rejects unknown utilities not approved as layout escape", () => {
    expect(() => assertAllowedLayoutClassName("p-4")).toThrow(
      "not-approved-layout-pattern"
    );
  });

  it("rejects arbitrary layout escape values", () => {
    expect(() => assertAllowedLayoutClassName("w-[calc(100%-1rem)]")).toThrow(
      "arbitrary-value"
    );
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
