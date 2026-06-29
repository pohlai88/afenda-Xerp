import { collectModuleReadinessFindings } from "./assert-module-readiness.js";
import type {
  ErpModuleFoundationBundle,
  ModuleReadinessReportRow,
  ReadinessDimension,
  ReadinessLevel,
} from "./erp-module-foundation.types.js";
import { READINESS_DIMENSIONS } from "./erp-module-foundation.types.js";
import type { ModuleReadinessFinding } from "./internal/findings.js";

const DIMENSION_GATE_MAP: Readonly<Record<ReadinessDimension, string>> = {
  authority: "pnpm check:erp-module-foundation",
  registry: "pnpm check:erp-module-readiness",
  knowledge: "pnpm check:erp-module-knowledge-alignment",
  ownership: "pnpm check:erp-module-ownership",
  database: "pnpm check:erp-module-database-boundary",
  contextSpine: "pnpm check:erp-module-context-spine-consumer",
  permissions: "pnpm check:erp-module-permission-binding",
  audit: "pnpm check:erp-module-audit-outbox",
  outbox: "pnpm check:erp-module-audit-outbox",
  metadata: "pnpm check:erp-module-metadata-binding",
  ui: "pnpm check:erp-module-metadata-binding",
  operations: "pnpm check:erp-module-readiness",
  tests: "pnpm check:erp-module-foundation",
  gates: "pnpm check:erp-module-foundation",
};

function findingsForDimension(
  findings: readonly ModuleReadinessFinding[],
  dimension: ReadinessDimension
): readonly ModuleReadinessFinding[] {
  return findings.filter((finding) => finding.dimension === dimension);
}

function verdictForDimension(
  bundle: ErpModuleFoundationBundle,
  dimension: ReadinessDimension,
  dimensionFindings: readonly ModuleReadinessFinding[]
): ModuleReadinessReportRow["verdict"] {
  const level = bundle.readiness.matrix[dimension];
  if (level === "deferred" || level === "not_applicable") {
    return "Deferred";
  }
  const errors = dimensionFindings.filter((f) => f.severity === "error");
  if (level === "required" && errors.length > 0) {
    return "Fail";
  }
  if (level === "required") {
    const evidence = bundle.evidence?.[dimension];
    return evidence && evidence.trim().length > 0 ? "Pass" : "Fail";
  }
  return "Deferred";
}

function missingMessageForDimension(
  level: ReadinessLevel,
  evidence: string,
  errorMessages: readonly string[]
): string {
  if (errorMessages.length > 0) {
    return errorMessages.join("; ");
  }

  if (level === "required" && !evidence) {
    return "evidence path missing";
  }

  return "";
}

export function buildModuleReadinessReportRows(
  bundle: ErpModuleFoundationBundle
): readonly ModuleReadinessReportRow[] {
  const findings = collectModuleReadinessFindings(bundle);

  return READINESS_DIMENSIONS.map((dimension) => {
    const level = bundle.readiness.matrix[dimension];
    const evidence = bundle.evidence?.[dimension] ?? "";
    const dimensionFindings = findingsForDimension(findings, dimension);
    const errorMessages = dimensionFindings
      .filter((f) => f.severity === "error")
      .map((f) => f.message);
    const missing = missingMessageForDimension(level, evidence, errorMessages);

    return {
      dimension,
      verdict: verdictForDimension(bundle, dimension, dimensionFindings),
      evidence,
      missing,
      gate: DIMENSION_GATE_MAP[dimension],
    } as const;
  });
}

export function renderModuleReadinessReport(
  bundle: ErpModuleFoundationBundle,
  moduleTitle?: string
): string {
  const title =
    moduleTitle ??
    `${bundle.module.slug.charAt(0).toUpperCase()}${bundle.module.slug.slice(1)}`;
  const rows = buildModuleReadinessReportRows(bundle);

  const lines = [
    `# ${title} Runtime Readiness Report`,
    "",
    "| Dimension | Verdict | Evidence | Missing | Gate |",
    "| --- | --- | --- | --- | --- |",
  ];

  for (const row of rows) {
    lines.push(
      `| ${row.dimension} | ${row.verdict} | ${row.evidence || "—"} | ${row.missing || "—"} | ${row.gate} |`
    );
  }

  return lines.join("\n");
}
