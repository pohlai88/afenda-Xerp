#!/usr/bin/env tsx
/**
 * Fails when agent/IDE scratch files are still tracked in git.
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  isForbiddenTrackedArtifactPath,
  LOCAL_ARTIFACT_GITIGNORE_LINES,
  LOCAL_ARTIFACT_SURFACE_RULE,
} from "./local-artifact-registry.mjs";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

export interface LocalArtifactLeakageViolation {
  readonly message: string;
  readonly path: string;
  readonly rule: string;
}

export function checkGitignoreArtifactLines(
  root = repoRoot
): LocalArtifactLeakageViolation[] {
  const gitignorePath = join(root, ".gitignore");
  let content: string;

  try {
    content = readFileSync(gitignorePath, "utf8");
  } catch {
    return [
      {
        path: ".gitignore",
        message: "Missing .gitignore — cannot verify local artifact lines",
        rule: LOCAL_ARTIFACT_SURFACE_RULE,
      },
    ];
  }

  const violations: LocalArtifactLeakageViolation[] = [];

  for (const line of LOCAL_ARTIFACT_GITIGNORE_LINES) {
    if (!content.includes(line)) {
      violations.push({
        path: ".gitignore",
        message: `Missing gitignore line for local artifact: ${line}`,
        rule: LOCAL_ARTIFACT_SURFACE_RULE,
      });
    }
  }

  return violations;
}

export function checkLocalArtifactLeakage(
  root = repoRoot
): LocalArtifactLeakageViolation[] {
  const violations: LocalArtifactLeakageViolation[] = [
    ...checkGitignoreArtifactLines(root),
  ];

  const tracked = execSync("git ls-files", {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

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
