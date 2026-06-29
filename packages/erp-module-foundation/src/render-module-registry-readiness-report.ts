import { collectErpRuntimeModuleRegistryFindings } from "./assert-module-registry-readiness.js";
import type { ErpRuntimeModuleRegistryBundle } from "./erp-module-foundation.types.js";

export interface ModuleRegistryReadinessReportRow {
  readonly code: string;
  readonly dimension: string;
  readonly message: string;
  readonly severity: "error" | "warning";
}

export function buildModuleRegistryReadinessReportRows(
  input: ErpRuntimeModuleRegistryBundle
): readonly ModuleRegistryReadinessReportRow[] {
  return collectErpRuntimeModuleRegistryFindings(input).map((finding) => ({
    dimension: finding.dimension,
    severity: finding.severity,
    code: finding.code,
    message: finding.message,
  }));
}

export function renderModuleRegistryReadinessReport(
  input: ErpRuntimeModuleRegistryBundle,
  title = "ERP Runtime Module Registry Readiness"
): string {
  const findings = collectErpRuntimeModuleRegistryFindings(input);
  const moduleCount = input.registry.modules.length;
  const bundleCount = input.bundles.length;

  const lines = [
    `# ${title}`,
    "",
    `Modules: ${moduleCount} · Bundles: ${bundleCount}`,
    "",
  ];

  if (findings.length === 0) {
    lines.push("All registry readiness checks passed.");
    return lines.join("\n");
  }

  lines.push(
    "| Dimension | Severity | Code | Message |",
    "| --- | --- | --- | --- |"
  );

  for (const finding of findings) {
    lines.push(
      `| ${finding.dimension} | ${finding.severity} | ${finding.code} | ${finding.message} |`
    );
  }

  return lines.join("\n");
}
