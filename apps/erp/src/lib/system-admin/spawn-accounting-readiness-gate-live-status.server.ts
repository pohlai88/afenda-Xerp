import { spawnSync } from "node:child_process";

import type { AccountingReadinessGateLiveSnapshot } from "./accounting-readiness-gate-live-status.contract.js";

import { resolveMonorepoRoot } from "./resolve-monorepo-root.server";

const LIVE_STATUS_SCRIPT =
  "scripts/governance/check-accounting-readiness-gate.mts" as const;

function isAccountingReadinessGateLiveSnapshot(
  value: unknown
): value is AccountingReadinessGateLiveSnapshot {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<AccountingReadinessGateLiveSnapshot>;
  return (
    typeof candidate.checkedAt === "string" &&
    (candidate.runMode === "structure-only" || candidate.runMode === "full") &&
    (candidate.overallKind === "pass" || candidate.overallKind === "fail") &&
    Array.isArray(candidate.requirements)
  );
}

export function spawnAccountingReadinessGateLiveStatus(input: {
  readonly runDelegatedGates: boolean;
}): AccountingReadinessGateLiveSnapshot {
  const repoRoot = resolveMonorepoRoot();
  const args = [
    "exec",
    "tsx",
    LIVE_STATUS_SCRIPT,
    "--json-status",
    ...(input.runDelegatedGates ? [] : ["--structure-only"]),
  ];

  const result = spawnSync("pnpm", args, {
    cwd: repoRoot,
    encoding: "utf8",
    timeout: input.runDelegatedGates ? 900_000 : 120_000,
    maxBuffer: 10 * 1024 * 1024,
  });

  const stdout = result.stdout?.trim();
  if (!stdout) {
    throw new Error(
      [
        "Accounting readiness live status returned no JSON output.",
        result.stderr?.trim(),
      ]
        .filter(Boolean)
        .join("\n")
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stdout);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Invalid JSON from live status";
    throw new Error(
      `Accounting readiness live status parse failed: ${message}`
    );
  }

  if (!isAccountingReadinessGateLiveSnapshot(parsed)) {
    throw new Error(
      "Accounting readiness live status JSON did not match the kernel snapshot contract."
    );
  }

  return parsed;
}
