import type { DiscoveredWorkspace } from "@afenda/architecture-authority";
import type {
  AiChangeScopeManifest,
  AiGovernanceMode,
  AiViolation,
  ChangedLine,
  PackageExportMap,
} from "../contracts/ai-change.contract.js";
import { validateArchitecture } from "@afenda/architecture-authority";

export interface AiGovernanceContext {
  readonly mode: AiGovernanceMode;
  readonly workspaces: readonly DiscoveredWorkspace[];
  readonly changedFiles: readonly string[];
  readonly deletedFiles: readonly string[];
  readonly addedFiles: readonly string[];
  readonly changedLines: readonly ChangedLine[];
  readonly scopeManifest: AiChangeScopeManifest | null;
  readonly packageExports: readonly PackageExportMap[];
  readonly sourceFilesByPath: ReadonlyMap<string, string>;
}

function mapArchitectureViolations(
  architectureResult: ReturnType<typeof validateArchitecture>
): AiViolation[] {
  const violations: AiViolation[] = [];

  for (const violation of architectureResult.violations) {
    if (violation.gate === "registry") {
      violations.push({
        invariant: "AI-001",
        gate: "registry",
        message: violation.message,
        ...(violation.packageName ? { path: violation.packageName } : {}),
      });
      continue;
    }

    if (
      violation.gate === "dependencies" ||
      violation.gate === "forbidden-dependencies"
    ) {
      violations.push({
        invariant: "AI-002",
        gate: "dependencies",
        message: violation.message,
        ...(violation.packageName ? { path: violation.packageName } : {}),
      });
    }
  }

  return violations;
}

export function validateArchitectureDelegation(
  context: AiGovernanceContext
): AiViolation[] {
  const architectureResult = validateArchitecture(context.workspaces);
  return mapArchitectureViolations(architectureResult);
}

export function validateContractPreservation(
  context: AiGovernanceContext
): AiViolation[] {
  if (context.mode !== "scope" || !context.scopeManifest) {
    return [];
  }

  const violations: AiViolation[] = [];
  const adr = context.scopeManifest.adr;

  for (const path of context.changedFiles) {
    if (!path.endsWith(".contract.ts")) {
      continue;
    }

    if (!adr.trim()) {
      violations.push({
        invariant: "AI-007",
        gate: "change",
        message: "contract file changed without ADR reference in scope manifest",
        path,
      });
    }
  }

  return violations;
}

export function validateTestCoverage(context: AiGovernanceContext): AiViolation[] {
  if (context.mode !== "scope" || !context.scopeManifest) {
    return [];
  }

  const violations: AiViolation[] = [];
  const exemptions = new Set(
    context.scopeManifest.testExemptions.map((entry) => entry.path)
  );

  if (context.scopeManifest.testPlan.length === 0) {
    violations.push({
      invariant: "AI-008",
      gate: "change",
      message: "scope manifest testPlan must not be empty",
    });
  }

  for (const path of context.addedFiles) {
    if (!path.includes("/src/") || path.endsWith(".contract.ts")) {
      continue;
    }

    if (path.includes("/tests/") || path.includes("/__tests__/")) {
      continue;
    }

    if (!path.endsWith(".ts") && !path.endsWith(".tsx")) {
      continue;
    }

    const testCandidates = [
      path.replace(/\/src\//u, "/src/__tests__/").replace(/\.tsx?$/u, ".test.ts"),
      path.replace(/\/src\//u, "/src/tests/").replace(/\.tsx?$/u, ".test.ts"),
    ];

    const hasTest = testCandidates.some((candidate) =>
      context.changedFiles.includes(candidate)
    );

    if (!hasTest && !exemptions.has(path)) {
      violations.push({
        invariant: "AI-008",
        gate: "change",
        message: "new source file requires test coverage or testExemptions entry",
        path,
      });
    }
  }

  return violations;
}

export function validateDeletions(context: AiGovernanceContext): AiViolation[] {
  if (context.mode !== "scope" || !context.scopeManifest) {
    return [];
  }

  const violations: AiViolation[] = [];
  const justified = new Set(
    context.scopeManifest.deletionJustifications.map((entry) => entry.path)
  );

  for (const path of context.deletedFiles) {
    if (!justified.has(path)) {
      violations.push({
        invariant: "AI-009",
        gate: "change",
        message: "deleted file requires deletionJustifications entry",
        path,
      });
    }
  }

  return violations;
}

export function validateAiChangeGates(context: AiGovernanceContext): AiViolation[] {
  return [
    ...validateArchitectureDelegation(context),
    ...validateContractPreservation(context),
    ...validateTestCoverage(context),
    ...validateDeletions(context),
  ];
}
