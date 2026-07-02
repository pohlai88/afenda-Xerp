/**
 * Shared report formatter for primitive evidence gates.
 */

/** @typedef {"BLOCKER" | "WARN" | "INFO"} GateSeverity */

/**
 * @param {{
 *   primitive: string;
 *   tier?: string;
 *   story?: string;
 *   file?: string;
 *   severity?: GateSeverity;
 *   mismatch: string;
 *   expected: string;
 *   actual: string;
 *   requiredFix: string;
 *   autofixPossible?: boolean;
 *   gateResult: "PASS" | "FAIL" | "WARN";
 * }} row
 */
export function formatEvidenceReportRow(row) {
  return [
    `Primitive: ${row.primitive}`,
    `Tier: ${row.tier ?? "—"}`,
    `Story: ${row.story ?? "—"}`,
    `File: ${row.file ?? "—"}`,
    `Severity: ${row.severity ?? (row.gateResult === "WARN" ? "WARN" : "BLOCKER")}`,
    `Mismatch: ${row.mismatch}`,
    `Expected: ${row.expected}`,
    `Actual: ${row.actual}`,
    `Required fix: ${row.requiredFix}`,
    `Autofix possible: ${row.autofixPossible ? "yes" : "no"}`,
    `Gate result: ${row.gateResult}`,
  ].join("\n");
}

/**
 * @param {ReturnType<typeof formatEvidenceReportRow>[]} rows
 * @param {string} gateName
 */
export function printEvidenceGateSummary(rows, gateName) {
  const failures = rows.filter((r) => r.includes("Gate result: FAIL"));
  const warnings = rows.filter((r) => r.includes("Gate result: WARN"));

  if (failures.length === 0 && warnings.length === 0) {
    console.log(`${gateName}: OK`);
    return 0;
  }

  const summaryLabel = failures.length > 0 ? "FAIL" : "WARN";
  console.error(
    `${gateName}: ${summaryLabel} (${failures.length} blocker(s), ${warnings.length} warn(s))`
  );
  for (const row of [...failures, ...warnings]) {
    console.error(`\n---\n${row}\n---`);
  }

  return failures.length > 0 ? 1 : 0;
}
