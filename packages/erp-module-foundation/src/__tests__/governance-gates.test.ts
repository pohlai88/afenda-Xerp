import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ERP_MODULE_FOUNDATION_SUB_GATES = [
  "check:erp-module-ownership",
  "check:erp-module-knowledge-alignment",
  "check:erp-module-context-spine-consumer",
  "check:erp-module-permission-binding",
  "check:erp-module-audit-outbox",
  "check:erp-module-metadata-binding",
  "check:erp-module-database-boundary",
  "check:erp-module-no-kernel-runtime-leak",
  "check:erp-module-runtime-package-reserved",
  "check:erp-module-readiness",
  "check:erp-module-registry-readiness",
  "check:erp-module-foundation",
] as const;

const repoRoot = fileURLToPath(
  new URL("../../../../", import.meta.url)
).replace(/[/\\]$/, "");

describe("ERP module foundation governance gates", () => {
  it("runs all sub-gates sequentially (single fork — no parallel spawn timeout)", () => {
    for (const gate of ERP_MODULE_FOUNDATION_SUB_GATES) {
      const result = spawnSync("pnpm", [gate], {
        cwd: repoRoot,
        shell: true,
        encoding: "utf8",
      });

      expect(result.status, `${gate}\n${result.stderr || result.stdout}`).toBe(
        0
      );
    }
  }, 120_000);
});
