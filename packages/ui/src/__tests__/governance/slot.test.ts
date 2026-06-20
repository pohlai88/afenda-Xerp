import { describe, expect, it } from "vitest";

import {
  assertSlotContract,
  assertSlotRole,
  getSlotRoles,
  getUnknownSlotRoles,
  isSlotRole,
  resolveSlotRole,
} from "../../governance/slot";

describe("slot governance", () => {
  it("recognizes governed slot roles", () => {
    expect(isSlotRole("root")).toBe(true);
    expect(isSlotRole("unknown-slot")).toBe(false);
  });

  it("accepts all governed slot roles", () => {
    for (const role of getSlotRoles()) {
      expect(isSlotRole(role)).toBe(true);
      expect(() => assertSlotRole(role)).not.toThrow();
    }
  });

  it("returns the fallback slot when no role is provided", () => {
    expect(resolveSlotRole(undefined)).toBe("root");
    expect(resolveSlotRole("header")).toBe("header");
  });

  it("throws for unsupported slot roles", () => {
    expect(() => assertSlotRole("unknown-slot")).toThrow(
      "TIP-004 slot policy violation"
    );
  });

  it("finds unknown roles in slot contracts", () => {
    expect(
      getUnknownSlotRoles([
        {
          name: "root",
          role: "root",
          required: true,
          ownsStructureOnly: true,
          description: "Root region",
        },
        {
          name: "invalid",
          role: "unknown-slot" as "root",
          required: false,
          ownsStructureOnly: true,
          description: "Invalid role",
        },
      ])
    ).toEqual(["unknown-slot"]);
  });

  it("throws once with all invalid slot contract roles", () => {
    expect(() =>
      assertSlotContract([
        {
          name: "root",
          role: "root",
          required: true,
          ownsStructureOnly: true,
          description: "Root region",
        },
        {
          name: "invalid-a",
          role: "unknown-a" as "root",
          required: false,
          ownsStructureOnly: true,
          description: "Invalid role A",
        },
        {
          name: "invalid-b",
          role: "unknown-b" as "root",
          required: false,
          ownsStructureOnly: true,
          description: "Invalid role B",
        },
      ])
    ).toThrow("unknown-a, unknown-b");
  });

  it("exposes governed slot roles", () => {
    expect(getSlotRoles()).toContain("root");
  });

  it("validates valid slot contract roles", () => {
    expect(() =>
      assertSlotContract([
        {
          name: "card-header",
          role: "header",
          required: true,
          ownsStructureOnly: true,
          description: "Card header region",
        },
      ])
    ).not.toThrow();
  });
});
