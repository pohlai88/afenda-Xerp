import { describe, expect, it } from "vitest";

import {
  assertGovernedVariantStrict,
  resolveButtonVariant,
  resolveButtonVariantStrict,
  validateGovernedVariant,
} from "../../governance/variant";

describe("variant governance", () => {
  it("accepts governed button variants", () => {
    expect(
      resolveButtonVariantStrict({
        intent: "primary",
        emphasis: "solid",
        size: "md",
      })
    ).toEqual({
      intent: "primary",
      emphasis: "solid",
      size: "md",
    });
  });

  it("rejects unknown variant axes", () => {
    expect(() =>
      assertGovernedVariantStrict({
        color: "red",
      } as never)
    ).toThrow("unknown axis");
  });

  it("rejects disallowed recipe axes", () => {
    expect(() =>
      resolveButtonVariantStrict({
        tone: "danger",
      })
    ).toThrow("disallowed for recipe");
  });

  it("rejects unsupported values", () => {
    expect(() =>
      resolveButtonVariantStrict({
        intent: "random",
      } as never)
    ).toThrow("unsupported value");
  });

  it("runtime resolver normalizes valid axes", () => {
    expect(
      resolveButtonVariant({
        intent: "primary",
        size: "md",
      })
    ).toEqual({
      intent: "primary",
      size: "md",
    });
  });

  it("validator returns inspectable violations", () => {
    const result = validateGovernedVariant({
      intent: "random",
      tone: "danger",
    } as never);

    expect(result.valid).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it("accepts governed card surface selections via strict resolver", () => {
    expect(
      validateGovernedVariant(
        {
          radius: "md",
          shadow: "raised",
          density: "standard",
        },
        ["radius", "shadow", "density"]
      ).valid
    ).toBe(true);
  });

  it("reports multiple invalid contract roles at once", () => {
    expect(() =>
      assertGovernedVariantStrict(
        {
          intent: "random",
          tone: "danger",
        } as never,
        ["intent"]
      )
    ).toThrow("unsupported value");
  });
});
