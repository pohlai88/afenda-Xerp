import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const DOCS_SLICES_ROOT = path.join(PACKAGE_ROOT, "docs", "slices");

const PROTECTED_SHELL_PATH = path.join(
  REPO_ROOT,
  "apps/erp/src/components/presentation/app-protected-shell.client.tsx"
);
const NAV_RESOLVE_PATH = path.join(
  REPO_ROOT,
  "apps/erp/src/lib/navigation/resolve-shell-nav.server.ts"
);
const CONTEXT_WIRE_PATH = path.join(
  REPO_ROOT,
  "apps/erp/src/lib/context/to-shell-operating-context-wire.ts"
);
const B06_SLICE_PATH = path.join(
  DOCS_SLICES_ROOT,
  "LANE-B-06-ERP-APP-SHELL-NAV-CUTOVER.md"
);

const FORBIDDEN_V1_SHELL_IMPORT =
  /from\s+["']@afenda\/shadcn-studio(?:\/(?!v2)|["'])/u;

describe("Lane B-06 ERP app shell and nav cutover", () => {
  it("uses AppShell01 from v2 clients in the protected shell", () => {
    const shell = readFileSync(PROTECTED_SHELL_PATH, "utf8");

    expect(shell).toContain("AppShell01");
    expect(shell).toContain("@afenda/shadcn-studio-v2/clients");
    expect(shell).not.toMatch(FORBIDDEN_V1_SHELL_IMPORT);
    expect(shell).not.toContain("resolveShell");
  });

  it("resolves shell nav and operating context wires from v2 clients", () => {
    const nav = readFileSync(NAV_RESOLVE_PATH, "utf8");
    const contextWire = readFileSync(CONTEXT_WIRE_PATH, "utf8");

    expect(nav).toContain("@afenda/shadcn-studio-v2/clients");
    expect(nav).not.toMatch(FORBIDDEN_V1_SHELL_IMPORT);
    expect(contextWire).toContain("@afenda/shadcn-studio-v2/clients");
    expect(contextWire).not.toMatch(FORBIDDEN_V1_SHELL_IMPORT);
  });

  it("records B-06 slice completion", () => {
    const slice = readFileSync(B06_SLICE_PATH, "utf8");

    expect(slice).toContain("Status: **Complete**");
    expect(slice).toContain("AppShell01");
  });
});
