#!/usr/bin/env node
/**
 * Temporary dev entrypoint — routes `pnpm dev` through Turbo so
 * apps/erp/turbo.json `dependsOn: ["^build"]` runs before Next.js.
 */
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const banner = `
┌─────────────────────────────────────────────────────────────────────────────┐
│  Afenda dev → turbo run dev --filter=@afenda/erp                            │
│                                                                             │
│  Turbo builds workspace dependencies (^build) before starting Next.js.      │
│  Do not use: pnpm --filter @afenda/erp dev                                  │
│  All apps:   pnpm dev:all                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
`;

console.error(banner);

const result = spawnSync(
  "pnpm",
  ["exec", "turbo", "run", "dev", "--filter=@afenda/erp"],
  { cwd: root, stdio: "inherit", shell: true }
);

process.exit(result.status ?? 1);
