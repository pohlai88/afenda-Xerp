import { describe, expect, it } from "vitest";

import {
  toNavGroupId,
  toNavItemId,
} from "@/lib/presentation/app-shell-nav-wire";

describe("app-shell-nav-wire", () => {
  it("derives stable nav group ids from labels", () => {
    expect(toNavGroupId("System Admin")).toBe("system-admin");
    expect(toNavGroupId("Platform")).toBe("platform");
  });

  it("derives stable nav item ids from href paths", () => {
    expect(toNavItemId("/workspace")).toBe("workspace");
    expect(toNavItemId("/modules/procurement/requisitions")).toBe(
      "modules.procurement.requisitions"
    );
    expect(toNavItemId("/")).toBe("root");
  });
});
