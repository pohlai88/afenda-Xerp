import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const presentationCssPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../app-shell.presentation.css"
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
    expect(css).toContain("width: auto !important");
    expect(css).toContain("UNLAYERED so width beats Tailwind utilities");
  });

  it("sizes sidebar team avatars inside fixed presentation wrappers", () => {
    const css = readFileSync(presentationCssPath, "utf8");

    expect(css).toContain(".app-shell-recipient-avatar > [data-slot=\"avatar\"]");
    expect(css).toContain("flex-shrink: 0");
    expect(css).not.toContain(".app-shell-profile-trigger-avatar");
  });
});
