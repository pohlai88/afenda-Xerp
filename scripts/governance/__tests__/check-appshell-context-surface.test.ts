import { describe, expect, it } from "vitest";

import { checkAppshellContextSurface } from "../check-appshell-context-surface.mts";

describe("check-appshell-context-surface script", () => {
  it("passes on the current repository state", () => {
    expect(checkAppshellContextSurface()).toEqual([]);
  });
});
