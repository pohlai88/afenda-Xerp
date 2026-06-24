import { describe, expect, it } from "vitest";

import {
  APPLICATION_SHELL_ROOT_GOVERNED_COMPONENT_NAMES,
  APPSHELL_CHROME_REGIONS,
  APPSHELL_MAIN_GOVERNED_COMPONENT_NAMES,
  APPSHELL_MAIN_SLOTS,
  APPSHELL_SIDEBAR_SLOTS,
  isAppShellChromeRegion,
} from "../appshell-authority.contract.js";
import * as contractExports from "../index.js";

describe("appshell-authority.contract", () => {
  it("exports frozen chrome region unions without duplicates", () => {
    expect(APPSHELL_CHROME_REGIONS).toEqual([
      "sidebar",
      "header",
      "main",
      "footer",
    ]);
    expect(new Set(APPSHELL_CHROME_REGIONS).size).toBe(
      APPSHELL_CHROME_REGIONS.length
    );
  });

  it("exports sidebar and main slot registries", () => {
    expect(APPSHELL_SIDEBAR_SLOTS).toEqual([
      "brand",
      "primary-navigation",
      "team-recipients",
      "user-profile",
    ]);
    expect(APPSHELL_MAIN_SLOTS).toEqual([
      "page-title",
      "page-actions",
      "page-content",
    ]);
  });

  it("registers governed primitive names for root and main chrome", () => {
    expect(APPLICATION_SHELL_ROOT_GOVERNED_COMPONENT_NAMES).toEqual([
      "Avatar",
      "Badge",
      "Button",
      "Collapsible",
      "Sidebar",
    ]);
    expect(APPSHELL_MAIN_GOVERNED_COMPONENT_NAMES).toEqual(["Badge", "Button"]);
  });

  it("narrows chrome regions via type guard", () => {
    expect(isAppShellChromeRegion("header")).toBe(true);
    expect(isAppShellChromeRegion("unknown-region")).toBe(false);
  });

  it("re-exports authority symbols from contracts barrel", () => {
    expect(contractExports.APPSHELL_CHROME_REGIONS).toBe(
      APPSHELL_CHROME_REGIONS
    );
    expect(contractExports.isAppShellChromeRegion).toBe(isAppShellChromeRegion);
    expect(
      contractExports.APPLICATION_SHELL_ROOT_GOVERNED_COMPONENT_NAMES
    ).toBe(APPLICATION_SHELL_ROOT_GOVERNED_COMPONENT_NAMES);
  });
});
