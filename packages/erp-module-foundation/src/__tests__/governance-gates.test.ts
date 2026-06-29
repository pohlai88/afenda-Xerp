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
  "check:erp-module-readiness",
  "check:erp-module-registry-readiness",
  "check:erp-module-foundation",
] as const;

const repoRoot = fileURLToPath(
  new URL("../../../../", import.meta.url)
).replace(/[/\\]$/, "");

describe("ERP module foundation governance gates", () => {
  for (const gate of ERP_MODULE_FOUNDATION_SUB_GATES) {
    it(`${gate} exits 0`, () => {
      const result = spawnSync("pnpm", [gate], {
        cwd: repoRoot,
        shell: true,
        encoding: "utf8",
      });

      expect(result.status, result.stderr || result.stdout).toBe(0);
    }, 30_000);
  }
});
