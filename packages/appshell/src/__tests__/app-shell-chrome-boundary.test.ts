import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const appShellSourcePath = join(import.meta.dirname, "../app-shell.tsx");

const FORBIDDEN_IMPORT_PATTERNS = [
  /from ["']\.\/dashboard/,
  /from ["']\.\/app-shell-dashboard/,
  /ApplicationShellDashboardContent/,
  /ApplicationShellDashboardDemo/,
  /ApplicationShellDashboardCanvas/,
  /dashboard-widget-registry/,
];

describe("ApplicationShell chrome boundary", () => {
  it("does not import dashboard modules or demo content", () => {
    const source = readFileSync(appShellSourcePath, "utf8");

    for (const pattern of FORBIDDEN_IMPORT_PATTERNS) {
      expect(source, pattern.toString()).not.toMatch(pattern);
    }
  });

  it("declares a stable empty workspace main slot", () => {
    const source = readFileSync(appShellSourcePath, "utf8");

    expect(source).toContain('data-app-shell-content=""');
    expect(source).toContain("{children}");
    expect(source).not.toContain("ApplicationShellDashboard");
  });
});
