#!/usr/bin/env node
/**
 * ERP dev guard — redirect to Turbo when invoked outside the task graph.
 * When Turbo runs @afenda/erp#dev, TURBO_HASH is set and Next.js starts directly.
 */
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const erpRoot = resolve(repoRoot, "apps/erp");

if (!process.env.TURBO_HASH) {
  const banner = `
┌─────────────────────────────────────────────────────────────────────────────┐
│  Redirecting to Turbo dev (dependency builds required)                      │
│                                                                             │
│  From repo root:  pnpm dev                                                  │
│  Direct Turbo:    turbo run dev --filter=@afenda/erp                        │
└─────────────────────────────────────────────────────────────────────────────┘
`;
  console.error(banner);

  const result = spawnSync(
    "pnpm",
    ["exec", "turbo", "run", "dev", "--filter=@afenda/erp"],
    { cwd: repoRoot, stdio: "inherit", shell: true }
  );
  process.exit(result.status ?? 1);
}

const result = spawnSync("next", ["dev", "--port", "3000"], {
  cwd: erpRoot,
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
