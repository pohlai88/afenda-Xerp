import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const DOCS_SLICES_ROOT = path.join(PACKAGE_ROOT, "docs", "slices");

const LAB_SHELL_PATH = path.join(
  REPO_ROOT,
  "apps/developer/src/app/(lab)/_components/lab-shell.client.tsx"
);
const NAV_CONFIG_PATH = path.join(
  REPO_ROOT,
  "apps/developer/src/config/nav-config.ts"
);
const PRESENTATION_RUNTIME_CHECK_PATH = path.join(
  REPO_ROOT,
  "apps/developer/scripts/check-developer-presentation-runtime.mjs"
);
const B04_SLICE_PATH = path.join(
  DOCS_SLICES_ROOT,
  "LANE-B-04-DEVELOPER-LAB-SHELL-CUTOVER.md"
);

const FORBIDDEN_V1_LAB_SHELL_IMPORT =
  /from\s+["']@afenda\/shadcn-studio(?:\/(?!v2)|["'])/u;

describe("Lane B-04 developer lab shell cutover", () => {
  it("uses AppShell01 from v2 clients without v1 shell or theme providers", () => {
    const labShell = readFileSync(LAB_SHELL_PATH, "utf8");

    expect(labShell).toContain("AppShell01");
    expect(labShell).toContain("@afenda/shadcn-studio-v2/clients");
    expect(labShell).not.toMatch(FORBIDDEN_V1_LAB_SHELL_IMPORT);
    expect(labShell).not.toContain("AdmincnShell");
    expect(labShell).not.toContain("SettingsProvider");
  });

  it("sources shell nav wire types from v2 clients", () => {
    const navConfig = readFileSync(NAV_CONFIG_PATH, "utf8");

    expect(navConfig).toContain("@afenda/shadcn-studio-v2/clients");
    expect(navConfig).not.toMatch(FORBIDDEN_V1_LAB_SHELL_IMPORT);
  });

  it("enforces v2 lab shell wiring in developer presentation runtime check", () => {
    const check = readFileSync(PRESENTATION_RUNTIME_CHECK_PATH, "utf8");

    expect(check).toContain("AppShell01");
    expect(check).toContain("@afenda/shadcn-studio-v2/clients");
    expect(check).not.toContain("SettingsProvider");
    expect(check).not.toContain("AdmincnShell");
  });

  it("records B-04 slice completion", () => {
    const slice = readFileSync(B04_SLICE_PATH, "utf8");

    expect(slice).toContain("Status: **Complete**");
    expect(slice).toContain("AppShell01");
  });
});
