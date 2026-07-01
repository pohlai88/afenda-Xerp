import { describe, expect, it } from "vitest";

import { cn } from "../../utils/utils.js";

describe("cn", () => {
  it("merges tailwind classes with later wins for conflicts", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("filters falsy inputs", () => {
    expect(cn("base", undefined, null, false, "extra")).toBe("base extra");
  });
});
