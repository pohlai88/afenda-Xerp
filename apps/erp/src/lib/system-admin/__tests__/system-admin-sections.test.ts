import { describe, expect, it } from "vitest";

import { SYSTEM_ADMIN_SECTIONS } from "../system-admin-sections";

describe("system-admin-sections", () => {
  it("exports the governed admin navigation catalog", () => {
    expect(SYSTEM_ADMIN_SECTIONS.map((section) => section.sectionId)).toEqual([
      "users",
      "memberships",
      "roles",
      "permissions",
      "audit",
      "settings",
      "diagnostics",
    ]);
  });
});
