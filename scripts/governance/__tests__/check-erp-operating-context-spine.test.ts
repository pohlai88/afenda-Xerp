import { describe, expect, it } from "vitest";

import { checkErpOperatingContextSpine } from "../check-erp-operating-context-spine.mts";

describe("check-erp-operating-context-spine script", () => {
  it("passes on the current repository state", () => {
    expect(checkErpOperatingContextSpine()).toEqual([]);
  });
});
