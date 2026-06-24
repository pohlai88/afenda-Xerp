import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const presentationCssPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../styles/afenda-appshell.css"
);

/** Collapse all whitespace so :has() selectors stay stable under Biome wrap. */
function normalizeCssForAssertion(source: string): string {
  return source.replace(/\s+/g, "");
}

function expectCssContains(source: string, fragment: string): void {
  expect(normalizeCssForAssertion(source)).toContain(
    normalizeCssForAssertion(fragment)
  );
}

describe("app-shell dropdown presentation drift guards", () => {
  it("overrides icon-trigger width on shell dropdown panels", () => {
    const css = readFileSync(presentationCssPath, "utf8");

    expectCssContains(
      css,
      '[data-slot="dropdown-menu-content"]:has(.app-shell-notification-dropdown)'
    );
    expectCssContains(
      css,
      '[data-slot="dropdown-menu-content"]:has(.app-shell-profile-dropdown)'
    );
    expectCssContains(
      css,
      '[data-slot="dropdown-menu-content"]:has(.app-shell-sidebar-user-dropdown)'
    );
    expectCssContains(
      css,
      '[data-slot="dropdown-menu-content"]:has(.app-shell-context-switcher-dropdown)'
    );
    expectCssContains(
      css,
      '[data-slot="dropdown-menu-content"]:has(.app-shell-studio-invoice-row-actions-menu)'
    );
    expect(css).toContain("width: auto !important");
    expect(css).toContain("UNLAYERED so width beats Tailwind utilities");
  });

  it("widens the activity sheet panel beyond the default sm:max-w-sm cap", () => {
    const css = readFileSync(presentationCssPath, "utf8");

    expect(css).toContain(
      '[data-slot="sheet-content"]:has(.app-shell-studio-activity-panel)'
    );
    expect(css).toContain("max-width: 28rem !important");
    expect(css).toContain(".app-shell-studio-activity-panel");
    expect(css).not.toContain(".app-shell-studio-activity-sheet");
  });

  it("sizes sidebar team avatars inside fixed presentation wrappers", () => {
    const css = readFileSync(presentationCssPath, "utf8");

    expect(css).toContain('.app-shell-recipient-avatar > [data-slot="avatar"]');
    expect(css).toContain("flex-shrink: 0");
    expect(css).not.toContain(".app-shell-profile-trigger-avatar");
  });
});
