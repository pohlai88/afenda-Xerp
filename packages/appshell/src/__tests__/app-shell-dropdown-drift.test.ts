import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const presentationCssPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../styles/afenda-appshell.css"
);

describe("app-shell dropdown presentation drift guards", () => {
  it("overrides icon-trigger width on shell dropdown panels", () => {
    const css = readFileSync(presentationCssPath, "utf8");

    expect(css).toContain(
      "[data-slot=\"dropdown-menu-content\"]:has(.app-shell-notification-dropdown)"
    );
    expect(css).toContain(
      "[data-slot=\"dropdown-menu-content\"]:has(.app-shell-profile-dropdown)"
    );
    expect(css).toContain(
      "[data-slot=\"dropdown-menu-content\"]:has(.app-shell-sidebar-user-dropdown)"
    );
    expect(css).toContain(
      "[data-slot=\"dropdown-menu-content\"]:has(.app-shell-context-switcher-dropdown)"
    );
    expect(css).toContain(
      "[data-slot=\"dropdown-menu-content\"]:has(.app-shell-dashboard-invoice-row-actions-menu)"
    );
    expect(css).toContain("width: auto !important");
    expect(css).toContain("UNLAYERED so width beats Tailwind utilities");
  });

  it("widens the activity sheet panel beyond the default sm:max-w-sm cap", () => {
    const css = readFileSync(presentationCssPath, "utf8");

    expect(css).toContain(
      '[data-slot="sheet-content"]:has(.app-shell-activity-panel)'
    );
    expect(css).toContain("max-width: 28rem !important");
    expect(css).toContain(".app-shell-activity-panel");
    expect(css).not.toContain(".app-shell-activity-sheet");
  });

  it("sizes sidebar team avatars inside fixed presentation wrappers", () => {
    const css = readFileSync(presentationCssPath, "utf8");

    expect(css).toContain(".app-shell-recipient-avatar > [data-slot=\"avatar\"]");
    expect(css).toContain("flex-shrink: 0");
    expect(css).not.toContain(".app-shell-profile-trigger-avatar");
  });
});
