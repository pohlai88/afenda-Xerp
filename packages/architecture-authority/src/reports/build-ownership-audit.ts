import { ownershipContract } from "../data/ownership-registry.data.js";

export function buildOwnershipAuditMarkdown(): string {
  const lines = [
    "# Ownership Audit",
    "",
    "| Package | Owner | API | Dependency | Deprecation | Exception |",
    "|---------|-------|-----|------------|-------------|-----------|",
  ];

  for (const row of ownershipContract.auditRows) {
    const owner =
      ownershipContract.packages.find(
        (entry) => entry.packageName === row.packageName
      )?.ownerDomain ?? "—";
    lines.push(
      `| ${row.packageName} | ${owner} | ${row.apiApprover} | ${row.dependencyApprover} | ${row.deprecationApprover} | ${row.exceptionApprover} |`
    );
  }

  lines.push("");
  return lines.join("\n");
}
