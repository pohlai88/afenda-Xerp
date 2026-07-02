#!/usr/bin/env tsx
/**
 * Fails when agent/IDE scratch files are still tracked in git.
 */
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  LOCAL_ARTIFACT_SURFACE_RULE,
  isForbiddenTrackedArtifactPath,
} from "./local-artifact-registry.mjs";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

export interface LocalArtifactLeakageViolation {
  readonly path: string;
  readonly message: string;
  readonly rule: string;
}

export function checkLocalArtifactLeakage(
  root = repoRoot
): LocalArtifactLeakageViolation[] {
  const tracked = execSync("git ls-files", {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const violations: LocalArtifactLeakageViolation[] = [];

  for (const path of tracked) {
    if (!isForbiddenTrackedArtifactPath(path)) {
      continue;
    }

    violations.push({
      path,
      message:
        "Local agent/IDE artifact must not be tracked — git rm --cached and ensure .gitignore",
      rule: LOCAL_ARTIFACT_SURFACE_RULE,
    });
  }

  return violations;
}

export function formatLocalArtifactLeakageViolations(
  violations: readonly LocalArtifactLeakageViolation[]
): string {
  return violations
    .map(
      (violation) =>
        `  ${violation.path}\n    ${violation.message}\n    rule: ${violation.rule}`
    )
    .join("\n");
}

function main() {
  const violations = checkLocalArtifactLeakage();

  if (violations.length === 0) {
    console.log(`local-artifact-leakage: OK (${LOCAL_ARTIFACT_SURFACE_RULE})`);
    return;
  }

  console.error(formatLocalArtifactLeakageViolations(violations));
  console.error(
    `\nlocal-artifact-leakage: FAIL (${violations.length} violation(s))`
  );
  process.exitCode = 1;
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-local-artifact-leakage.mts")
    );
  } catch {
    return entry.endsWith("check-local-artifact-leakage.mts");
  }
})();

if (isDirectRun) {
  main();
}
