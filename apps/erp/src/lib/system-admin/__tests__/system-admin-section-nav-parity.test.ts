import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { SYSTEM_ADMIN_SECTIONS } from "../system-admin-sections";

const appRoot = join(import.meta.dirname, "../../../..");

describe("system-admin section nav runtime parity", () => {
  it("materializes every registered section as a protected page route", () => {
    expect(SYSTEM_ADMIN_SECTIONS.map((section) => section.sectionId)).toEqual([
      "users",
      "memberships",
      "roles",
      "permissions",
      "audit",
      "settings",
      "diagnostics",
    ]);

    for (const section of SYSTEM_ADMIN_SECTIONS) {
      const pagePath = join(
        appRoot,
        "src/app/(protected)",
        section.href.slice(1),
        "page.tsx"
      );

      expect(existsSync(pagePath), `${section.sectionId} → ${pagePath}`).toBe(
        true
      );
    }
  });
});
