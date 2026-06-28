import { existsSync } from "node:fs";
import { join } from "node:path";
import { SHADCN_STUDIO_BLOCK_PARITY_REGISTRY } from "@afenda/shadcn-studio";
import { describe, expect, it } from "vitest";

import { PRESENTATION_MCP_WRAPPER_REGISTRY } from "../presentation/wrappers/presentation-mcp-wrapper.registry";

const REPO_ROOT = join(import.meta.dirname, "../../../..");

const B42O_ACCOUNT_SETTINGS_SHELL_WRAPPER_PATHS = [
  "packages/appshell/src/presentation/wrappers/account-settings/shell/app-shell-account-settings-01.wrapper.tsx",
  "packages/appshell/src/presentation/wrappers/account-settings/shell/app-shell-account-settings-02.wrapper.tsx",
  "packages/appshell/src/presentation/wrappers/account-settings/shell/app-shell-account-settings-03.wrapper.tsx",
  "packages/appshell/src/presentation/wrappers/account-settings/shell/app-shell-account-settings-04.wrapper.tsx",
  "packages/appshell/src/presentation/wrappers/account-settings/shell/app-shell-account-settings-05.wrapper.tsx",
  "packages/appshell/src/presentation/wrappers/account-settings/shell/app-shell-account-settings-06.wrapper.tsx",
  "packages/appshell/src/presentation/wrappers/account-settings/shell/app-shell-account-settings-07.wrapper.tsx",
] as const;

const B42O_SHELL_WRAPPER_PATHS = [
  "packages/appshell/src/presentation/wrappers/shell/application-shell-02.wrapper.tsx",
  "packages/appshell/src/presentation/wrappers/shell/activity-feed.wrapper.tsx",
  "packages/appshell/src/presentation/wrappers/shell/context-switcher.wrapper.tsx",
  "packages/appshell/src/presentation/wrappers/shell/module-workspace-chrome.wrapper.tsx",
] as const;

const B42O_UTILITY_WRAPPER_PATHS = [
  "packages/appshell/src/presentation/wrappers/dashboard/breakdown-utils.wrapper.ts",
  "packages/appshell/src/presentation/wrappers/dashboard/invoice-table-columns.wrapper.ts",
  "packages/appshell/src/presentation/wrappers/dashboard/invoice-table-overflow-menu.wrapper.tsx",
] as const;

describe("presentation MCP wrapper registry (B42o)", () => {
  it("maps all seven account-settings shell entries to on-disk wrapper files", () => {
    for (const relativePath of B42O_ACCOUNT_SETTINGS_SHELL_WRAPPER_PATHS) {
      expect(existsSync(join(REPO_ROOT, relativePath))).toBe(true);
    }

    for (let index = 1; index <= 7; index += 1) {
      const entry = PRESENTATION_MCP_WRAPPER_REGISTRY.find(
        (row) => row.publicExportName === `AppShellAccountSettings0${index}`
      );
      expect(entry?.status).toBe("afenda-only");
      expect(entry?.wrapperPath).toBe(
        `packages/appshell/src/presentation/wrappers/account-settings/shell/app-shell-account-settings-0${index}.wrapper.tsx`
      );
      expect(entry?.wrapperPath).not.toContain("../blocks/");
    }
  });

  it("maps context switcher and module workspace chrome to shell wrappers", () => {
    const contextSwitcher = PRESENTATION_MCP_WRAPPER_REGISTRY.find(
      (entry) => entry.publicExportName === "AppShellContextSwitcher"
    );
    const moduleChrome = PRESENTATION_MCP_WRAPPER_REGISTRY.find(
      (entry) => entry.publicExportName === "AppShellModuleWorkspaceChrome"
    );

    expect(contextSwitcher?.wrapperPath).toBe(
      "packages/appshell/src/presentation/wrappers/shell/context-switcher.wrapper.tsx"
    );
    expect(moduleChrome?.wrapperPath).toBe(
      "packages/appshell/src/presentation/wrappers/shell/module-workspace-chrome.wrapper.tsx"
    );
  });

  it("closes parity wrapperPath gaps for B42o residual rows", () => {
    for (const relativePath of [
      ...B42O_SHELL_WRAPPER_PATHS,
      ...B42O_UTILITY_WRAPPER_PATHS,
    ]) {
      expect(existsSync(join(REPO_ROOT, relativePath))).toBe(true);
    }

    const missingWrapperPathCount = SHADCN_STUDIO_BLOCK_PARITY_REGISTRY.filter(
      (entry) => entry.wrapperPath === undefined
    ).length;

    expect(missingWrapperPathCount).toBe(0);
  });
});
