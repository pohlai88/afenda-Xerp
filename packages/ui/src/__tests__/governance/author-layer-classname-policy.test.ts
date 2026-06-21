import { describe, expect, it } from "vitest";

import { validateLayoutClassName } from "../../governance/class-name";

/**
 * Author-layer TIP-004 audit: semantic recipe classes must never be passed as
 * `className` into governed sub-primitives (DialogHeader, InputGroup, Button, …).
 * Apply via plain DOM wrappers + applyGovernedPresentation, descendant selectors,
 * or mergeGovernedPresentation on Radix/content shells.
 */
describe("author-layer className policy audit", () => {
  const violations = {
    "command.dialog-header-sr": "sr-only",
    "command.dialog-content":
      "top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0",
    "combobox.input-group-button":
      "group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent",
    "sidebar.mobile-header": "sr-only",
    "sidebar.mobile-content":
      "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&_[data-slot=sheet-close-button]]:hidden",
    "dialog.close-button": "absolute top-2 right-2",
    "dialog.close-label": "sr-only",
    "sheet.close-button": "absolute top-3 right-3",
  } as const;

  it("documents semantic slot classes that fail layout-only className policy", () => {
    for (const [name, className] of Object.entries(violations)) {
      const result = validateLayoutClassName(className);
      expect(result.valid, `${name} should fail layout-only policy`).toBe(false);
    }
  });

  it("allows layout-only shell width for combobox input groups", () => {
    expect(validateLayoutClassName("w-auto").valid).toBe(true);
  });
});
