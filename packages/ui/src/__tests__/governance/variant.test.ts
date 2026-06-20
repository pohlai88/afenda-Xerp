import { describe, expect, it } from "vitest";

import { resolveGovernedVariant } from "../../governance";

describe("resolveGovernedVariant", () => {
  it("accepts governed button variant selections", () => {
    expect(
      resolveGovernedVariant(
        {
          intent: "primary",
          emphasis: "solid",
          size: "md",
          density: "standard",
        },
        ["intent", "emphasis", "size", "density"]
      )
    ).toEqual({
      intent: "primary",
      emphasis: "solid",
      size: "md",
      density: "standard",
    });
  });

  it("rejects unsupported intent values in development", () => {
    expect(() =>
      resolveGovernedVariant(
        {
          intent: "brand" as never,
        },
        ["intent"]
      )
    ).toThrow("TIP-004 variant policy violation");
  });

  it("rejects axes not allowed for the component", () => {
    expect(() =>
      resolveGovernedVariant(
        {
          intent: "primary",
          tone: "danger",
        },
        ["intent"]
      )
    ).toThrow("Disallowed variant axes");
  });

  it("accepts governed badge tone selections", () => {
    expect(
      resolveGovernedVariant(
        {
          tone: "success",
          size: "sm",
          density: "compact",
        },
        ["tone", "size", "density"]
      )
    ).toEqual({
      tone: "success",
      size: "sm",
      density: "compact",
    });
  });

  it("accepts governed card surface selections", () => {
    expect(
      resolveGovernedVariant(
        {
          radius: "md",
          shadow: "raised",
          density: "standard",
        },
        ["radius", "shadow", "density"]
      )
    ).toEqual({
      radius: "md",
      shadow: "raised",
      density: "standard",
    });
  });

  it("rejects unknown runtime keys", () => {
    expect(() =>
      resolveGovernedVariant(
        {
          intent: "primary",
          color: "blue",
        } as never,
        ["intent"]
      )
    ).toThrow("Unknown variant keys");
  });
});
