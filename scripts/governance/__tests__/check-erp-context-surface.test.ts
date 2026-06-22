import { describe, expect, it } from "vitest";

import { checkErpContextSurface } from "../check-erp-context-surface.mts";

describe("check-erp-context-surface script", () => {
  it("passes on the current repository state", () => {
    expect(checkErpContextSurface()).toEqual([]);
  });
});
