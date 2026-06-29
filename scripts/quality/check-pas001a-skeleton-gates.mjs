/**
 * PAS-001A §6.1 skeleton integration spine gate bundle.
 *
 * Sequentially runs the R1d attestation gates in fail-fast order.
 * Registered as `pnpm quality:pas001a-skeleton-gates` and enforced in CI.
 */

import { spawnSync } from "node:child_process";

const gates = [
  "check:permission-scope-permissions-surface",
  "quality:kernel-context-surface",
  "check:erp-operating-context-spine",
  "check:kernel-effective-dating-consumer-attestation",
  "check:erp-auth-actor-protected-path-attestation",
  "check:erp-service-actor-s2s-attestation",
  "check:erp-metadata-pas006-consumer",
  "check:erp-tenant-lifecycle-extension-consumer-attestation",
  "quality:boundaries",
  "check:documentation-drift",
];

console.log(`PAS-001A §6.1 skeleton gates — ${gates.length} checks\n`);

for (const gate of gates) {
  console.log(`▶ pnpm ${gate}`);
  const result = spawnSync("pnpm", [gate], {
    shell: process.platform === "win32",
    stdio: "inherit",
  });

  if (result.status !== 0) {
    console.error(`\nPAS-001A skeleton gate failed: pnpm ${gate}`);
    process.exit(result.status ?? 1);
  }

  console.log(`✓ pnpm ${gate}\n`);
}

console.log(
  `PAS-001A §6.1 skeleton gates — ${gates.length}/${gates.length} passed`
);
