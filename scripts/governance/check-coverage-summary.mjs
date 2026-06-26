/**
 * ARCH-TEST-001 Slice 4 — Phase-1 coverage summary gate.
 *
 * Reads Vitest `coverage-summary.json` for tier-1 foundation packages and
 * enforces ratchet floors (2026-06-26 baseline). Target Template B per
 * `.cursor/skills/test-coverage/THRESHOLDS.md` — see waiver notes per package.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

/** @typedef {{ lines: number; statements: number; functions: number; branches: number }} CoverageThresholds */

/** @type {ReadonlyArray<{ packageName: string; summaryRelativePath: string; waiverId?: string; thresholds: CoverageThresholds }>} */
export const PHASE1_COVERAGE_FLOORS = [
  {
    packageName: "@afenda/auth",
    summaryRelativePath: "packages/auth/coverage/coverage-summary.json",
    waiverId: "auth-coverage-phase1-ratchet",
    thresholds: { lines: 73, statements: 73, functions: 83, branches: 78 },
  },
  {
    packageName: "@afenda/permissions",
    summaryRelativePath: "packages/permissions/coverage/coverage-summary.json",
    thresholds: { lines: 85, statements: 85, functions: 90, branches: 79 },
  },
  {
    packageName: "@afenda/observability",
    summaryRelativePath:
      "packages/observability/coverage/coverage-summary.json",
    thresholds: { lines: 90, statements: 90, functions: 90, branches: 80 },
  },
  {
    packageName: "@afenda/database",
    summaryRelativePath: "packages/database/coverage/coverage-summary.json",
    waiverId: "database-coverage-phase1-ratchet",
    thresholds: { lines: 61, statements: 61, functions: 52, branches: 73 },
  },
];

/**
 * @param {unknown} summary
 * @returns {CoverageThresholds | null}
 */
export function readTotalCoveragePct(summary) {
  if (
    typeof summary !== "object" ||
    summary === null ||
    !("total" in summary) ||
    typeof summary.total !== "object" ||
    summary.total === null
  ) {
    return null;
  }

  const total = summary.total;
  const readPct = (key) => {
    const bucket = total[key];
    return typeof bucket === "object" &&
      bucket !== null &&
      typeof bucket.pct === "number"
      ? bucket.pct
      : null;
  };

  const lines = readPct("lines");
  const statements = readPct("statements");
  const functions = readPct("functions");
  const branches = readPct("branches");

  if (
    lines === null ||
    statements === null ||
    functions === null ||
    branches === null
  ) {
    return null;
  }

  return { lines, statements, functions, branches };
}

/**
 * @param {CoverageThresholds} actual
 * @param {CoverageThresholds} floor
 * @returns {string[]}
 */
export function compareCoverageToFloor(actual, floor) {
  /** @type {string[]} */
  const failures = [];

  for (const metric of ["lines", "statements", "functions", "branches"]) {
    if (actual[metric] < floor[metric]) {
      failures.push(
        `${metric}: ${actual[metric].toFixed(2)}% < floor ${floor[metric]}%`
      );
    }
  }

  return failures;
}

/**
 * @param {typeof PHASE1_COVERAGE_FLOORS} floors
 * @param {string} root
 * @returns {{ ok: boolean; messages: string[] }}
 */
export function checkPhase1CoverageSummaries(
  floors = PHASE1_COVERAGE_FLOORS,
  root = repoRoot
) {
  /** @type {string[]} */
  const messages = [];
  let ok = true;

  for (const entry of floors) {
    const summaryPath = join(root, entry.summaryRelativePath);

    if (!existsSync(summaryPath)) {
      ok = false;
      messages.push(
        `${entry.packageName}: missing ${entry.summaryRelativePath} — run pnpm test:coverage:phase1 first`
      );
      continue;
    }

    let parsed;
    try {
      parsed = JSON.parse(readFileSync(summaryPath, "utf8"));
    } catch (error) {
      ok = false;
      messages.push(
        `${entry.packageName}: failed to parse ${entry.summaryRelativePath}: ${error instanceof Error ? error.message : String(error)}`
      );
      continue;
    }

    const actual = readTotalCoveragePct(parsed);
    if (!actual) {
      ok = false;
      messages.push(
        `${entry.packageName}: invalid total coverage shape in ${entry.summaryRelativePath}`
      );
      continue;
    }

    const failures = compareCoverageToFloor(actual, entry.thresholds);
    if (failures.length > 0) {
      ok = false;
      const waiver = entry.waiverId ? ` (waiver: ${entry.waiverId})` : "";
      messages.push(`${entry.packageName}${waiver}: ${failures.join("; ")}`);
    } else {
      messages.push(
        `${entry.packageName}: lines ${actual.lines.toFixed(2)}% · branches ${actual.branches.toFixed(2)}% · functions ${actual.functions.toFixed(2)}% · statements ${actual.statements.toFixed(2)}%`
      );
    }
  }

  return { ok, messages };
}

function main() {
  const { ok, messages } = checkPhase1CoverageSummaries();

  for (const line of messages) {
    console.log(line);
  }

  if (!ok) {
    console.error(
      "\ncheck-coverage-summary: one or more phase-1 packages are below ratchet floors."
    );
    process.exit(1);
  }

  console.log("\ncheck-coverage-summary: phase-1 coverage floors satisfied.");
}

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  main();
}
