import { getPackageLayer } from "@afenda/architecture-authority";
import type { AiViolation } from "../contracts/ai-change.contract.js";
import {
  ARCHITECTURE_AUTHORITY_PACKAGE,
  BUSINESS_LOGIC_FORBIDDEN_LAYERS,
  DEEP_RELATIVE_PACKAGE_PATTERN,
  DOMAIN_LAYER,
  FORBIDDEN_AI_PACKAGE_PATTERNS,
  FORBIDDEN_BROAD_SCOPE_GLOBS,
  IMPORT_PATTERN,
  PRIVATE_AFENDA_SUBPATH_PATTERN,
  extractWorkspacePackageName,
  isPublicExportSpecifier,
} from "../policies/ai-boundary-policy.js";
import { pathMatchesAnyGlob } from "../utils/glob.js";
import type { AiGovernanceContext } from "./validate-ai-change.js";

function validateForbiddenPackageNames(
  context: AiGovernanceContext
): AiViolation[] {
  const violations: AiViolation[] = [];

  for (const workspace of context.workspaces) {
    for (const pattern of FORBIDDEN_AI_PACKAGE_PATTERNS) {
      if (pattern.test(workspace.directoryName)) {
        violations.push({
          invariant: "AI-003",
          gate: "boundaries",
          message: `forbidden package directory name pattern: ${workspace.directoryName}`,
          path: workspace.packageJson.name,
        });
      }
    }
  }

  return violations;
}

function validateScopePaths(context: AiGovernanceContext): AiViolation[] {
  if (context.mode !== "scope" || !context.scopeManifest) {
    return [];
  }

  const violations: AiViolation[] = [];
  const { allowedPaths, forbiddenPaths, tip } = context.scopeManifest;

  for (const path of context.changedFiles) {
    if (pathMatchesAnyGlob(path, forbiddenPaths)) {
      violations.push({
        invariant: "AI-004",
        gate: "scope",
        message: `changed file matches forbiddenPaths in scope manifest (TIP: ${tip})`,
        path,
      });
      continue;
    }

    if (!pathMatchesAnyGlob(path, allowedPaths)) {
      violations.push({
        invariant: "AI-004",
        gate: "scope",
        message: `changed file is outside declared PAS scope (TIP: ${tip})`,
        path,
      });
    }
  }

  return violations;
}

function validateBroadScopeGlobs(context: AiGovernanceContext): AiViolation[] {
  if (context.mode !== "scope" || !context.scopeManifest) {
    return [];
  }

  const violations: AiViolation[] = [];

  for (const glob of context.scopeManifest.allowedPaths) {
    if (!(FORBIDDEN_BROAD_SCOPE_GLOBS as readonly string[]).includes(glob)) {
      continue;
    }

    if (!context.scopeManifest.scopeExpansionAdr) {
      violations.push({
        invariant: "AI-004-SCOPE",
        gate: "scope-drift",
        message: `broad scope glob not permitted without scopeExpansionAdr: ${glob}`,
      });
    }
  }

  return violations;
}

function validateBusinessLogicBoundaries(
  context: AiGovernanceContext
): AiViolation[] {
  if (context.mode !== "scope") {
    return [];
  }

  const violations: AiViolation[] = [];

  for (const path of context.changedFiles) {
    const source = context.sourceFilesByPath.get(path);
    if (!source) {
      continue;
    }

    const workspace = context.workspaces.find((entry) =>
      path.replaceAll("\\", "/").includes(entry.root.replaceAll("\\", "/"))
    );

    if (!workspace) {
      continue;
    }

    const layer = getPackageLayer(workspace.packageJson.name);
    const isForbiddenLayer = (BUSINESS_LOGIC_FORBIDDEN_LAYERS as readonly string[]).includes(
      layer ?? ""
    );

    if (!isForbiddenLayer && workspace.packageJson.name !== ARCHITECTURE_AUTHORITY_PACKAGE) {
      continue;
    }

    for (const match of source.matchAll(IMPORT_PATTERN)) {
      const specifier = match[1] ?? match[2] ?? match[3];
      if (!specifier?.startsWith("@afenda/")) {
        continue;
      }

      const importedPackage = extractWorkspacePackageName(specifier);
      const importedLayer = getPackageLayer(importedPackage);

      if (importedLayer === DOMAIN_LAYER) {
        violations.push({
          invariant: "AI-005",
          gate: "boundaries",
          message: `${workspace.packageJson.name} must not import domain package ${importedPackage}`,
          path,
        });
      }
    }
  }

  return violations;
}

function isTestOrFixturePath(path: string): boolean {
  return (
    path.includes("/__tests__/") ||
    path.includes("/tests/") ||
    path.endsWith(".test.ts") ||
    path.endsWith(".test.tsx") ||
    path.endsWith(".spec.ts") ||
    path.endsWith(".spec.tsx")
  );
}

function validateImports(context: AiGovernanceContext): AiViolation[] {
  const violations: AiViolation[] = [];
  const exportMap = new Map(
    context.packageExports.map((entry) => [entry.packageName, entry.exportKeys])
  );

  const pathsToScan =
    context.mode === "scope"
      ? context.changedFiles
      : [...context.sourceFilesByPath.keys()].filter(
          (path) => !isTestOrFixturePath(path)
        );

  for (const path of pathsToScan) {
    const source = context.sourceFilesByPath.get(path);
    if (!source) {
      continue;
    }

    for (const match of source.matchAll(IMPORT_PATTERN)) {
      const specifier = match[1] ?? match[2] ?? match[3];
      if (!specifier) {
        continue;
      }

      if (DEEP_RELATIVE_PACKAGE_PATTERN.test(specifier)) {
        violations.push({
          invariant: "AI-006",
          gate: "boundaries",
          message: `deep relative import across package boundary: ${specifier}`,
          path,
        });
        continue;
      }

      if (!specifier.startsWith("@afenda/")) {
        continue;
      }

      if (PRIVATE_AFENDA_SUBPATH_PATTERN.test(specifier)) {
        violations.push({
          invariant: "AI-006",
          gate: "boundaries",
          message: `private import path blocked: ${specifier}`,
          path,
        });
        continue;
      }

      const packageName = extractWorkspacePackageName(specifier);
      const exportKeys = exportMap.get(packageName);

      if (!exportKeys) {
        continue;
      }

      if (!isPublicExportSpecifier(specifier, exportKeys)) {
        violations.push({
          invariant: "AI-006",
          gate: "boundaries",
          message: `import must use public export entrypoint: ${specifier}`,
          path,
        });
      }
    }
  }

  return violations;
}

export function validateAiBoundaries(context: AiGovernanceContext): AiViolation[] {
  return [
    ...validateForbiddenPackageNames(context),
    ...validateScopePaths(context),
    ...validateBroadScopeGlobs(context),
    ...validateBusinessLogicBoundaries(context),
    ...validateImports(context),
  ];
}
