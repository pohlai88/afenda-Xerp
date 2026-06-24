import { dropdownMenuSlotClassNamesByKey } from "@afenda/ui/governance/recipe-maps";
import { describe, expect, it } from "vitest";

describe("ERP vitest @afenda/ui alias", () => {
  it("resolves governed dropdown trigger slot from source", () => {
    expect(dropdownMenuSlotClassNamesByKey.trigger).toBe("relative");
  });
});
